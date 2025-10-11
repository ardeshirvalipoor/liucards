import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"

export const Edit = () => {
    const base = withRipple(Div())
    base.cssClass({ cursor: 'pointer', position: 'relative', paddingTop: '1px' })
    const icon = Img(images.icons.pen, {width: 28})
    base.append(icon)
    return base
}