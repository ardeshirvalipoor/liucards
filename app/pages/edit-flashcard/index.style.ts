import { CS } from '../../base/utils/styler'
import helpers from '../../helpers'

export const baseStyle: CS = {
    ...helpers.styles.PAGE_BASE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    overflowY: 'auto',
}