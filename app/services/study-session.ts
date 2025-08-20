import services from ".";
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
}



// End session
async function end(sessionId: string, cardsStudied: number, cardsCorrect: number, totalTimeMs?: number) {
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