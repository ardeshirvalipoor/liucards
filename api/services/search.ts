import { supabaseAdmin } from '../configs/supabase';
// Assume you have an embedQuery function like this (adapted from your edge function)
async function embedQuery(text: string): Promise<number[]> {
	const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Or wherever you store it
	if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set');

	const resp = await fetch('https://api.openai.com/v1/embeddings', {
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
		const e = await resp.text();
		throw new Error(`OpenAI embeddings failed: ${resp.status} ${e}`);
	}

	const json = await resp.json() as {
		data?: Array<{ embedding?: number[] }>;
	};
	const vec = json?.data?.[0]?.embedding;
	console.log('Embedding vector:', vec);

	if (!Array.isArray(vec)) throw new Error('No embedding vector returned');
	return vec;
}

async function searchSimilarCards(queryText: string, limit: number = 5, threshold: number = 0.7) {
  console.log('Searching similar cards for query:', queryText, 'limit:', limit, 'threshold:', threshold);

  const queryEmbedding = await embedQuery(queryText);  // Returns number[]

  const { data, error, count } = await supabaseAdmin.rpc('search_similar_cards', {
    query_embedding: queryEmbedding,  // Direct array
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) throw new Error(error.message);

  const items = (data ?? []).map(row => ({
    card_id: row.card_id,
    front: row.front,
    back: row.back,
    similarity: row.similarity,
  }));
  console.log(items);

  return { items, count: count ?? 0 };
}

export default { searchSimilarCards }