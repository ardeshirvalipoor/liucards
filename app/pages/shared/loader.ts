import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"

export const Loader = () => {
    const base = Div()
    base.cssClass({ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' })
    const loadingSvg = Img(images.icons.loader, { width: 64 })
    base.append(loadingSvg)

    return base
}