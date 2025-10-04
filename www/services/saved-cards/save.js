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
exports.default = default_1;
const supabase_1 = require("../../configs/supabase");
const helpers_1 = require("./helpers");
function default_1(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, deviceId, cardId, followUpdates = false } = params;
        // Validation
        if (!cardId) {
            throw new Error('Card ID is required');
        }
        try {
            // Fetch card details
            const { data: card, error: cardError } = yield supabase_1.supabaseAdmin
                .from('cards')
                .select('id, content_version, user_id, device_id, channel_id, visibility')
                .eq('id', cardId)
                .single();
            if (cardError || !card) {
                console.error('Card fetch error:', cardError);
                throw new Error('Card not found');
            }
            // Check permissions
            // checkCardAccess(card, userId, deviceId);
            // Determine source kind
            const source_kind = helpers_1.default.determineSourceKind(card, userId, deviceId);
            // Check if already exists
            const auth = helpers_1.default.getAuthFilter(userId, deviceId);
            let existingQuery = supabase_1.supabaseAdmin
                .from('saved_cards')
                .select('id')
                .eq('card_id', cardId)
                .eq(auth.column, auth.value);
            const { data: existing } = yield existingQuery.single();
            const isNew = !existing;
            // Prepare saved card data
            const savedCardData = {
                user_id: userId,
                device_id: userId ? null : deviceId,
                card_id: cardId,
                source_kind,
                source_version: card.content_version,
                follow_updates: followUpdates || (source_kind === 'channel')
            };
            // Upsert
            const onConflictColumns = userId ? 'user_id,card_id' : 'device_id,card_id';
            const { data: savedCard, error: upsertError } = yield supabase_1.supabaseAdmin
                .from('saved_cards')
                .upsert(savedCardData, {
                onConflict: onConflictColumns,
                ignoreDuplicates: false
            })
                .select('id, source_kind, source_version, follow_updates')
                .single();
            if (upsertError) {
                console.error('Upsert error:', upsertError);
                throw upsertError;
            }
            return {
                saved_card_id: savedCard.id,
                source_kind: savedCard.source_kind,
                source_version: savedCard.source_version,
                current_version: card.content_version,
                follow_updates: savedCard.follow_updates,
                is_new: isNew
            };
        }
        catch (error) {
            console.error('Save card operation failed:', error);
            throw error;
        }
    });
}
