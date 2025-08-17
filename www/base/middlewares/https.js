"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceHTTPS = forceHTTPS;
function forceHTTPS() {
    return (req, res, next) => {
        if (process.env.NODE_ENV !== 'production')
            return next();
        if (req.secure)
            return next();
        return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
    };
}
