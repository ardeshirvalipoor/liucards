export interface CardPayload {
    front: string
    back: string
    front_audio_url?: string | null
    back_audio_url?: string | null
}

export interface ICard extends CardPayload {
    id: string,
    front: string,
    back: string,
    added: boolean,
    deviceId?: string,
    userId?: string,
    front_audio_url?: string,
    back_audio_url?: string
}