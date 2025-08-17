import ldb from "../base/lib/ldb";
import { shortUUID } from "../base/utils/id-generator";
import { TClient, TCreateClient } from "../interfaces/client";

export function createClient({
    user_id,
    temp_id,
    created_at,
    updated_at,
    synced,
    ...rest
}: TCreateClient): TClient {

    const now = new Date().toISOString()
    const fallbackUserId = ldb.get('user')?.id || ''

    return {
        ...rest,
        user_id: user_id ?? fallbackUserId,
        temp_id: temp_id ?? shortUUID(),
        created_at: created_at ?? now,
        updated_at: updated_at ?? now,
        synced: synced ?? 0,
        notifications_enabled: 0,
    }
}