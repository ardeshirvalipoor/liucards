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
const jwt = require("jsonwebtoken");
function token(secret) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
        const token = authHeader.toString().split(' ').pop();
        if (!token) {
            return res.status(401).json({
                errors: [{ msg: 'Token not found' }],
            });
        }
        try {
            req.user = jwt.verify(token, secret);
            next();
        }
        catch (err) {
            res.status(403).json({
                error: 'Token is not valid, or you do not have access to this area.',
            });
        }
    });
}
function optionalToken(secret) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
        const token = authHeader.toString().split(' ').pop();
        if (token) {
            try {
                req.user = jwt.verify(token, secret);
            }
            catch (err) {
                // Invalid token, ignore and treat as unauthenticated
            }
        }
        next();
    });
}
function authenticateJWTFromCookie(secret) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.jwt;
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ ok: false, error: 'Invalid token' });
                }
                req.user = decoded.user;
                /*
                user: {
                    id: 'EeGz48kyFNBm6pNIEBrP',
                    phone_number: '989121995001',
                    date: 1734464377,
                    contact: null,
                    last_name: 'Notifications',
                    is_bot: false,
                    first_name: 'John',
                    chat_id: 6679445900,
                    username: 'johndoe',
                    at: '2024-12-18T21:57:13.747Z',
                    join_token: '22'
                },
                iat: 1734559110,
                exp: 1737151110
                */
                next();
            });
        }
        else {
            res.status(401).json({ ok: false, error: 'No token provided' });
        }
    });
}
exports.default = {
    token,
    optionalToken,
    authenticateJWTFromCookie,
};
