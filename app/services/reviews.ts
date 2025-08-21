import services from ".";
import ldb from "../base/lib/ldb";
import utils from "../utils";

const _reviewCache: any[] = []

async function loadMoreCardsToReview(): Promise<any> {

	console.log('in load More Cards', _reviewCache);
	
	// Check if we have cached reviews
	if (_reviewCache.length > 0) {
		return _reviewCache.shift()
	}

	/* 
	fetch to /api/v1/reviews/queue?limit=2&device_id=${device_id}
	{
		"items": [
			{
			"saved_card_id": "a7aa7807-4846-4941-a18c-86f5b681323c",
			"card_id": "0e8c7bae-4b21-4d42-b4d4-eb605d1382d6",
			"front": "Today-20-a",
			"back": "20:54",
			"state": "new",
			"due_at": "2025-08-20T18:54:53.657465+00:00"
			},
			{
			"saved_card_id": "3fe0c8bf-5172-4d19-8a53-b79210903224",
			"card_id": "faa02e48-0876-4108-8511-6d396f6c04c5",
			"front": "AFTER RLS",
			"back": "DONE",
			"state": "new",
			"due_at": "2025-08-20T19:00:24.378478+00:00"
			}
		],
		"count": 6
	}
	*/
	const device_id = utils.device.getId()
	const auth = services.supabase.auth.getSession()
	const url = `/api/v1/reviews/queue?limit=10&device_id=${device_id}`
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${auth?.access_token}`
		}
	})
	const data = await response.json()
	if (data.items.length === 0) {
		console.log('--- length is 0');
		
		await services.studySession.end()
		return null
	}
	_reviewCache.push(...data.items.map((item: any) => ({
		added: false,
		card_id: item.card_id,
		saved_card_id: item.saved_card_id,
		front: item.front,
		back: item.back
	})))
	console.log('end of function ', _reviewCache);


	return await loadMoreCardsToReview()
}

// Submit review
// Todo: add SubmitReviewBody
let endTimeout: NodeJS.Timeout | null = null;
async function submitReview(savedCardId: string, options: Partial<{ correct: boolean, rating: 0 | 1 | 2 | 3, duration_ms: number, confidence: number, think_time_ms: number }> = {}) {
	if (endTimeout) clearTimeout(endTimeout);
	const deviceId = utils.device.getId();
	const auth = services.supabase.auth.getSession()

	let possibleSession = ldb.get('liu-session')
	if (!possibleSession) {
		const started = await services.studySession.start()
		possibleSession = started.session_id
		ldb.set('liu-session', possibleSession)
	}
	endTimeout = setTimeout(async () => {
		console.log('en');
		services.studySession.end()
	}, 1000 * 60 * 5) // 5 minutes
	const body: any = {
		saved_card_id: savedCardId,
		client_reviewed_at: new Date().toISOString(),
		device_id: deviceId,
		session_id: possibleSession,
		...options,
	};

	const headers = {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${auth?.access_token}`,
	};

	const response = await fetch('/api/v1/reviews', {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error('Failed to submit review');
	return response.json(); // { ok: true, next: { ... } }
}

export default {
	loadMoreCardsToReview,
	submitReview
};