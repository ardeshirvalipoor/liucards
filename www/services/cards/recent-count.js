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
function default_1(identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count, error } = yield supabase_1.supabaseAdmin
            .from('cards')
            .select('*', { count: 'exact', head: true })
            .or(`user_id.eq.${identifier},device_id.eq.${identifier}`)
            .gte('created_at', oneHourAgo);
        if (error) {
            console.error('Rate limit check failed:', error);
            return 0; // Be permissive on error
        }
        return count || 0;
    });
}
