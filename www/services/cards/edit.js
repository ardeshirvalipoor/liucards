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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const supabase_1 = require("../../configs/supabase");
function default_1(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, user_id, device_id } = payload, updateData = __rest(payload, ["id", "user_id", "device_id"]);
        try {
            let query = supabase_1.supabaseAdmin
                .from('cards')
                .update(updateData)
                .eq('id', id);
            // Authorization: prioritize user_id, fallback to device_id
            if (user_id) {
                // If user is logged in, check user_id only
                query = query.eq('user_id', user_id);
            }
            else if (device_id) {
                // If anonymous, check device_id only
                query = query.eq('device_id', device_id);
            }
            // If neither provided, only id check applies
            const { data: updatedCard, error: updateError } = yield query
                .select('id, content_version')
                .single();
            if (updateError || !updatedCard) {
                const errorMessage = (updateError === null || updateError === void 0 ? void 0 : updateError.message) || 'Card not found or unauthorized';
                const error = new Error(errorMessage);
                error.code = (updateError === null || updateError === void 0 ? void 0 : updateError.code) === 'PGRST116' ? 'NOT_FOUND_OR_UNAUTHORIZED' : 'UPDATE_FAILED';
                throw error;
            }
            // Only update source_version if this is NOT a deletion
            if (!updateData.deleted_at) {
                const { error } = yield supabase_1.supabaseAdmin
                    .from('saved_cards')
                    .update({
                    source_version: updatedCard.content_version,
                    updated_at: new Date().toISOString()
                })
                    .eq('card_id', id);
                if (error) {
                    console.warn('Failed to update saved_cards versions:', error);
                }
            }
            return {
                id: updatedCard.id,
                content_version: updatedCard.content_version
            };
        }
        catch (err) {
            console.error('Edit card failed:', err);
            throw err;
        }
    });
}
