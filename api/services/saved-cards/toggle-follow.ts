import { supabaseAdmin } from "../../configs/supabase";
import { ToggleFollowParams, ToggleFollowResponse } from "../../interfaces/saved-cards";
import helpers from "./helpers";

export async function toggleFollowUpdates(params: ToggleFollowParams): Promise<ToggleFollowResponse> {
    const { userId, deviceId, cardId, followUpdates } = params;

    if (!cardId) {
        throw new Error('Card ID is required');
    }

    try {
        const auth = helpers.getAuthFilter(userId, deviceId);
        
        const { data, error } = await supabaseAdmin
            .from('saved_cards')
            .update({
                follow_updates: followUpdates,
                updated_at: new Date().toISOString()
            })
            .eq('card_id', cardId)
            .eq(auth.column, auth.value)
            .select('id, follow_updates')
            .single();

        if (error || !data) {
            throw new Error('Saved card not found');
        }

        return {
            saved_card_id: data.id,
            follow_updates: data.follow_updates
        };
    } catch (error: any) {
        console.error('Toggle follow updates failed:', error);
        throw error;
    }
}