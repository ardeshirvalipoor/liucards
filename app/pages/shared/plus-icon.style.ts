import { ROUND } from "../../base/helpers/style";
import { CS } from "../../base/utils/styler";

export const baseStyle: CS = {
    ...ROUND,
    position: 'relative',
    width: '60px',
    height: '60px',
    padding: '18px',
    transition: 'all .16s',
    zIndex: '99999',
    flexShrink: '0',
    cursor: 'pointer',
    '&:hover': {
        opacity: '.8',
    },
    '&:active': {
        transform: 'scale(.9)' // Tdod: fix this. if we have other transform, it will not be overriden
    },
}