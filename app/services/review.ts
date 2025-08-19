import utils from "../utils";

const API_BASE = '/api/reviews'; // Adjust to your API base
const deviceId = utils.device.getId(); // Your device ID getter
const supabase = createClient(...); // Supabase client

async function getHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    Authorization: `Bearer ${session?.access_token ?? ''}`,
    'Content-Type': 'application/json',
  };
}

// Fetch queue
async function fetchQueue(limit = 50, includeNew = true) {
  const headers = await getHeaders();
  const { data: { user } } = await supabase.auth.getUser();
  const isAnonymous = !user?.id;

  const params = new URLSearchParams({
    limit: limit.toString(),
    include_new: includeNew.toString(),
  });
  if (isAnonymous) params.append('device_id', deviceId);

  const response = await fetch(`${API_BASE}/queue?${params}`, { headers });
  if (!response.ok) throw new Error('Failed to fetch queue');
  return response.json(); // { queue: [...], count: N }
}

// Submit review
async function submitReview(savedCardId: string, rating: 0 | 1 | 2 | 3, options: Partial<SubmitReviewBody> = {}) {
  const headers = await getHeaders();
  const { data: { user } } = await supabase.auth.getUser();
  const isAnonymous = !user?.id;

  const body: SubmitReviewBody = {
    saved_card_id: savedCardId,
    rating,
    client_reviewed_at: new Date().toISOString(),
    ...options,
  };
  if (isAnonymous) body.device_id = deviceId;

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to submit review');
  return response.json(); // { ok: true, next: { ... } }
}

// Usage
fetchQueue().then(console.log);
submitReview('uuid', 2, { duration_ms: 5000, session_id: 'session-uuid' }).then(console.log);