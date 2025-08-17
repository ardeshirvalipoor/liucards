import { ABSOLUTE, CENTER, EASE, HIDE, SHOW, Y } from '../base/helpers/style'
import { CS } from '../base/utils/styler'

export default {
    PAGE_TRANSITION_DURATION: 160,
    PAGE_BASE: {
        ...HIDE,
        ...Y(60),
        ...ABSOLUTE,
        // ...CENTER,
        ...EASE(.12),
        top: '0',
        paddingTop: 'calc(env(safe-area-inset-top) + 0px)',
        zIndex: '9999',
        willChange: 'opacity,transform',
    },
    PAGE_EXIT: {
        ...HIDE,
        ...Y(60),
    },
    PAGE_ENTER: {
        ...SHOW,
        ...Y(0),
    },
    PAGE_EXIT_UP: {
        ...HIDE,
        ...Y(-60),
    },
    PAGE_EXIT_DESKTOP: {
        ...HIDE,
        ...Y(0)
    },
    PAGE_ENTER_DESKTOP: {
        ...SHOW,
        ...Y(0)
    },
} as {
    PAGE_BASE: CS
    PAGE_EXIT: CS
    PAGE_ENTER: CS
    PAGE_EXIT_UP: CS
    PAGE_EXIT_DESKTOP: CS
    PAGE_ENTER_DESKTOP: CS
    PAGE_TRANSITION_DURATION: number
}
