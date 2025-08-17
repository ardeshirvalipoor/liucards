import { CENTER } from "../../../../base/helpers/style"
import { CS } from "../../../../base/utils/styler"

export const baseStyle: CS = {
    width: '100%',
    height: '100%',
    ...CENTER,
    flexShrink: '0', // Prevent shrinking
    scrollSnapAlign: 'start',
    backgroundColor: 'white'
}


