"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        console.log('headers sent');
        return next(err);
    }
    res.status(500);
    // Or save the error to a database and return the id to the client
    res.json({ error: err });
}
exports.default = {
    logErrors,
    errorHandler
};
