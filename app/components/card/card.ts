import { withRipple } from '../../base/components/advanced/ghost/ghost'
import { Div } from '../../base/components/native/div'
import { Img } from '../../base/components/native/img'
import ldb from '../../base/lib/ldb'
import router from '../../base/lib/router'
import state from '../../base/services/state'
import { waitFor } from '../../base/utils/wait'
import images from '../../configs/images'
import { ICard } from '../../interfaces/card'
import { emitter } from '../../services/emitter'
import supabase from '../../services/supabase'
import { Edit } from '../edit/edit'
import { Remove } from '../remove/remove'
import { Star } from '../star/star'
import { CardFace } from './card-face'
import { baseStyle, innerStyle } from './card.style'
import { Flip } from './flip'
import { Like } from './like'

export const Card = (_card: ICard) => {

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
    back.cssClass({ transform: 'rotateY(180deg)', backgroundColor: '#e7e7e7ff' })
    inner.append(back)

    const flip = Flip()
    flip.on('click', handleFlip)
    base.append(flip)

    const buttons = Div()
    buttons.cssClass({ display: 'flex', flexDirection: 'row', gap: '48px', marginTop: '36px' })
    base.append(buttons)
    const like = Like(_card.added)
    // base.append(like)

    const loggedInUser = supabase.auth.getSession()?.user?.id
    if (_card.deviceId === ldb.get('liucards-device-id') || _card.userId === loggedInUser) {
        const remove = Remove()
        buttons.append(remove)
        remove.el.onclick = async () => {
            router.goto(`/flashcards/remove/${_card.id}`)
            ldb.set(`liucards-card-${_card.id}`, _card)
        }
        const edit = Edit()
        buttons.append(edit)
        edit.el.onclick = () => {
            router.goto(`/flashcards/edit/${_card.id}`)
            ldb.set(`liucards-card-${_card.id}`, _card)
        }


        // Show delete button
    }

    const star = Star()
    // buttons.append(star)
    // star.on('click', async () => {
    //     const isAdded = state.get('is-card-added', {}) as Record<string, boolean>
    //     if (_card.added) {
    //         // remove from deck
    //         const { error } = await supabase.from('deck_cards').delete().eq('card_id', _card.id)
    //         if (error) {
    //             console.error('Error removing card from deck:', error.message)
    //             return
    //         }
    //         _card.added = false
    //         isAdded[_card.id] = false
    //         state.set('is-card-added', isAdded)
    //         star.cssClass({ filter: 'saturate(0.5)', opacity: '0.8' })
    //     } else {
    //         // add to deck
    //         const { error } = await supabase.from('deck_cards').insert({ card_id: _card.id })
    //         if (error) {
    //             console.error('Error adding card to deck:', error.message)
    //             return
    //         }
    //         _card.added = true
    //         isAdded[_card.id] = true
    //         state.set('is-card-added', isAdded)
    //         star.cssClass({ filter: 'saturate(1)', opacity: '1' })
    //     }
    // })

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

    return Object.assign(base, {
        ...base,
        update(newCard: ICard) {
            _card = { ..._card, ...newCard }
            front.update(_card.front, _card.front_audio_url)
            back.update(_card.back, _card.back_audio_url)
            // if (_card.added) {
            //     like.setLiked(true)
            // } else {
            //     like.setLiked(false)

            // }
            // // if (newCard.added) {
        }
    })
}
