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
function default_1(_a) {
    return __awaiter(this, arguments, void 0, function* ({ id, user_id, device_id, action }) {
        try {
            const { data: card, error } = yield supabase_1.supabaseAdmin
                .from('cards')
                .select(`
                id,
                user_id,
                device_id,
                visibility
            `)
                .eq('id', id)
                .single();
            if (error || !card) {
                console.error('Card not found or error:', error);
                return false;
            }
            // Check ownership
            const isOwner = (card.user_id && card.user_id === user_id) ||
                (card.device_id && card.device_id === device_id);
            // For edit/delete actions, only owners have permission
            if (action === 'edit' || action === 'delete') {
                return isOwner;
            }
            // For read action, check visibility rules
            if (action === 'read') {
                // Owners can always read their own cards
                if (isOwner)
                    return true;
                // Public cards can be read by anyone
                if (card.visibility === 'public')
                    return true;
                // Add more visibility logic here if needed
                // e.g., shared cards, team cards, etc.
            }
            return false;
        }
        catch (err) {
            console.error('Permission check failed:', err);
            return false;
        }
    });
}
