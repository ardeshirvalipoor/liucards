import { Base } from '../../base/components/base'

export const Bar = (height = 4, options: any = {}) => {

    const base = Base('div')

    base.cssClass({
        width: '100%',
        height: height + 'px',
        backgroundColor: options.bg || '#000',
        // opacity: '.9',
        transition: 'all .2s'
    })

    return base
}