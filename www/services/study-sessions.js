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
const supabase_1 = require("../configs/supabase");
function startSession(identifier_1, deviceType_1) {
    return __awaiter(this, arguments, void 0, function* (identifier, deviceType, isDeviceId = false) {
        const insertData = {
            started_at: new Date().toISOString(),
            device_type: deviceType,
        };
        if (isDeviceId) {
            insertData.device_id = identifier;
        }
        else {
            insertData.user_id = identifier;
        }
        const { data, error } = yield supabase_1.supabaseAdmin.from('study_sessions').insert(insertData).select('id').single();
        if (error)
            throw new Error(error.message);
        return data.id;
    });
}
function endSession(identifier_1, body_1) {
    return __awaiter(this, arguments, void 0, function* (identifier, body, isDeviceId = false) {
        var _a;
        // Confirm ownership
        const { data: session, error: e1 } = yield supabase_1.supabaseAdmin
            .from('study_sessions')
            .select('id, user_id, device_id')
            .eq('id', body.session_id)
            .single();
        if (e1)
            throw new Error(e1.message);
        if (!session)
            throw new Error('Not found');
        let owns = false;
        if (isDeviceId) {
            owns = session.device_id === identifier && session.user_id === null;
        }
        else {
            owns = session.user_id === identifier;
        }
        if (!owns)
            throw new Error('Forbidden'); // cool
        // Update with aggregates
        const updates = {
            ended_at: new Date().toISOString(),
            cards_studied: body.cards_studied,
            cards_correct: body.cards_correct,
            total_time_ms: (_a = body.total_time_ms) !== null && _a !== void 0 ? _a : null,
        };
        const { error: e2 } = yield supabase_1.supabaseAdmin.from('study_sessions').update(updates).eq('id', body.session_id);
        if (e2)
            throw new Error(e2.message);
        return { ok: true };
    });
}
exports.default = {
    startSession,
    endSession
};
