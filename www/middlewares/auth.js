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
exports.requireUserOrDevice = requireUserOrDevice;
const supabase_1 = require("../configs/supabase");
const uuid_1 = require("uuid");
function required(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const auth = req.headers.authorization || '';
        const token = ((_a = auth.match(/^Bearer\s+(.+)$/i)) === null || _a === void 0 ? void 0 : _a[1]) || null;
        if (!token)
            return res.status(401).json({ error: 'Missing Bearer token' });
        const { data, error } = yield supabase_1.supabaseAdmin.auth.getUser(token);
        if (error || !(data === null || data === void 0 ? void 0 : data.user)) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = data.user;
        next();
    });
}
function requireUserOrDevice(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const token = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.match(/^Bearer\s+(.+)$/i)) === null || _b === void 0 ? void 0 : _b[1];
            if (token) {
                const { data } = yield supabase_1.supabaseAdmin.auth.getUser(token);
                req.user = data.user;
            }
            const deviceId = req.header('x-device-id');
            if (!req.user && !deviceId) {
                return res.status(400).json({ error: 'user id or x-device-id header is required' });
            }
            if (!req.user && deviceId && !(0, uuid_1.validate)(deviceId)) {
                return res.status(400).json({ error: 'Invalid x-device-id format' });
            }
            req.user = req.user || {};
            req.user.device_id = deviceId;
            next();
        }
        catch (err) {
            console.error('requireUserOrDevice error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.default = {
    required,
    requireUserOrDevice
};
