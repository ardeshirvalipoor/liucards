const API_BASE = '/api/reviews'; // Shared base

// Start session
async function startStudySession(deviceType: string) {
	const headers = await getHeaders(); // From reviews client example
	const { data: { user } } = await supabase.auth.getUser();
	const isAnonymous = !user?.id;

	const body: StartSessionBody = { device_type: deviceType };
	if (isAnonymous) body.device_id = deviceId;

	const response = await fetch(`${API_BASE}/sessions/start`, {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error('Failed to start session');
	return response.json(); // { session_id: 'uuid' }
}

// End session
async function endStudySession(sessionId: string, cardsStudied: number, cardsCorrect: number, totalTimeMs?: number) {
	const headers = await getHeaders();
	const { data: { user } } = await supabase.auth.getUser();
	const isAnonymous = !user?.id;

	const body: EndSessionBody = {
		session_id: sessionId,
		cards_studied: cardsStudied,
		cards_correct: cardsCorrect,
		total_time_ms: totalTimeMs,
	};
	if (isAnonymous) body.device_id = deviceId;

	const response = await fetch(`${API_BASE}/sessions/end`, {
		method: 'POST',
		headers,
		body: JSON.stringify(body),
	});
	if (!response.ok) throw new Error('Failed to end session');
	return response.json(); // { ok: true }
}

// Usage (e.g., wrap around reviews)
startStudySession('web').then(({ session_id }) => {
	// Submit reviews with session_id in body
	// After done:
	endStudySession(session_id, 10, 8, 30000).then(console.log);
});