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
const log_1 = require("./log");
const recent_count_1 = require("./recent-count");
function default_1(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const identifier = payload.user_id || payload.device_id;
        const recentCards = yield (0, recent_count_1.default)(identifier);
        if (recentCards > 10) { // Adjust limit as needed
            const error = new Error('Rate limit exceeded');
            error.code = 'RATE_LIMIT';
            throw error;
        }
        const channel_id = payload.channel_id || null; // Temporary, later from payload or user profile
        // if (channel_id) {
        //     const isValidChannel = await validateChannel(channel_id, payload.user_id)
        //     if (!isValidChannel) {
        //         const error: any = new Error('Invalid or inaccessible channel')
        //         error.code = 'INVALID_CHANNEL'
        //         throw error
        //     }
        // }
        const insertPayload = Object.assign(Object.assign({}, payload), { device_id: payload.user_id ? null : payload.device_id, channel_id, visibility: channel_id ? 'public' : 'private' });
        Object.keys(insertPayload).forEach(key => insertPayload[key] === undefined && delete insertPayload[key]);
        const { data, error } = yield supabase_1.supabaseAdmin
            .from('cards')
            .insert(insertPayload)
            .select('id, content_version, created_at')
            .single();
        if (error) {
            console.error('Error creating card:', error);
            // Handle specific Supabase errors
            if (error.code === '23505') { // Unique violation
                throw new Error('Duplicate card detected');
            }
            if (error.code === '23503') { // Foreign key violation
                throw new Error('Invalid reference in card data');
            }
            throw new Error(error.message);
        }
        yield (0, log_1.default)({
            event_type: 'card_created',
            card_id: data.id,
            user_id: payload.user_id,
            device_id: payload.device_id,
            channel_id
        });
        return {
            id: data.id,
            content_version: data.content_version,
            created_at: data.created_at
        };
    });
}
