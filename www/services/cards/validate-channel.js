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
function default_1(channel_id, user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if channel exists and user has access
        const { data, error } = yield supabase_1.supabaseAdmin
            .from('channels')
            .select('id, is_public, owner_id, member_ids')
            .eq('id', channel_id)
            .single();
        if (error || !data)
            return false;
        // Public channels are accessible to all
        if (data.is_public)
            return true;
        // Check if user is owner or member
        if (user_id) {
            return data.owner_id === user_id ||
                (data.member_ids && data.member_ids.includes(user_id));
        }
        return false;
    });
}
