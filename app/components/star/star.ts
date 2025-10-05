import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Base } from "../../base/components/base"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"

export const Star = () => {
    const base = withRipple(Div())
    base.cssClass({ cursor: 'pointer', position: 'relative' })
const icon = Img(images.icons.star, {width: 27})
    base.append(icon)
    return base
}