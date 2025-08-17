import idb from '../base/lib/idb'
import ldb from '../base/lib/ldb'
import { emitter } from '../base/utils/emitter'

const db = idb('db')

const init = async () => {
    if (!ldb.get('init')) ldb.save('init', true)
    const { version, objectStoreNames } = await db.info()
    if (!objectStoreNames.contains('clients')) {
        await db.createStore('clients', version + 1, {
            keyPath: 'temp_id', indices: [
                'id',
                'user_id',
                'created_at',
                'updated_at',
                'name',
                'contact',
                'synced',
                'deleted',
                'notifications_enabled'
            ]
        })
    }
    if (!objectStoreNames.contains('appointments')) {
        await db.createStore('appointments', version + 2, {
            keyPath: 'temp_id', indices: [
                'id',
                'user_id',
                'created_at',
                'updated_at',
                'date',
                'client_id',
                'synced',
                'deleted',
            ]
        })
    }
    if (!objectStoreNames.contains('businesses')) {
        await db.createStore('businesses', version + 3, {
            keyPath: 'temp_id', indices: [
                'id',
                'user_id',
                'name',
                'created_at',
                'updated_at',
                'synced',
                'deleted',
            ]
        })
    }
    if (!objectStoreNames.contains('transactions')) {
        await db.createStore('transactions', version + 4, {
            keyPath: 'temp_id',
            indices: [
                'id',
                'user_id',
                'business_id',
                'created_at',
                'updated_at',
                'type', // 'income' or 'expense'
                'category', // e.g., 'meeting fee', 'office expense'
                'amount',
                'date',
                'client_id', // Foreign key to clients
                'reference_id', // Links to appointments or other entities
                'synced',
                'deleted',
            ]
        })
    }
    emitter.emit('db-ready')
    return true
}

export default {
    ...db,
    init
}