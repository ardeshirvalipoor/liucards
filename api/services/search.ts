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

	const json = await resp.json();
	const vec = json?.data?.[0]?.embedding;
	if (!Array.isArray(vec)) throw new Error('No embedding vector returned');
	return vec;
}

async function searchSimilarCards(queryText: string, userId: string, limit: number = 5, threshold: number = 0.5) {
  console.log('Searching similar cards for query:', queryText, 'user:', userId, limit, threshold);

  const queryEmbedding = await embedQuery(queryText);
  const queryEmbedStr = `[${queryEmbedding.join(',')}]`; // Format as Postgres array literal

  const q = supabaseAdmin
    .from('card_embeddings')
    .select(`
      card_id,
      similarity:(embedding <=> '${queryEmbedStr}'::vector),
      model,
      cards!inner (front, back),
      saved_cards!left (id as saved_card_id, state, due_at)  // Add left join for user-specific filtering
    `, { count: 'exact' })
    .eq('model', 'text-embedding-3-small')
    .eq('saved_cards.user_id', userId)  // Filter to user's saved cards
    .lt('similarity', threshold)
    .order('similarity', { ascending: true })
    .limit(limit);

  const { data, error, count } = await q;

  if (error) throw new Error(error.message);

  const items = (data ?? []).map(row => ({
    card_id: row.card_id,
    saved_card_id: (row.saved_cards as any)?.saved_card_id,
    front: (row.cards as any)?.front,
    back: (row.cards as any)?.back,
    similarity: row.similarity,
    state: (row.saved_cards as any)?.state,
    due_at: (row.saved_cards as any)?.due_at,
  }));
  console.log(items);

  return { items, count: count ?? 0 };
}

export default { searchSimilarCards }