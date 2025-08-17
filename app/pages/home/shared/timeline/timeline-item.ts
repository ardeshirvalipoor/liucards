import { Div } from "../../../../base/components/native/div"
import { Card } from "../../../../components/card/card"
import { baseStyle } from "./timeline-item.style"

export const TimelineItem = (_card: { front: string, back: string, added: boolean }) => {
    const base = Div()
    base.cssClass(baseStyle)

    const card = Card(_card)
    base.append(card)
    
    return base
}
