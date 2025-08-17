
import { IBaseComponent } from "../../../base/components/base"
import { Div } from "../../../base/components/native/div"
import { PASSIVE } from "../../../base/utils/passive-support"
import { Frame } from "./frame"

export const Slider = () => {

    const base = Div()
    base.cssClass({
        display: 'flex',
        alignItems: 'center',
        transition: 'transform 0.3s ease-in-out',
        width: '300%',
        willChange: 'transform',
        flexShrink: '0',
    })


    base.el.addEventListener('touchstart', handleTouchStart, PASSIVE)
    base.el.addEventListener('touchmove', handleTouchMove, PASSIVE)
    base.el.addEventListener('touchend', handleTouchEnd, PASSIVE)
    base.el.addEventListener('touchcancel', handleTouchEnd, PASSIVE)
    base.el.addEventListener('touchleave', handleTouchEnd, PASSIVE)
    base.el.addEventListener('transitionend', handleTransitionEnd, PASSIVE)

    let x = 0
    let dx = 0
    let direction = 0
    let index = 0
    // let busy = false

    function handleTouchStart(e: TouchEvent) {
        base.el.removeEventListener('transitionend', handleTransitionEnd)
        // if (busy) return
        x = e.touches[0].clientX
        base.style({ transition: 'none' })
    }

    function handleTouchMove(e: TouchEvent) {
        // detect if trying to scroll so disable swipe
        // if (busy) return
        dx = e.touches[0].clientX - x
        base.style({ transform: `translateX(${dx}px)` })
        base.emit('swipe', { direction, dx })
    }

    function handleTouchEnd(e: TouchEvent) {
        base.style({ transition: 'transform 0.3s cubic-bezier(0.22, 0.73, 0.46, 1)' })
        direction = dx > 50 ? 1 : dx < -50 ? -1 : 0
        slide(direction)
        dx = 0
        base.el.addEventListener('transitionend', handleTransitionEnd)
    }

    function slide(direction: number) {
        base.style({ transform: `translateX(${direction * 100 / 3}%)` })
    }

    function handleTransitionEnd(e: TransitionEvent) {
        base.el.removeEventListener('transitionend', handleTransitionEnd)
        // busy = false
        if (direction === 0) return
        if (direction === 1) {
            index++
            let first = base.getChildren()[0]
            first.remove()
            first = Frame()
            base.append(first)
            base.emit('swipe-end', { direction, frame: first, index })
        } else {
            index--
            let last = base.getChildren()[2]
            last.remove()
            last = Frame()
            base.prepend(last)
            base.emit('swipe-end', { direction, frame: last, index })
        }
        base.style({ transition: 'none', transform: `translateX(0)` })
    }

    function init(els: IBaseComponent<'div'>[]) {
        index = 0
        base.empty()
        base.append(...els)
    }

    return Object.assign(base, { init })
}