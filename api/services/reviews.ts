import { supabaseAdmin } from '../configs/supabase'
import { nextWithFsrs } from './fsrs'

async function getQueue(userId: string, limit: number, includeNew: boolean) {
    // Due cards, earliest first; optionally exclude 'new'
    let q = supabaseAdmin
        .from('saved_cards')
        .select(`
        id, card_id, state, interval_days, ease, stability, difficulty,
        reps, lapses, due_at, last_reviewed_at,
        cards!inner ( front, back )
      `)
        .eq('user_id', userId)
        .lte('due_at', new Date().toISOString())
        .order('due_at', { ascending: true })
        .limit(limit)

    if (!includeNew) q = q.neq('state', 'new')

    const { data, error } = await q
    if (error) throw new Error(error.message)

    return (data ?? []).map(row => ({
        saved_card_id: row.id,
        card_id: row.card_id,
        front: row.cards.front,
        back: row.cards.back,
        state: row.state,
        due_at: row.due_at,
    }))
}

async function submit(userId: string, body: {
    saved_card_id: string
    rating: 0 | 1 | 2 | 3
    duration_ms?: number
    client_reviewed_at?: string
    correct?: boolean
    confidence?: number
    think_time_ms?: number
    hint_count?: number
    revealed_back?: boolean
    session_id?: string
    answer_text?: string
}) {
    // 1) Load current row (confirm ownership)
    const { data: sc, error: e1 } = await supabaseAdmin
        .from('saved_cards')
        .select('id, user_id, card_id, state, interval_days, ease, stability, difficulty, reps, lapses, due_at, last_reviewed_at, updated_at')
        .eq('id', body.saved_card_id)
        .single()
    if (e1) throw new Error(e1.message)
    if (!sc || sc.user_id !== userId) throw new Error('Forbidden or not found')

    // 2) Compute next with FSRS
    const rec = nextWithFsrs(sc, body.rating)
    const nextCard = rec.card
    const nextIntervalDays = Math.max(1, nextCard.scheduled_days ?? 1)
    const nextDue = nextCard.due.toISOString()

    // 3) Append review log
    const reviewedAt = body.client_reviewed_at ?? new Date().toISOString()
    const { error: e2 } = await supabaseAdmin.from('reviews').insert({
        saved_card_id: sc.id,
        reviewed_at: reviewedAt,
        rating: body.rating,
        duration_ms: body.duration_ms ?? null,
        pre_interval_days: sc.interval_days,
        post_interval_days: nextIntervalDays,
        pre_ease: sc.ease ?? null,
        post_ease: sc.ease ?? null,

        // Optional ML features
        correct: body.correct ?? null,
        confidence: body.confidence ?? null,
        // These extra columns exist if you added them; otherwise omit
        session_id: body.session_id ?? null,
        // If you also added think_time_ms, hint_count, revealed_back, answer_text to reviews:
        // think_time_ms: body.think_time_ms ?? null,
        // hint_count: body.hint_count ?? null,
        // revealed_back: body.revealed_back ?? null,
        // answer_text: body.answer_text ?? null,
    })
    if (e2) throw new Error(e2.message)

    // 4) Update saved_cards with FSRS outputs
    const { data: updated, error: e3 } = await supabaseAdmin
        .from('saved_cards')
        .update({
            state: ['new', 'learning', 'review', 'relearning'][nextCard.state] ?? 'review',
            interval_days: nextIntervalDays,
            // keep ease for backwards-compat but FSRS doesn't use it
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

