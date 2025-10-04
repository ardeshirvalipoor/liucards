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
exports.default = toggleFollowUpdatesHandler;
const services_1 = require("../../services");
const saved_card_1 = require("../../schemas/saved-card");
function toggleFollowUpdatesHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const user_id = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        const device_id = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.device_id) || null;
        const parsed = saved_card_1.toggleFollowUpdatesBodySchema.safeParse(req.body);
        if (!parsed.success) {
            const msg = parsed.error.issues.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        try {
            const result = yield services_1.default.savedCards.toggleFollowUpdates({
                userId: user_id,
                deviceId: device_id,
                cardId: parsed.data.card_id,
                followUpdates: parsed.data.follow_updates
            });
            return res.json({
                saved_card_id: result.saved_card_id,
                follow_updates: result.follow_updates,
                message: `Follow updates ${result.follow_updates ? 'enabled' : 'disabled'}`
            });
        }
        catch (err) {
            console.error('Toggle follow updates failed:', err);
            if (err.message === 'Saved card not found') {
                return res.status(404).json({ error: 'Saved card not found' });
            }
            return res.status(500).json({
                error: 'Failed to toggle follow updates'
            });
        }
    });
}
