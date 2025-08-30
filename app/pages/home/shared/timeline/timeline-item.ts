import { Div } from "../../../../base/components/native/div"
import { Card } from "../../../../components/card/card"
import { baseStyle } from "./timeline-item.style"

export const TimelineItem = (_card: { id: string, front: string, back: string, added: boolean, deviceId: string, userId: string, front_audio_url?: string, back_audio_url?: string }) => {
    const base = Div()
    base.cssClass(baseStyle)

    const card = Card(_card)
    base.append(card)
    
    return base
}
