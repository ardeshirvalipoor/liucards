import { Base } from '../../base/components/base'
import { Scrollable } from '../../base/utils/scrollable'

export const Body = (adjustedHeight = 0) => {
    const base = Scrollable(Base())

    base.cssClass({
        overflowY: 'auto',
        overflowX: 'hidden',
        width: '100vw',
        position: 'relative',
        margin: '0',
        padding: '60px 60px 0 60px',
        // padding: 'calc(env(safe-area-inset-top) + 15px) 60px 0 60px',
        height: (window.innerHeight - adjustedHeight) + 'px',
    })

    return base
}
