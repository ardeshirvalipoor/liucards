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
const saved_card_1 = require("../../schemas/saved-card");
const services_1 = require("../../services");
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const user_id = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        const device_id = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.device_id) || null;
        // Parse and validate request body
        const parsed = saved_card_1.saveCardBodySchema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.issues.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        try {
            const result = yield services_1.default.savedCards.save({
                userId: user_id,
                deviceId: device_id,
                cardId: parsed.data.card_id,
                followUpdates: parsed.data.follow_updates
            });
            // Always return 201 - endpoint is idempotent
            return res.status(201).json({
                saved_card_id: result.saved_card_id,
                source_kind: result.source_kind,
                source_version: result.source_version,
                current_version: result.current_version,
                follow_updates: result.follow_updates,
                is_new: result.is_new, // true if newly saved, false if already existed
                message: result.is_new ? 'Card saved successfully' : 'Card save updated'
            });
        }
        catch (err) {
            console.error('Save card failed:', err);
            if (err.message === 'Card not found') {
                return res.status(404).json({ error: 'Card not found' });
            }
            if (err.message === 'Cannot save private card you do not own') {
                return res.status(403).json({ error: 'Cannot save private card you do not own' });
            }
            if (err.message === 'Either user_id or device_id is required') {
                return res.status(400).json({ error: 'Authentication required' });
            }
            return res.status(500).json({
                error: err.message || 'Failed to save card'
            });
        }
    });
}
