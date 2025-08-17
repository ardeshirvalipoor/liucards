"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsAuthMiddleware = wsAuthMiddleware;
const jwt = require("jsonwebtoken");
function wsAuthMiddleware(req, res, next, configs) {
    const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
    if (!token) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Unauthorized');
        return;
    }
    try {
        const decoded = jwt.verify(token, configs.jwt.SECRET); // Replace with your actual secret key
        req.user = decoded.user; // todo: fix it
        req.email = decoded.email;
        next();
    }
    catch (error) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Unauthorized');
    }
}
