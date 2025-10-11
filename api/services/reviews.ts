import { supabaseAdmin } from '../configs/supabase'
import { SubmitReviewBody } from '../schemas/review'
import { nextWithFsrs } from './fsrs'

async function getQueue(identifier: string, limit: number, isDeviceId: boolean = false) {
    // Due cards, earliest first; optionally exclude 'new'
    let q = supabaseAdmin
        .from('saved_cards')
        .select(`
      id, card_id, state, interval_days, ease, stability, difficulty,
      reps, lapses, due_at, last_reviewed_at,
      cards!inner ( front, back, front_audio_url, back_audio_url )
    `, { count: 'exact' })
        .lte('due_at', new Date().toISOString())
        .is('deleted_at', null)
        .order('due_at', { ascending: true })
        .limit(limit)

    if (isDeviceId) {
        q = q.eq('device_id', identifier).is('user_id', null)
    } else {
        q = q.eq('user_id', identifier)
    }

    // if (!includeNew) q = q.neq('state', 'new')

    const { data, error, count } = await q

    if (error) throw new Error(error.message)

    const items = (data ?? []).map(row => ({
        saved_card_id: row.id,
        card_id: row.card_id,
        front: (row.cards as any)?.front,
        back: (row.cards as any)?.back,
        front_audio_url: (row.cards as any)?.front_audio_url,
        back_audio_url: (row.cards as any)?.back_audio_url,
        state: row.state,
        due_at: row.due_at,
    }))

    return { items, count: count ?? 0 }
}

async function submit(identifier: string, body: SubmitReviewBody, isDeviceId: boolean = false) {
    // 1) Load current row (confirm ownership)
    const { data: sc, error: e1 } = await supabaseAdmin
        .from('saved_cards')
        .select('id, user_id, device_id, card_id, state, interval_days, ease, stability, difficulty, reps, lapses, due_at, last_reviewed_at, updated_at')
        .eq('id', body.saved_card_id)
        .single()
    if (e1) throw new Error(e1.message)
    if (!sc) throw new Error('Not found')

    // Ownership check
    let owns = false
    if (isDeviceId) {
        owns = sc.device_id === identifier && sc.user_id === null
    } else {
        owns = sc.user_id === identifier
    }
    if (!owns) throw new Error('Forbidden')

    // 2) Compute next with FSRS
    const reviewedAt = body.client_reviewed_at ?? new Date().toISOString()
    const rec = nextWithFsrs(sc, body.rating)
    const nextCard = rec.card
    const nextIntervalDays = Math.max(1, nextCard.scheduled_days ?? 1)
    const nextDue = nextCard.due.toISOString()

    // 3) Append review log
    const { error: e2 } = await supabaseAdmin.from('reviews').insert({
        saved_card_id: sc.id,
        reviewed_at: reviewedAt,
        rating: body.rating,
        duration_ms: body.duration_ms ?? null,
        pre_interval_days: sc.interval_days,
        post_interval_days: nextIntervalDays,
        pre_ease: sc.ease ?? null,
        post_ease: sc.ease ?? null,
        correct: body.correct ?? null,
        confidence: body.confidence ?? null,
        session_id: body.session_id ?? null,
        // Omit if columns not added: think_time_ms, hint_count, revealed_back, answer_text
    })
    if (e2) throw new Error(e2.message)

    // 4) Update saved_cards
    const { data: updated, error: e3 } = await supabaseAdmin
        .from('saved_cards')
        .update({
            state: ['new', 'learning', 'review', 'relearning'][nextCard.state] ?? 'review',
            interval_days: nextIntervalDays,
            stability: nextCard.stability,
            difficulty: nextCard.difficulty,
            reps: nextCard.reps,
            lapses: nextCard.lapses,
            last_reviewed_at: reviewedAt,
            due_at: nextDue,
            updated_at: new Date().toISOString(),
        })
        .eq('id', sc.id)
        .select('id, state, due_at')
        .single()
    if (e3) throw new Error(e3.message)

    return updated
}

export default {
    getQueue,
    submit
}