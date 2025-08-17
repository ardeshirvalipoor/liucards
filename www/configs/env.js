"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function requireEnv(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env var ${name}`);
    return v;
}
exports.env = {
    SUPABASE_URL: requireEnv('SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    PORT: parseInt(process.env.PORT || '5001', 10),
};
