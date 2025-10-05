import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"

export const Remove = () => {
    const base = withRipple(Div())
    base.cssClass({ cursor: 'pointer', position: 'relative' })
    const icon = Img(images.icons.remove, {width: 30})
    base.append(icon)
    return base
}