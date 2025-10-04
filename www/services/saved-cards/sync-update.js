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
        const { userId, deviceId, cardId } = params;
        try {
            // Get current card version
            const { data: card } = yield supabase_1.supabaseAdmin
                .from('cards')
                .select('content_version')
                .eq('id', cardId)
                .single();
            if (!card) {
                throw new Error('Card not found');
            }
            // Update saved card's source version
            const auth = helpers_1.default.getAuthFilter(userId, deviceId);
            const { data: updated, error } = yield supabase_1.supabaseAdmin
                .from('saved_cards')
                .update({
                source_version: card.content_version,
                updated_at: new Date().toISOString()
            })
                .eq('card_id', cardId)
                .eq(auth.column, auth.value)
                .select('id')
                .single();
            if (error || !updated) {
                throw new Error('Saved card not found');
            }
            return {
                synced: true,
                new_version: card.content_version
            };
        }
        catch (error) {
            console.error('Sync updates failed:', error);
            throw error;
        }
    });
}
