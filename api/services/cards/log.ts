import { supabaseAdmin } from "../../configs/supabase"

export default async function (metadata: any): Promise<void> {
    try {
        await supabaseAdmin
            .from('analytics_events')
            .insert({
                event_type: metadata.event_type,
                user_id: metadata.user_id,
                device_id: metadata.device_id,
                card_id: metadata.card_id,
                metadata: metadata
                // created_at is auto-set by DB
            })
    } catch (err) {
        console.error('Analytics logging failed:', err)
    }
}
