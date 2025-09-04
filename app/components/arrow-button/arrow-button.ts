import { withRipple } from '../../base/components/advanced/ghost/ghost'
import { Div } from '../../base/components/native/div'
import { Img } from '../../base/components/native/img'
import images from '../../configs/images'
import * as styles from './arrow-button.style'

export const ArrowButton = (direction: 'left' | 'right') => {
    const base = withRipple(Div())
    base.cssClass(styles.baseStyle)

    const icon = Img(images.icons.arrow, { width: 32, height: 32 })
    if (direction === 'left') {
        icon.style({ transform: 'rotate(180deg)' })
    }
    base.append(icon)

    base.el.onclick = base.emit.bind(base, 'click')

    return base
}
