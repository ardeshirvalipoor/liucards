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
function default_1(metadata) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield supabase_1.supabaseAdmin
                .from('analytics_events')
                .insert({
                event_type: metadata.event_type,
                user_id: metadata.user_id,
                device_id: metadata.device_id,
                card_id: metadata.card_id,
                metadata: metadata
                // created_at is auto-set by DB
            });
        }
        catch (err) {
            console.error('Analytics logging failed:', err);
        }
    });
}
