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
exports.default = checkSavedHandler;
const services_1 = require("../../services");
const saved_card_1 = require("../../schemas/saved-card");
function checkSavedHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const user_id = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        const device_id = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.device_id) || null;
        const parsed = saved_card_1.checkSavedParamsSchema.safeParse(req.params);
        if (!parsed.success) {
            const msg = parsed.error.issues.map(e => e.message).join(', ');
            return res.status(400).json({ error: msg });
        }
        try {
            const result = yield services_1.default.savedCards.check({
                userId: user_id,
                deviceId: device_id,
                cardId: parsed.data.id
            });
            return res.json({
                card_id: parsed.data.id,
                is_saved: result.is_saved,
                follow_updates: result.follow_updates,
                source_version: result.source_version,
                current_version: result.current_version,
                has_updates: result.has_updates
            });
        }
        catch (err) {
            console.error('Check saved status failed:', err);
            return res.status(500).json({
                error: 'Failed to check saved status'
            });
        }
    });
}
