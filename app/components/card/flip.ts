import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"
import { baseStyle } from "./flip.style"

export const Flip = () => {
    const base = Div()
    const icon = Img(images.icons.flip, { width: 44 })
    withRipple(base, { bg: '#ccc' })
    base.style(baseStyle)

    base.append(icon)

    base.el.onclick = () => {
        base.emit('click')
    }

    return base
}