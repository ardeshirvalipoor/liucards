"use strict";
// app.ts
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const routes_1 = require("./routes");
const app = express();
app.enable('trust proxy'); // needed for correct req.secure behind Fly proxy
app.use(logger('dev'));
app.use(express.json());
app.use(routes_1.default);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req, res) => res.status(200).send('ok'));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
// catch 404 and forward to error handler
app.use((req, _res, next) => {
    next(createError(404));
});
// error handler
app.use((err, req, res, _next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
