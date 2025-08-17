"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
// supabase/functions/embed-batch/index.ts
// Deno runtime (Edge Functions)
const server_ts_1 = require("https://deno.land/std@0.224.0/http/server.ts");
const supabase_js_2_1 = require("https://esm.sh/@supabase/supabase-js@2");
// ---- Config via secrets ----
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY"); // optional if using OpenAI
const EMBED_MODEL = (_a = Deno.env.get("EMBED_MODEL")) !== null && _a !== void 0 ? _a : "text-embedding-3-small";
const BATCH_SIZE = Number((_b = Deno.env.get("BATCH_SIZE")) !== null && _b !== void 0 ? _b : "50");
const LOCK_SECONDS = Number((_c = Deno.env.get("LOCK_SECONDS")) !== null && _c !== void 0 ? _c : "120");
const supabase = (0, supabase_js_2_1.createClient)(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});
function embedText(text) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!OPENAI_API_KEY)
            throw new Error("OPENAI_API_KEY not set");
        const resp = yield fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({ input: text, model: EMBED_MODEL })
        });
        if (!resp.ok) {
            const e = yield resp.text();
            throw new Error(`OpenAI embeddings failed: ${resp.status} ${e}`);
        }
        const json = yield resp.json();
        const vec = (_b = (_a = json === null || json === void 0 ? void 0 : json.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.embedding;
        if (!Array.isArray(vec))
            throw new Error("No embedding vector returned");
        return vec;
    });
}
function processBatch() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // 1) Claim a batch atomically
        const { data: claimed, error: claimErr } = yield supabase
            .rpc("claim_embedding_batch", { p_limit: BATCH_SIZE, p_lock_seconds: LOCK_SECONDS });
        if (claimErr)
            throw new Error(`claim_embedding_batch failed: ${claimErr.message}`);
        const ids = (claimed !== null && claimed !== void 0 ? claimed : []).map((r) => r.card_id);
        if (ids.length === 0)
            return { processed: 0, failures: 0 };
        // 2) Pull the card text for those ids
        const { data: cards, error: cardErr } = yield supabase
            .from("cards")
            .select("id, front, back")
            .in("id", ids);
        if (cardErr)
            throw new Error(`cards fetch failed: ${cardErr.message}`);
        // 3) For each card, compute embedding and upsert
        let ok = 0, fail = 0;
        for (const c of (cards !== null && cards !== void 0 ? cards : [])) {
            try {
                const text = `${(_a = c.front) !== null && _a !== void 0 ? _a : ""}\n${(_b = c.back) !== null && _b !== void 0 ? _b : ""}`.trim();
                const vec = yield embedText(text);
                const { error: upErr } = yield supabase
                    .from("card_embeddings")
                    .upsert({ card_id: c.id, embedding: vec, model: EMBED_MODEL }, { onConflict: "card_id" });
                if (upErr)
                    throw upErr;
                // remove from queue on success
                const { error: dqErr } = yield supabase.from("embedding_queue").delete().eq("card_id", c.id);
                if (dqErr)
                    throw dqErr;
                ok++;
            }
            catch (err) {
                fail++;
                // record the error, release lock so it can retry later
                yield supabase.from("embedding_queue").update({
                    last_error: String(err),
                    locked_until: null // unlock to retry in a later run
                }).eq("card_id", c.id);
            }
        }
        return { processed: ok, failures: fail };
    });
}
(0, server_ts_1.serve)((_req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { processed, failures } = yield processBatch();
        return new Response(JSON.stringify({ processed, failures }), {
            headers: { "Content-Type": "application/json" }
        });
    }
    catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
    }
}));
