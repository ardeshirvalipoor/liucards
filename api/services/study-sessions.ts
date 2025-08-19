import { supabaseAdmin } from '../configs/supabase'
import { EndSessionBody } from '../schemas/review-session';

async function startSession(identifier: string, deviceType: string, isDeviceId: boolean = false) {
	const insertData: any = {
		started_at: new Date().toISOString(),
		device_type: deviceType,
	};
	if (isDeviceId) {
		insertData.device_id = identifier;
	} else {
		insertData.user_id = identifier;
	}
	const { data, error } = await supabaseAdmin.from('study_sessions').insert(insertData).select('id').single();
	if (error) throw new Error(error.message);
	return data.id;
}

async function endSession(identifier: string, body: EndSessionBody, isDeviceId: boolean = false) {
	// Confirm ownership
	const { data: session, error: e1 } = await supabaseAdmin
		.from('study_sessions')
		.select('id, user_id, device_id')
		.eq('id', body.session_id)
		.single();
	if (e1) throw new Error(e1.message);
	if (!session) throw new Error('Not found');

	let owns = false;
	if (isDeviceId) {
		owns = session.device_id === identifier && session.user_id === null;
	} else {
		owns = session.user_id === identifier;
	}
	if (!owns) throw new Error('Forbidden');

	// Update with aggregates
	const updates = {
		ended_at: new Date().toISOString(),
		cards_studied: body.cards_studied,
		cards_correct: body.cards_correct,
		total_time_ms: body.total_time_ms ?? null,
	};
	const { error: e2 } = await supabaseAdmin.from('study_sessions').update(updates).eq('id', body.session_id);
	if (e2) throw new Error(e2.message);

	return { ok: true };
}

export default {
	startSession,
	endSession
}