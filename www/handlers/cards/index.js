"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const edit_1 = require("./edit");
const find_1 = require("./find");
const list_1 = require("./list");
const post_1 = require("./post");
const remove_1 = require("./remove");
exports.default = {
    post: post_1.default,
    edit: edit_1.default,
    remove: remove_1.default,
    list: list_1.default,
    find: find_1.default
};
