import { supabaseAdmin } from "../../configs/supabase";
import { UnsaveCardParams } from "../../interfaces/saved-cards";
import helpers from "./helpers";

export default async function (params: UnsaveCardParams): Promise<{ removed: boolean }> {
    const { userId, deviceId, cardId } = params;

    if (!cardId) {
        throw new Error('Card ID is required');
    }

    try {
        const auth = helpers.getAuthFilter(userId, deviceId);
        
        const { data, error } = await supabaseAdmin
            .from('saved_cards')
            .update({ deleted_at: new Date().toISOString() })
            .eq('card_id', cardId)
            .eq(auth.column, auth.value)
            .select('id')
            .single();

        if (error || !data) {
            throw new Error('Saved card not found');
        }

        return { removed: true };
    } catch (error: any) {
        console.error('Unsave card operation failed:', error);
        throw error;
    }
}