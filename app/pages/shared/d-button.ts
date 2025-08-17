import { withRipple } from '../../base/components/advanced/ghost/ghost'
import { Button } from "../../base/components/native/button"
import { EASE, S } from "../../base/helpers/style"
import { PASSIVE } from '../../base/utils/passive-support'
import configs from '../../configs'

export const DButton = () => {
    const base = Button()

    withRipple(base, { bg: 'white' })
    base.cssClass({
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
        borderRadius: '24px',
        textAlign: 'center',
        userSelect: 'none',
        fontSize: '18px',
        boxShadow: '#0000002b 0px 3px 5px',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.16s',
        border: 'none',
        '&:active': {
            filter: 'brightness(0.95) contrast(1.1)',
            boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
            transform: 'scale(0.99)',
        },
        '&:hover': {
            opacity: 0.8
        },
        '&:disabled': {
            opacity: 0.7,
            filter: 'saturate(0.1)',
        }
    })

    return base
}