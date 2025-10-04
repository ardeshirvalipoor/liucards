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
exports.default = bulkCheckSaved;
const supabase_1 = require("../../configs/supabase");
const helpers_1 = require("./helpers");
function bulkCheckSaved(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, deviceId, cardIds } = params;
        if (!cardIds.length || (!userId && !deviceId)) {
            return {};
        }
        try {
            const auth = helpers_1.default.getAuthFilter(userId, deviceId);
            const { data, error } = yield supabase_1.supabaseAdmin
                .from('saved_cards')
                .select(`
                card_id,
                follow_updates,
                source_version,
                cards!inner (
                    content_version
                )
            `)
                .in('card_id', cardIds)
                .eq(auth.column, auth.value);
            if (error) {
                console.error('Error bulk checking saved status:', error);
                return {};
            }
            // Build response
            const result = {};
            // Initialize all as not saved
            cardIds.forEach(id => {
                result[id] = {
                    is_saved: false,
                    follow_updates: false,
                    has_updates: false
                };
            });
            // Update with saved cards
            (data || []).forEach(row => {
                var _a, _b;
                result[row.card_id] = {
                    is_saved: true,
                    follow_updates: row.follow_updates,
                    has_updates: row.source_version < ((_b = (_a = row.cards) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content_version)
                };
            });
            return result;
        }
        catch (error) {
            console.error('Error bulk checking saved status:', error);
            return {};
        }
    });
}
