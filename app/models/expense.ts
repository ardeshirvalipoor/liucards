import ldb from "../base/lib/ldb";
import { shortUUID } from "../base/utils/id-generator";
import { TBusiness, TCreateBusiness } from "../interfaces/business";
import { TCreateExpense, TExpense } from "../interfaces/expenses";
import services from "../services";
import businesses from "../services/businesses";

export async function createExpense({
    user_id,
    temp_id,
    created_at,
    updated_at,
    synced,
    ...rest
}: TCreateExpense): Promise<TExpense> {

    const now = new Date().toISOString()
    const fallbackUserId = ldb.get('user')?.id || ''
    let [business] = await businesses.all(0)
    if (!business) {
        business = await services.businesses.add()
    }

    return {
        ...rest,
        type: rest.type ?? 'expense',
        user_id: user_id ?? fallbackUserId,
        business_id: business?.id || business.temp_id,
        temp_id: temp_id ?? shortUUID(),
        created_at: created_at ?? now,
        updated_at: updated_at ?? now,
        synced: synced ?? 0,
    }
}
