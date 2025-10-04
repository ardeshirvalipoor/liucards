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
        console.log(payload);
        try {
            // const hasPermission = await idorCheck({
            //     id,
            //     user_id,
            //     device_id,
            //     action: 'edit'
            // })
            // if (!hasPermission) {
            //     const error: any = new Error('Unauthorized to edit this card')
            //     error.code = 'UNAUTHORIZED'
            //     throw error
            // }
            let query = supabase_1.supabaseAdmin
                .from('cards')
                .update(updateData)
                .eq('id', id);
            if (user_id) {
                query = query.eq('user_id', user_id);
            }
            if (device_id) {
                query = query.eq('device_id', device_id);
            }
            // Update the card (version and updated_at handled by trigger)
            const { data: updatedCard, error: updateError } = yield query.select('id, content_version').single();
            if (updateError || !updatedCard) {
                // Either card doesn't exist OR user doesn't have permission
                const errorMessage = (updateError === null || updateError === void 0 ? void 0 : updateError.message) || 'Card not found or unauthorized';
                const error = new Error(errorMessage);
                error.code = (updateError === null || updateError === void 0 ? void 0 : updateError.code) === 'PGRST116' ? 'NOT_FOUND_OR_UNAUTHORIZED' : 'UPDATE_FAILED';
                throw error;
            }
            if (!updatedCard && !updateError) {
                throw new Error('Card not found or no permission to edit');
            }
            // Update saved_cards source_version
            const { error } = yield supabase_1.supabaseAdmin
                .from('saved_cards')
                .update({
                source_version: updatedCard.content_version,
                updated_at: new Date().toISOString()
            })
                .eq('card_id', id);
            if (error) {
                console.warn('Failed to update saved_cards versions:', error);
                // Don't fail the operation, but log it
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
