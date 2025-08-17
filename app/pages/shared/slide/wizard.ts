import { Base } from '../../../base/components/base'
import { IWizardSlide } from './slide'

export interface IWizardOptions {
    index?: 0
}

export const Wizard = (slides: IWizardSlide[], options: IWizardOptions = {}) => {

    const base = Base()
    let index: number = options.index || 0

    slides.filter(Boolean).forEach(slide => {
        base.append(slide)
        slide.on('skip', () => skip())
        slide.on('next', () => next())
        slide.on('prev', () => prev())
        slide.on('done', () => done())
    })
    const skip = () => {
        // todo : fix it. it's not working when o nthe first slide it tries to remove
        slides[index].slideOut()
        slides[index + 1]?.remove()
        slides.splice(index + 1, 1)
        index++
        slides[index]?.slideIn()
    }
    const next = () => {
        if (index < slides.length - 1) {
            slides[index].slideOut()
            index++
            slides[index].slideIn()
        }
    }
    const prev = () => {
        if (index > 0) {
            slides[index].hide()
            index--
            slides[index].slideIn()
        }
    }
    const reset = () => {
        index = options.index || 0
        slides[index].slideIn()
        slides.forEach(slide => { slide.hide(); slide.emit('reset') })
        slides[index].moveIn()
    }
    const done = () => base.emit('done')

    base.cssClass({
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    })

    return Object.assign(base, { next, prev, done, reset })
}