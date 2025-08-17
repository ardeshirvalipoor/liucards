import { Div } from "../../../base/components/native/div"
import { Slider } from "./slider"

export const Window = () => {

    const base = Div()
    base.cssClass({
        postion: 'relative',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
    })

    const slider = Slider()
    slider.on('swipe', (args: any) => base.emit('swipe', args))
    slider.on('swipe-end', (args: any) => base.emit('swipe-end', args))
    base.append(slider)

    return Object.assign(base, {
        init: slider.init
    })
}