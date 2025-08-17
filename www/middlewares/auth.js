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
// Strict: 401 if missing/invalid token
function required(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = req.headers.authorization || '';
        const m = auth.match(/^Bearer\s+(.+)$/i);
        if (!m)
            return res.status(401).json({ error: 'Missing Bearer token' });
        const token = m[1];
        const { data, error } = yield supabase_1.supabaseAdmin.auth.getUser(token);
        if (error || !(data === null || data === void 0 ? void 0 : data.user)) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = data.user;
        next();
    });
}
// Lenient: attaches req.user if token is valid; continues otherwise
function optional(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const auth = req.headers.authorization || '';
        const m = auth.match(/^Bearer\s+(.+)$/i);
        if (!m)
            return next();
        const token = m[1];
        const { data } = yield supabase_1.supabaseAdmin.auth.getUser(token);
        if (data === null || data === void 0 ? void 0 : data.user)
            req.user = data.user;
        next();
    });
}
exports.default = {
    required,
    optional
};
