import { supabaseAdmin } from "../../configs/supabase"

export default async function (identifier: string): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { count, error } = await supabaseAdmin
        .from('cards')
        .select('*', { count: 'exact', head: true })
        .or(`user_id.eq.${identifier},device_id.eq.${identifier}`)
        .gte('created_at', oneHourAgo)

    if (error) {
        console.error('Rate limit check failed:', error)
        return 0 // Be permissive on error
    }

    return count || 0
}