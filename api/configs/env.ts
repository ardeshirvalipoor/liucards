import 'dotenv/config'

function requireEnv(name: string): string {
    const v = process.env[name]
    if (!v) throw new Error(`Missing env var ${name}`)
    return v
}

export const env = {
    SUPABASE_URL: requireEnv('SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    PORT: parseInt(process.env.PORT || '5001', 10),
}
