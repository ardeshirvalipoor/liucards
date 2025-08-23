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
function create(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, front, back, deviceId, clientCreatedAt } = params;
        // Insert into cards (unchanged)
        const insertPayload = {
            channel_id: null,
            user_id: userId,
            device_id: userId ? null : deviceId, // Null for logged-in, set for anonymous
            visibility: 'private',
            front,
            back,
        };
        if (clientCreatedAt)
            insertPayload.client_created_at = clientCreatedAt;
        const { data: card, error: e1 } = yield supabase_1.supabaseAdmin
            .from('cards')
            .insert(insertPayload)
            .select('id, content_version, created_at')
            .single();
        if (e1) {
            console.error('Error creating card:', e1);
            throw new Error(e1.message);
        }
        // Upsert into saved_cards, with symmetric device_id handling
        const { error: e2 } = yield supabase_1.supabaseAdmin
            .from('saved_cards')
            .upsert({
            user_id: userId,
            device_id: userId ? null : deviceId, // Key change: null for logged-in, set for anonymous
            card_id: card.id,
            source_kind: 'self',
            source_version: card.content_version
        }, { onConflict: 'user_id,card_id' });
        if (e2) {
            console.error('Error saving save-card:', e2);
            throw new Error(e2.message);
        }
        return { cardId: card.id };
    });
}
function list(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, deviceId, limit, before, q, source = 'all', dueOnly = false } = params;
        if (userId) {
            // Logged-in: saved_cards join cards
            let select = supabase_1.supabaseAdmin
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
          cards!inner ( id, front, back, created_at, updated_at )
        `)
                .eq('user_id', userId)
                .order('updated_at', { ascending: false })
                .limit(limit);
            if (before)
                select = select.lt('updated_at', before);
            if (dueOnly)
                select = select.lte('due_at', new Date().toISOString());
            if (source !== 'all')
                select = select.eq('source_kind', source);
            // naive search on front/back
            if (q) {
                // PostgREST can't OR across joined columns easily, so filter after fetch if needed.
                const { data, error } = yield select;
                if (error)
                    throw new Error(error.message);
                const rows = (data !== null && data !== void 0 ? data : []).filter(r => {
                    var _a, _b, _c, _d;
                    const f = (_b = (_a = r.cards.front) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : '';
                    const b = (_d = (_c = r.cards.back) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : '';
                    const needle = q.toLowerCase();
                    return f.includes(needle) || b.includes(needle);
                });
                return rows.map(mapLoggedInRow);
            }
            const { data, error } = yield select;
            if (error)
                throw new Error(error.message);
            return (data !== null && data !== void 0 ? data : []).map(mapLoggedInRow);
        }
        else {
            // Anonymous: require deviceId
            if (!deviceId)
                throw new Error('device_id is required when not logged in');
            let qCards = supabase_1.supabaseAdmin
                .from('cards')
                .select('id, front, back, created_at, updated_at')
                .eq('device_id', deviceId)
                .is('user_id', null)
                .is('channel_id', null)
                .eq('visibility', 'private')
                .order('created_at', { ascending: false })
                .limit(limit);
            if (before)
                qCards = qCards.lt('created_at', before);
            if (q)
                qCards = qCards.ilike('front', `%${q}%`); // search only front to keep it simple
            const { data, error } = yield qCards;
            if (error)
                throw new Error(error.message);
            return (data !== null && data !== void 0 ? data : []).map(c => ({
                // anonymous payload shape
                saved_card_id: null,
                card_id: c.id,
                front: c.front,
                back: c.back,
                state: 'new',
                due_at: null,
                created_at: c.created_at,
                updated_at: c.updated_at,
                source_kind: 'self'
            }));
        }
    });
}
function mapLoggedInRow(row) {
    return {
        saved_card_id: row.id,
        card_id: row.card_id,
        front: row.cards.front,
        back: row.cards.back,
        state: row.state,
        due_at: row.due_at,
        updated_at: row.updated_at,
        source_kind: row.source_kind
    };
}
exports.default = {
    create,
    list
};
