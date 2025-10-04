import { supabaseAdmin } from "../../configs/supabase"
import { EditCardPayload } from "../../interfaces/card";

export default async function (payload: EditCardPayload) {
    const { id, user_id, device_id, ...updateData } = payload
    console.log(payload);

    try {
        // const hasPermission = await idorCheck({
        //     id,
        //     user_id,
        //     device_id,
        //     action: 'edit'
        // })

        // if (!hasPermission) {
        //     const error: any = new Error('Unauthorized to edit this card')
        //     error.code = 'UNAUTHORIZED'
        //     throw error
        // }

        let query = supabaseAdmin
            .from('cards')
            .update(updateData)
            .eq('id', id)


        if (user_id) {
            query = query.eq('user_id', user_id)
        }
        if (device_id) {
            query = query.eq('device_id', device_id)
        }

        // Update the card (version and updated_at handled by trigger)
        const { data: updatedCard, error: updateError } = await query.select('id, content_version').single()

        if (updateError || !updatedCard) {
            // Either card doesn't exist OR user doesn't have permission
            const errorMessage = updateError?.message || 'Card not found or unauthorized'
            const error: any = new Error(errorMessage)
            error.code = updateError?.code === 'PGRST116' ? 'NOT_FOUND_OR_UNAUTHORIZED' : 'UPDATE_FAILED'
            throw error
        }
        if (!updatedCard && !updateError) {
            throw new Error('Card not found or no permission to edit')
        }
        // Update saved_cards source_version
        const { error } = await supabaseAdmin
            .from('saved_cards')
            .update({
                source_version: updatedCard.content_version,
                updated_at: new Date().toISOString()
            })
            .eq('card_id', id)

        if (error) {
            console.warn('Failed to update saved_cards versions:', error)
            // Don't fail the operation, but log it
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
