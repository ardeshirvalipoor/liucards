import { supabaseAdmin } from "../../configs/supabase"
import { EditCardPayload } from "../../interfaces/card";

export default async function (payload: EditCardPayload) {
    const { id, user_id, device_id, ...updateData } = payload

    try {
        let query = supabaseAdmin
            .from('cards')
            .update(updateData)
            .eq('id', id)

        // Authorization: prioritize user_id, fallback to device_id
        if (user_id) {
            // If user is logged in, check user_id only
            query = query.eq('user_id', user_id)
        } else if (device_id) {
            // If anonymous, check device_id only
            query = query.eq('device_id', device_id)
        }
        // If neither provided, only id check applies

        const { data: updatedCard, error: updateError } = await query
            .select('id, content_version')
            .single()

        if (updateError || !updatedCard) {
            const errorMessage = updateError?.message || 'Card not found or unauthorized'
            const error: any = new Error(errorMessage)
            error.code = updateError?.code === 'PGRST116' ? 'NOT_FOUND_OR_UNAUTHORIZED' : 'UPDATE_FAILED'
            throw error
        }

        // Only update source_version if this is NOT a deletion
        if (!updateData.deleted_at) {
            const { error } = await supabaseAdmin
                .from('saved_cards')
                .update({
                    source_version: updatedCard.content_version,
                    updated_at: new Date().toISOString()
                })
                .eq('card_id', id)

            if (error) {
                console.warn('Failed to update saved_cards versions:', error)
            }
        }

        return {
            id: updatedCard.id,
            content_version: updatedCard.content_version
        }
    } catch (err) {
        console.error('Edit card failed:', err)
        throw err
    }
}