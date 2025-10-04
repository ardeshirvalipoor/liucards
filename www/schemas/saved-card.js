"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFollowUpdatesBodySchema = exports.bulkCheckSavedBodySchema = exports.checkSavedParamsSchema = exports.unsaveCardParamsSchema = exports.saveCardBodySchema = void 0;
const zod_1 = require("zod");
exports.saveCardBodySchema = zod_1.z.object({
    card_id: zod_1.z.uuid({ message: 'Invalid card_id format, must be a UUID' }),
    follow_updates: zod_1.z.boolean().optional().default(false),
});
exports.unsaveCardParamsSchema = zod_1.z.object({
    id: zod_1.z.uuid({ message: 'Invalid card_id format, must be a UUID' })
});
exports.checkSavedParamsSchema = zod_1.z.object({
    id: zod_1.z.uuid({ message: 'Invalid card_id format, must be a UUID' })
});
exports.bulkCheckSavedBodySchema = zod_1.z.object({
    card_ids: zod_1.z.array(zod_1.z.uuid()).min(1).max(100, 'Maximum 100 cards per request')
});
exports.toggleFollowUpdatesBodySchema = zod_1.z.object({
    card_id: zod_1.z.uuid({ message: 'Invalid card_id format, must be a UUID' }),
    follow_updates: zod_1.z.boolean()
});
