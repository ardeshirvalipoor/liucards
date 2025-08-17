import ldb from "../base/lib/ldb";
import { shortUUID } from "../base/utils/id-generator";
import { TBusiness, TCreateBusiness } from "../interfaces/business";

export function createBusiness({
    user_id,
    temp_id,
    created_at,
    updated_at,
    synced,
    ...rest
}: TCreateBusiness): TBusiness {

    const now = new Date().toISOString()
    const fallbackUserId = ldb.get('user')?.id || ''

    return {
        ...rest,
        user_id: user_id ?? fallbackUserId,
        temp_id: temp_id ?? shortUUID(),
        created_at: created_at ?? now,
        updated_at: updated_at ?? now,
        synced: synced ?? 0,
    }
}
