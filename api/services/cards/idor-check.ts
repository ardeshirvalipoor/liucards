import { supabaseAdmin } from "../../configs/supabase"

export default async function ({ 
    id, 
    user_id, 
    device_id, 
    action 
}: {
    id: string
    user_id: string | null
    device_id: string | null
    action: string
}): Promise<boolean> {
    try {
        const { data: card, error } = await supabaseAdmin
            .from('cards')
            .select(`
                id,
                user_id,
                device_id,
                visibility
            `)
            .eq('id', id)
            .single()
        
        if (error || !card) {
            console.error('Card not found or error:', error)
            return false
        }
        
        // Check ownership
        const isOwner = (card.user_id && card.user_id === user_id) || 
                       (card.device_id && card.device_id === device_id)
        
        // For edit/delete actions, only owners have permission
        if (action === 'edit' || action === 'delete') {
            return isOwner
        }
        
        // For read action, check visibility rules
        if (action === 'read') {
            // Owners can always read their own cards
            if (isOwner) return true
            
            // Public cards can be read by anyone
            if (card.visibility === 'public') return true
            
            // Add more visibility logic here if needed
            // e.g., shared cards, team cards, etc.
        }
        
        return false
    } catch (err) {
        console.error('Permission check failed:', err)
        return false
    }
}