import { CS } from "../../base/utils/styler";

export const baseStyle: CS = {
    position: 'relative',
    width: '40px',
    height: '40px',
    borderRadius: '50%'
}

export const playStyle: CS = {
    position: 'absolute',
    top: '8px',
    left: '8px',
    transition: 'transform 0.3s ease',
    backfaceVisibility: 'hidden'
}

export const pauseStyle: CS = {
    ...playStyle,
    top: '10px',
    transform: 'rotateY(180deg)'
}