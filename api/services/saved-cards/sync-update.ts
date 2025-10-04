import { supabaseAdmin } from "../../configs/supabase";
import helpers from "./helpers";

export default async function (params: {
    userId: string | null;
    deviceId?: string | null;
    cardId: string;
}): Promise<{ synced: boolean; new_version: number }> {
    const { userId, deviceId, cardId } = params;
    

    try {
        // Get current card version
        const { data: card } = await supabaseAdmin
            .from('cards')
            .select('content_version')
            .eq('id', cardId)
            .single();

        if (!card) {
            throw new Error('Card not found');
        }

        // Update saved card's source version
        const auth = helpers.getAuthFilter(userId, deviceId);
        
        const { data: updated, error } = await supabaseAdmin
            .from('saved_cards')
            .update({
                source_version: card.content_version,
                updated_at: new Date().toISOString()
            })
            .eq('card_id', cardId)
            .eq(auth.column, auth.value)
            .select('id')
            .single();

        if (error || !updated) {
            throw new Error('Saved card not found');
        }

        return {
            synced: true,
            new_version: card.content_version
        };
    } catch (error: any) {
        console.error('Sync updates failed:', error);
        throw error;
    }
}