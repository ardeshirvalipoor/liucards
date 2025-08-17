// supabase/functions/embed-batch/index.ts
// Deno runtime (Edge Functions)
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---- Config via secrets ----
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY"); // optional if using OpenAI
const EMBED_MODEL = Deno.env.get("EMBED_MODEL") ?? "text-embedding-3-small";
const BATCH_SIZE = Number(Deno.env.get("BATCH_SIZE") ?? "50");
const LOCK_SECONDS = Number(Deno.env.get("LOCK_SECONDS") ?? "120");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function embedText(text: string): Promise<number[]> {
  if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set");
  const resp = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({ input: text, model: EMBED_MODEL })
  });
  if (!resp.ok) {
    const e = await resp.text();
    throw new Error(`OpenAI embeddings failed: ${resp.status} ${e}`);
  }
  const json = await resp.json();
  const vec = json?.data?.[0]?.embedding as number[] | undefined;
  if (!Array.isArray(vec)) throw new Error("No embedding vector returned");
  return vec;
}

async function processBatch(): Promise<{ processed: number; failures: number }> {
  // 1) Claim a batch atomically
  const { data: claimed, error: claimErr } = await supabase
    .rpc("claim_embedding_batch", { p_limit: BATCH_SIZE, p_lock_seconds: LOCK_SECONDS });
  if (claimErr) throw new Error(`claim_embedding_batch failed: ${claimErr.message}`);

  const ids: string[] = (claimed ?? []).map((r: any) => r.card_id);
  if (ids.length === 0) return { processed: 0, failures: 0 };

  // 2) Pull the card text for those ids
  const { data: cards, error: cardErr } = await supabase
    .from("cards")
    .select("id, front, back")
    .in("id", ids);
  if (cardErr) throw new Error(`cards fetch failed: ${cardErr.message}`);

  // 3) For each card, compute embedding and upsert
  let ok = 0, fail = 0;
  for (const c of (cards ?? [])) {
    try {
      const text = `${c.front ?? ""}\n${c.back ?? ""}`.trim();
      const vec = await embedText(text);

      const { error: upErr } = await supabase
        .from("card_embeddings")
        .upsert({ card_id: c.id, embedding: vec, model: EMBED_MODEL }, { onConflict: "card_id" });
      if (upErr) throw upErr;

      // remove from queue on success
      const { error: dqErr } = await supabase.from("embedding_queue").delete().eq("card_id", c.id);
      if (dqErr) throw dqErr;

      ok++;
    } catch (err) {
      fail++;
      // record the error, release lock so it can retry later
      await supabase.from("embedding_queue").update({
        last_error: String(err),
        locked_until: null  // unlock to retry in a later run
      }).eq("card_id", c.id);
    }
  }
  return { processed: ok, failures: fail };
}

serve(async (_req) => {
  try {
    const { processed, failures } = await processBatch();
    return new Response(JSON.stringify({ processed, failures }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
