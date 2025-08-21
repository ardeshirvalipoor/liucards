import services from ".";
import ldb from "../base/lib/ldb";
import utils from "../utils";

const API_BASE = '/api/reviews'; // Shared base

async function start() {
	const deviceId = utils.device.getId();
	const auth = services.supabase.auth.getSession()

	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${auth?.access_token}`,
	}

	const body: any = {
		"device_type": "web",
		"device_id": deviceId,
	}

	const response = await fetch('/api/v1/reviews/sessions/start', {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error('Failed to submit review');
	return response.json(); // { ok: true, next: { ... } }
		// 	{
		// "session_id": "beb154e5-bfe1-4cbb-a168-8bb8f8bac92b"
		// }
}



// End session
async function end() {
	const sessionId = ldb.get('liu-session') || '';
	if (!sessionId) return;
	const cardsStudied = ldb.get('liu-cards-studied') || 0;
	const cardsCorrect = ldb.get('liu-cards-correct') || 0;
	const totalTimeMs = ldb.get('liu-total-time-ms') || 0;
	const deviceId = utils.device.getId();
	const auth = services.supabase.auth.getSession()

	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${auth?.access_token}`,
	}
	const body: any = {
		session_id: sessionId,
		cards_studied: cardsStudied,
		cards_correct: cardsCorrect,
		total_time_ms: totalTimeMs,
		device_id: deviceId,
	};
	ldb.remove('liu-session') // Clear session after ending
	ldb.remove('liu-cards-studied')
	ldb.remove('liu-cards-correct')
	ldb.remove('liu-total-time-ms')

	const response = await fetch('/api/v1/reviews/sessions/end', {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error('Failed to submit review');
	return response.json(); // { ok: true, next: { ... } }
}

export default {
	start,
	end,
};