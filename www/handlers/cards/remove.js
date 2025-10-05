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
const services_1 = require("../../services");
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const user_id = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        const device_id = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.device_id) || null;
        const cardId = req.params.id;
        console.log('Remove card request:', { user_id, device_id, cardId });
        if (!cardId) {
            return res.status(400).json({ error: 'Card ID is required' });
        }
        try {
            const result = yield services_1.default.cards.edit({
                id: cardId,
                user_id,
                device_id,
                deleted_at: new Date().toISOString(),
            });
            return res.json({
                message: 'Card removed successfully',
                id: result.id
            });
        }
        catch (err) {
            console.error('Card removal failed:', err);
            if (err.code === 'NOT_FOUND_OR_UNAUTHORIZED') {
                return res.status(404).json({
                    error: 'Card not found or unauthorized'
                });
            }
            return res.status(500).json({
                error: err.message || 'Failed to remove card'
            });
        }
    });
}
