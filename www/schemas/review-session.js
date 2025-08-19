"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endSessionBodySchema = exports.startSessionBodySchema = void 0;
const zod_1 = require("zod");
exports.startSessionBodySchema = zod_1.z.object({
    device_type: zod_1.z.string().min(1), // e.g., 'web', 'ios'
    device_id: zod_1.z.string().optional(), // For anonymous
});
exports.endSessionBodySchema = zod_1.z.object({
    session_id: zod_1.z.uuid(),
    cards_studied: zod_1.z.number().int().min(0),
    cards_correct: zod_1.z.number().int().min(0),
    total_time_ms: zod_1.z.number().int().min(0).optional(),
    device_id: zod_1.z.string().optional(), // For anonymous
});
