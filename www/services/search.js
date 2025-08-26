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
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("../configs/supabase");
// Assume you have an embedQuery function like this (adapted from your edge function)
function embedQuery(text) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Or wherever you store it
        if (!OPENAI_API_KEY)
            throw new Error('OPENAI_API_KEY not set');
        const resp = yield fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                input: text,
                model: 'text-embedding-3-small', // Match your EMBED_MODEL
            }),
        });
        if (!resp.ok) {
            const e = yield resp.text();
            throw new Error(`OpenAI embeddings failed: ${resp.status} ${e}`);
        }
        const json = yield resp.json();
        const vec = (_b = (_a = json === null || json === void 0 ? void 0 : json.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.embedding;
        console.log('Embedding vector:', vec);
        if (!Array.isArray(vec))
            throw new Error('No embedding vector returned');
        return vec;
    });
}
function searchSimilarCards(queryText_1) {
    return __awaiter(this, arguments, void 0, function* (queryText, limit = 5, threshold = 0.7) {
        console.log('Searching similar cards for query:', queryText, 'limit:', limit, 'threshold:', threshold);
        const queryEmbedding = yield embedQuery(queryText); // Returns number[]
        const { data, error, count } = yield supabase_1.supabaseAdmin.rpc('search_similar_cards', {
            query_embedding: queryEmbedding, // Direct array
            match_threshold: threshold,
            match_count: limit,
        });
        if (error)
            throw new Error(error.message);
        const items = (data !== null && data !== void 0 ? data : []).map(row => ({
            card_id: row.card_id,
            front: row.front,
            back: row.back,
            similarity: row.similarity,
        }));
        console.log(items);
        return { items, count: count !== null && count !== void 0 ? count : 0 };
    });
}
exports.default = { searchSimilarCards };
