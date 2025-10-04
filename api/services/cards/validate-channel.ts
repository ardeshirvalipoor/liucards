import { supabaseAdmin } from "../../configs/supabase"

export default async function (channel_id: string, user_id: string | null): Promise<boolean> {
    // Check if channel exists and user has access
    const { data, error } = await supabaseAdmin
        .from('channels')
        .select('id, is_public, owner_id, member_ids')
        .eq('id', channel_id)
        .single()
    
    if (error || !data) return false
    
    // Public channels are accessible to all
    if (data.is_public) return true
    
    // Check if user is owner or member
    if (user_id) {
        return data.owner_id === user_id || 
               (data.member_ids && data.member_ids.includes(user_id))
    }
    
    return false
}