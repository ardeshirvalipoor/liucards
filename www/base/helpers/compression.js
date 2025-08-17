"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldCompress = shouldCompress;
const compression = require("compression");
function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }
    // fallback to standard filter function
    return compression.filter(req, res);
}
