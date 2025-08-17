import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"
import { baseStyle } from "./like.style"

export const Like = (liked = false) => {
    const base = Div()
    const icon = Img(images.icons.like, { width: 32 })
    withRipple(base, { bg: '#ccc' })
    base.style(baseStyle)

    base.append(icon)

    if (liked) {
        base.el.style.filter = 'invert(86%) sepia(16%) saturate(1000%) hue-rotate(132deg) brightness(95%) contrast(90%)'
    }

    base.el.onclick = () => {
        liked = !liked
        if (liked) base.el.style.filter = 'invert(86%) sepia(16%) saturate(1000%) hue-rotate(132deg) brightness(95%) contrast(90%)'
        else base.el.style.filter = 'none'
        base.emit('click', liked)
    }

    return base
}