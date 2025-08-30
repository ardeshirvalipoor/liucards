import { log } from 'node:console'
import { supabaseAdmin } from '../configs/supabase'

async function create(params: {
	userId: string | null
	front: string
	back: string
	deviceId?: string
	clientCreatedAt?: string
	front_audio_url?: string
	back_audio_url?: string
}) {
	const { userId, front, back, deviceId, clientCreatedAt, front_audio_url, back_audio_url } = params;

	// Insert into cards (unchanged)
	const insertPayload: any = {
		channel_id: null,
		user_id: userId,
		device_id: userId ? null : deviceId,  // Null for logged-in, set for anonymous
		visibility: 'private',
		front_audio_url,
		back_audio_url,
		front,
		back,
	};
	console.log('in service:', insertPayload);

	if (clientCreatedAt) insertPayload.client_created_at = clientCreatedAt;
	const { data: card, error: e1 } = await supabaseAdmin
		.from('cards')
		.insert(insertPayload)
		.select('id, content_version, created_at')
		.single();
	if (e1) {
		console.error('Error creating card:', e1);
		throw new Error(e1.message);
	}

	// Upsert into saved_cards, with symmetric device_id handling
	const { error: e2 } = await supabaseAdmin
		.from('saved_cards')
		.upsert({
			user_id: userId,
			device_id: userId ? null : deviceId,  // Key change: null for logged-in, set for anonymous
			card_id: card.id,
			source_kind: 'self',
			source_version: card.content_version
		}, { onConflict: 'user_id,card_id' });
	if (e2) {
		console.error('Error saving save-card:', e2);
		throw new Error(e2.message);
	}

	return { cardId: card.id };
}

async function edit(params: {
	userId: string | null
	deviceId?: string
	cardId: string
	front: string
	back: string
}) {
	const { userId, deviceId, cardId, front, back } = params;

	// Verify ownership
	const { data: card, error: checkError } = await supabaseAdmin
		.from('cards')
		.select('id, user_id, device_id, content_version')
		.eq('id', cardId)
		.single();

	if (checkError || !card) {
		console.error('Error fetching card for edit:', checkError);
		throw new Error(checkError?.message || 'Card not found');
	}

	if (userId && card.user_id !== userId) {
		throw new Error('Unauthorized: Card does not belong to user');
	}
	if (!userId && card.device_id !== deviceId) {
		throw new Error('Unauthorized: Card does not belong to device');
	}

	// Update card content and increment content_version
	const { data: updatedCard, error: updateError } = await supabaseAdmin
		.from('cards')
		.update({
			front,
			back,
			content_version: card.content_version + 1, // Increment directly using fetched value
			updated_at: new Date().toISOString()
		})
		.eq('id', cardId)
		.select('id, content_version')
		.single();

	if (updateError) {
		console.error('Error updating card:', updateError);
		throw new Error(updateError.message);
	}

	// Update saved_cards source_version
	const { error: savedError } = await supabaseAdmin
		.from('saved_cards')
		.update({
			source_version: updatedCard.content_version,
			updated_at: new Date().toISOString()
		})
		.eq('card_id', cardId)
		.eq(userId ? 'user_id' : 'device_id', userId || deviceId);

	if (savedError) {
		console.error('Error updating saved_cards:', savedError);
		throw new Error(savedError.message);
	}

	return { cardId: updatedCard.id, content_version: updatedCard.content_version };
}

async function list(params: {
	userId: string | null
	deviceId?: string
	limit: number
	before?: string
	source?: 'all' | 'self' | 'channel'
	dueOnly?: boolean
}) {
	const { userId, deviceId, limit, before, source = 'all', dueOnly = false } = params;

	// Require deviceId if userId is null
	if (!userId && !deviceId) {
		throw new Error('device_id is required when not logged in');
	}

	// Query saved_cards with user_id or device_id
	let select = supabaseAdmin
		.from('saved_cards')
		.select(`
			id,
			card_id,
			state,
			interval_days,
			ease,
			stability,
			difficulty,
			reps,
			lapses,
			due_at,
			last_reviewed_at,
			updated_at,
			source_kind,
			source_version,
			user_id,
			device_id,
			cards!inner ( id, front, back, created_at, updated_at, content_version, front_audio_url, back_audio_url )
		`);

	if (userId) {
		select = select.eq('user_id', userId);
	} else {
		select = select.eq('device_id', deviceId);
	}

	select = select
		.order('updated_at', { ascending: false })
		.limit(limit);

	if (before) select = select.lt('updated_at', before);
	if (dueOnly) select = select.lte('due_at', new Date().toISOString());
	if (source !== 'all') select = select.eq('source_kind', source);

	const { data, error } = await select;
	if (error) throw new Error(`Failed to fetch cards: ${error.message}`);
	return (data ?? []).map(mapLoggedInRow);
}

function mapLoggedInRow(row: any) {
	return {
		saved_card_id: row.id,
		card_id: row.card_id,
		front: row.cards.front,
		back: row.cards.back,
		front_audio_url: row.cards.front_audio_url,
		back_audio_url: row.cards.back_audio_url,

		state: row.state,
		due_at: row.due_at,
		updated_at: row.updated_at,
		source_kind: row.source_kind,
		user_id: row.user_id,
		device_id: row.device_id
	}
}

export default {
	create,
	edit,
	list
}