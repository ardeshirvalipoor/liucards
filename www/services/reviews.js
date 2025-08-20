"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_1 = require("../configs/supabase");
const fsrs_1 = require("./fsrs");
function getQueue(identifier_1, limit_1) {
    return __awaiter(this, arguments, void 0, function* (identifier, limit, isDeviceId = false) {
        console.log('Getting review queue for:', identifier, limit, isDeviceId);
        // Due cards, earliest first; optionally exclude 'new'
        let q = supabase_1.supabaseAdmin
            .from('saved_cards')
            .select(`
      id, card_id, state, interval_days, ease, stability, difficulty,
      reps, lapses, due_at, last_reviewed_at,
      cards!inner ( front, back )
    `, { count: 'exact' })
            .lte('due_at', new Date().toISOString())
            .order('due_at', { ascending: true })
            .limit(limit);
        if (isDeviceId) {
            q = q.eq('device_id', identifier).is('user_id', null);
        }
        else {
            q = q.eq('user_id', identifier);
        }
        // if (!includeNew) q = q.neq('state', 'new')
        const { data, error, count } = yield q;
        if (error)
            throw new Error(error.message);
        const items = (data !== null && data !== void 0 ? data : []).map(row => {
            var _a, _b;
            return ({
                saved_card_id: row.id,
                card_id: row.card_id,
                front: (_a = row.cards) === null || _a === void 0 ? void 0 : _a.front,
                back: (_b = row.cards) === null || _b === void 0 ? void 0 : _b.back,
                state: row.state,
                due_at: row.due_at,
            });
        });
        console.log(items);
        return { items, count: count !== null && count !== void 0 ? count : 0 };
    });
}
function submit(identifier_1, body_1) {
    return __awaiter(this, arguments, void 0, function* (identifier, body, isDeviceId = false) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        // 1) Load current row (confirm ownership)
        const { data: sc, error: e1 } = yield supabase_1.supabaseAdmin
            .from('saved_cards')
            .select('id, user_id, device_id, card_id, state, interval_days, ease, stability, difficulty, reps, lapses, due_at, last_reviewed_at, updated_at')
            .eq('id', body.saved_card_id)
            .single();
        if (e1)
            throw new Error(e1.message);
        if (!sc)
            throw new Error('Not found');
        // Ownership check
        let owns = false;
        if (isDeviceId) {
            owns = sc.device_id === identifier && sc.user_id === null;
        }
        else {
            owns = sc.user_id === identifier;
        }
        if (!owns)
            throw new Error('Forbidden');
        // 2) Compute next with FSRS
        const reviewedAt = (_a = body.client_reviewed_at) !== null && _a !== void 0 ? _a : new Date().toISOString();
        const rec = (0, fsrs_1.nextWithFsrs)(sc, body.rating);
        const nextCard = rec.card;
        const nextIntervalDays = Math.max(1, (_b = nextCard.scheduled_days) !== null && _b !== void 0 ? _b : 1);
        const nextDue = nextCard.due.toISOString();
        // 3) Append review log
        const { error: e2 } = yield supabase_1.supabaseAdmin.from('reviews').insert({
            saved_card_id: sc.id,
            reviewed_at: reviewedAt,
            rating: body.rating,
            duration_ms: (_c = body.duration_ms) !== null && _c !== void 0 ? _c : null,
            pre_interval_days: sc.interval_days,
            post_interval_days: nextIntervalDays,
            pre_ease: (_d = sc.ease) !== null && _d !== void 0 ? _d : null,
            post_ease: (_e = sc.ease) !== null && _e !== void 0 ? _e : null,
            correct: (_f = body.correct) !== null && _f !== void 0 ? _f : null,
            confidence: (_g = body.confidence) !== null && _g !== void 0 ? _g : null,
            session_id: (_h = body.session_id) !== null && _h !== void 0 ? _h : null,
            // Omit if columns not added: think_time_ms, hint_count, revealed_back, answer_text
        });
        if (e2)
            throw new Error(e2.message);
        // 4) Update saved_cards
        const { data: updated, error: e3 } = yield supabase_1.supabaseAdmin
            .from('saved_cards')
            .update({
            state: (_j = ['new', 'learning', 'review', 'relearning'][nextCard.state]) !== null && _j !== void 0 ? _j : 'review',
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
            .single();
        if (e3)
            throw new Error(e3.message);
        return updated;
    });
}
exports.default = {
    getQueue,
    submit
};
