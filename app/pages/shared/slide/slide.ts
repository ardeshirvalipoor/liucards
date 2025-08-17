import { Base, IBaseComponent } from '../../../base/components/base'
import { HIDE, SHOW, Y } from '../../../base/helpers/style'


export const WizardSlide = (): IWizardSlide => {
    const base = Base()

    base.cssClass({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        transform: 'translateY(20%)',
        ...HIDE,
        transition: 'all .24s ease-in-out'
    })

    const moveIn = () => {
        base.style({
            ...Y(0),
            ...SHOW,
        })
    }
    const slideIn = () => {
        base.emit('enter') // leave
        moveIn()
    }

    const hide = () => {
        base.style({
            ...Y('20%'),
            ...HIDE,
        })
    }

    const slideOut = () => {
        base.style({
            ...Y('-20%'),
            ...HIDE,
        })
    }

    const slide: IWizardSlide = Object.assign(base, { slideIn, hide, slideOut, moveIn }) as IWizardSlide;

    return slide
}

export interface IWizardSlide extends IBaseComponent<'div'> {
    hide(): void
    slideIn(): void
    slideOut(): void
    moveIn(): void
}