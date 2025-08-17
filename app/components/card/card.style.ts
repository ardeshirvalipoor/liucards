import { CENTER } from "../../base/helpers/style";
import { CS } from "../../base/utils/styler";

export const baseStyle: CS = {
    width: '100%',
    height: '100%',
    perspective: '1000px',
    webkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    touchAction: 'manipulation',
    cursor: 'pointer',
    paddingTop: '40px',
    ...CENTER,
    flexDirection: 'column',
}

export const innerStyle: CS = {
    position: 'relative',
    width: '75%',
    height: '70%',
    transformStyle: 'preserve-3d',
    transition: 'transform 250ms ease',
}