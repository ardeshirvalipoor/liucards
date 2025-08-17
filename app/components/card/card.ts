import { withRipple } from '../../base/components/advanced/ghost/ghost'
import { Div } from '../../base/components/native/div'
import { Img } from '../../base/components/native/img'
import state from '../../base/services/state'
import { waitFor } from '../../base/utils/wait'
import images from '../../configs/images'
import { CardFace } from './card-face'
import { baseStyle, innerStyle } from './card.style'
import { Flip } from './flip'
import { Like } from './like'

export const Card = (_card: { front: string, back: string, added: boolean }) => {
    let isFlipped = false
    const base = Div()
    base.cssClass(baseStyle)

    const inner = Div()
    inner.cssClass(innerStyle)
    base.append(inner)

    const front = CardFace(_card.front)
    inner.append(front)

    const back = CardFace(_card.back)
    back.cssClass({ transform: 'rotateY(180deg)', backgroundColor: '#d4e8e9' })
    inner.append(back)

    const flip = Flip()
    flip.on('click', handleFlip)
    base.append(flip)

    const like = Like(_card.added)
    base.append(like)



    // inner.el.addEventListener('touchstart', handleTouchStart)
    // inner.el.addEventListener('touchend', handleTouchEnd)

    async function handleFlip() {
        await waitFor(100)
        // const isScrolling = state.get('timeline-scrolling')
        // if (isScrolling) return
        inner.el.style.transform = isFlipped ?  'rotateY(0deg)' : 'rotateY(180deg)'
        isFlipped = !isFlipped
    }

    async function handleTouchEnd() {
        inner.el.style.transform = 'rotateY(0deg)'
    }

    return base
}
