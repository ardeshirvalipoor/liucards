import services from ".";
import ldb from "../base/lib/ldb";
import utils from "../utils";


async function start() {
	const body: any = {
		device_type: "web",
	}

	const started = await utils.http.post<{ session_id: string }>('/api/v1/reviews/sessions/start', body);
	ldb.set('liu-session', started.session_id)
	return started
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

	const body: any = {
		session_id: sessionId,
		cards_studied: cardsStudied,
		cards_correct: cardsCorrect,
		total_time_ms: totalTimeMs,
	};
	ldb.remove('liu-session') // Clear session after ending
	ldb.remove('liu-cards-studied')
	ldb.remove('liu-cards-correct')
	ldb.remove('liu-total-time-ms')

	const ended = await utils.http.post('/api/v1/reviews/sessions/end', body);
	return ended
}

export default {
	start,
	end,
};