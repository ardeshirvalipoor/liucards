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
        var _a, _b, _c, _d;
        const { userId, deviceId, cardId } = params;
        try {
            if (!userId && !deviceId) {
                return { is_saved: false };
            }
            const auth = helpers_1.default.getAuthFilter(userId, deviceId);
            const { data, error } = yield supabase_1.supabaseAdmin
                .from('saved_cards')
                .select(`
                id,
                follow_updates,
                source_version,
                cards!inner (
                    content_version
                )
            `)
                .eq('card_id', cardId)
                .eq(auth.column, auth.value)
                .single();
            if (error || !data) {
                return { is_saved: false };
            }
            return {
                is_saved: true,
                follow_updates: data.follow_updates,
                source_version: data.source_version,
                current_version: (_b = (_a = data.cards) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content_version,
                has_updates: data.source_version < ((_d = (_c = data.cards) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.content_version)
            };
        }
        catch (error) {
            console.error('Error checking saved status:', error);
            return { is_saved: false };
        }
    });
}
// export async function isSaved(params: CheckSavedParams): Promise<boolean> {
//     const result = await checkSavedStatus(params);
//     return result.is_saved;
// }
