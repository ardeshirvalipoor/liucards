"use strict";
// app.use((req, res, next) => {
//     if (req.path.substr(-1) == '/' && req.path.length > 1) {
//         let query = req.url.slice(req.path.length)
//         res.redirect(301, req.path.slice(0, -1) + query)
//     } else {
//         next()
//     }
// }) // Todo: fix this later
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./auth");
const errors_1 = require("./errors");
exports.default = {
    errors: errors_1.default,
    auth: auth_1.default,
};
