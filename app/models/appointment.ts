import ldb from "../base/lib/ldb";
import { shortUUID } from "../base/utils/id-generator";
import { TAppointment, TCreateAppointment } from "../interfaces/appointments";
import services from "../services";
import businesses from "../services/businesses";

export async function createAppointment({
    user_id,
    temp_id,
    client_id,
    created_at,
    updated_at,
    synced,
    ...rest
}: TCreateAppointment): Promise<TAppointment> {

    const now = new Date().toISOString()
    const fallbackUserId = ldb.get('user')?.id || ''
    let [business] = await businesses.all(0)
    if (!business) {
        business = await services.businesses.add()
    }

    return {
        ...rest,
        user_id: user_id ?? fallbackUserId,
        temp_id: temp_id ?? shortUUID(),
        client_id: client_id ?? '',
        created_at: created_at ?? now,
        updated_at: updated_at ?? now,
        synced: synced ?? 0,
        business_id: business?.id || business.temp_id,
    }
}

