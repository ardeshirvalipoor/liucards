"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meassure = meassure;
// import usageService from '../services/usage-service'
const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};
function meassure(req, res, next) {
    const start = process.hrtime();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        // usageService.logUsage({
        //     at: new Date,
        //     durationInMilliseconds,
        //     ip,
        //     method: req.method,
        //     originalUrl: req.originalUrl,
        //     statusCode: res.statusCode
        // })
    });
    res.on('close', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        // console.log(`${req.method} ${req.originalUrl} ${res.statusCode} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
        // usageService.logUsage({
        //     at: new Date,
        //     durationInMilliseconds,
        //     ip,
        //     method: req.method,
        //     originalUrl: req.originalUrl,
        //     statusCode: res.statusCode
        // })
    });
    next();
}
