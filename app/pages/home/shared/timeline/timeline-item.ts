import { Div } from "../../../../base/components/native/div"
import { Card } from "../../../../components/card/card"
import { ICard } from "../../../../interfaces/card"
import { baseStyle } from "./timeline-item.style"

export const TimelineItem = (_card: ICard) => {
    const base = Div()
    base.cssClass(baseStyle)

    const card = Card(_card)
    base.append(card)
    
    return Object.assign(base, {
        ...base,
        update(newCard: ICard) {
            card.update(newCard)
            // if (newCard.added) {
        }
    })
}
