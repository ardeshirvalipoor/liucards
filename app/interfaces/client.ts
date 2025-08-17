
export type TClient = {
    id?: string
    temp_id: string
    name: string
    contact: {
        cell: string
        telegram: string
    }
    email?: string
    notes?: string
    address?: string
    birthday?: string
    image?: string
    notifications_enabled: number // 0 or 1 for true or false because of indexeddb limitations
    updated_at: string
    created_at: string
    synced: number // 0 or 1 for true or false because of indexeddb limitations
    deleted?: number // 0 or 1 for true or false because of indexeddb limitations
    user_id?: string
}

export type TCreateClient = Pick<
    TClient,
    'name' | 'contact' | 'temp_id' | 'user_id' | 'updated_at' | 'created_at' | 'synced' | 'notifications_enabled'
>