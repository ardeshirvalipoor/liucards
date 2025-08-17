import { XHR } from '../base/lib/xhr'
import { createEmitter } from '../base/utils/emitter'
import { AppEventMap } from '../interfaces/app-events'
import { TClient } from '../interfaces/client'
import { createClient } from '../models/client'
import db from './db'

async function all(page: number) {
    const all = await db.all<TClient>('clients')
    return all.filter(c => !c.deleted) // todo move to idb
}

async function get(remoteId: string | undefined, tempId: string | undefined = remoteId): Promise<TClient | null> {
    const [foundById] = await db.find<TClient>('clients', { index: 'id', value: remoteId })
    if (foundById) return foundById
    return db.byId<TClient>('clients', tempId)
}

function add(data: TClient) {
    const client = createClient(data)
    const added = db.save('clients', client)
    return added
}

async function update(remoteId: string | undefined, tempId: string, data: any) {
    let existing = await get(remoteId, tempId)
    if (!existing) throw new Error('Client not found')
    return db.update('clients', existing.temp_id, data)
}

function count(): Promise<number> {
    return db.count('clients') as Promise<number>
}

async function remove(localOrServerId: string) {
    let existing = await get(localOrServerId)
    if (!existing) throw new Error('Client not found')
    return update(existing.id, existing.temp_id, { ...existing, deleted: 1 })
}

function isJoinedTheBot(remoteId: string) {
    return XHR.get(`/api/clients/${remoteId}/joined`)
}

function unSynced() {
    return db.find<TClient>('clients', { index: 'synced', value: 0 })
}

export default {
    all,
    get,
    add,
    update,
    count,
    remove,
    isJoinedTheBot,
    unSynced,
    ...createEmitter<AppEventMap>()
}