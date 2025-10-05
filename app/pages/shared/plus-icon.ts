import { withRipple } from "../../base/components/advanced/ghost/ghost";
import { Div } from "../../base/components/native/div";
import { Img } from "../../base/components/native/img";
import { ROUND } from "../../base/helpers/style";
import images from "../../configs/images";
import { Bar } from "./bar";
import { baseStyle } from "./plus-icon.style";

export const PlusIcon = () => {
    const base = Div()
    base.cssClass(baseStyle)
    withRipple(base, { bg: '#ccc' });

    const img = Img(images.icons.plus, { width: 40 })
    base.append(img)
    // const v = Bar(3.5, { bg: '#000' })
    // const h = Bar(3.5, { bg: '#000' })
    
    // v.style({
    //     transform: 'rotate(90deg) translateX(10px)'
    // })
    // h.style({
    //     transform: 'translateY(6px)'
    // })
    // base.append(v, h)


    return base
};
