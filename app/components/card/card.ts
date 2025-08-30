import { withRipple } from '../../base/components/advanced/ghost/ghost'
import { Div } from '../../base/components/native/div'
import { Img } from '../../base/components/native/img'
import ldb from '../../base/lib/ldb'
import state from '../../base/services/state'
import { waitFor } from '../../base/utils/wait'
import images from '../../configs/images'
import supabase from '../../services/supabase'
import { CardFace } from './card-face'
import { baseStyle, innerStyle } from './card.style'
import { Flip } from './flip'
import { Like } from './like'

export const Card = (_card: { id: string, front: string, back: string, added: boolean, deviceId: string, userId: string, front_audio_url?: string, back_audio_url?: string }) => {

    console.log(_card);
    const localData = ldb.get(`liucards-card-${_card.id}`)
    if (localData) {
        console.log('-- loading locale', localData);
        _card = { ..._card, ...localData }
        console.log('new card', _card);

        ldb.remove(`liucards-card-${_card.id}`)
    }
    // Todo: add an interface
    let isFlipped = false
    const base = Div()
    base.cssClass(baseStyle)

    const inner = Div()
    inner.cssClass(innerStyle)
    base.append(inner)

    const front = CardFace(_card.front, _card.front_audio_url)
    inner.append(front)

    const back = CardFace(_card.back, _card.back_audio_url)
    back.cssClass({ transform: 'rotateY(180deg)', backgroundColor: '#d4e8e9' })
    inner.append(back)

    const flip = Flip()
    flip.on('click', handleFlip)
    base.append(flip)

    const like = Like(_card.added)
    // base.append(like)

    const loggedInUser = supabase.auth.getSession()?.user?.id
    if (_card.deviceId === ldb.get('liucards-device-id') || _card.userId === loggedInUser) {
        const edit = Div('✏️')
        edit.cssClass({ marginTop: '30px', filter: 'saturate(0)' })
        base.append(edit)
        edit.el.onclick = () => {
            location.href = `/flashcards/edit/${_card.id}`
            ldb.set(`liucards-card-${_card.id}`, _card)
        }
        // Show delete button
    }

    // inner.el.addEventListener('touchstart', handleTouchStart)
    // inner.el.addEventListener('touchend', handleTouchEnd)

    async function handleFlip() {
        await waitFor(100)
        // const isScrolling = state.get('timeline-scrolling')
        // if (isScrolling) return
        inner.el.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'
        isFlipped = !isFlipped
    }

    async function handleTouchEnd() {
        inner.el.style.transform = 'rotateY(0deg)'
    }

    return base
}
