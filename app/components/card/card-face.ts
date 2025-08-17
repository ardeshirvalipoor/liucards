import { Div } from "../../base/components/native/div"
import { baseStyle } from "./card-face.style"

export const CardFace = (text: string) => {
    const card = Div(text)
    card.cssClass(baseStyle)
    return card
}
