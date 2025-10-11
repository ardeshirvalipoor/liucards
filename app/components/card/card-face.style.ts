import { CENTER } from "../../base/helpers/style";
import { CS } from "../../base/utils/styler";

export const baseStyle: CS = {
    position: 'absolute',
    inset: '0',
    display: 'grid',
    placeItems: 'center',
    padding: '24px',
    textAlign: 'center',
    borderRadius: '26px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    backfaceVisibility: 'hidden',
    webkitBackfaceVisibility: 'hidden',
    border: '3px solid #28bc9b5c',
    overflowY: 'auto',

}

export const contentStyle: CS = {
    fontSize: '22px',
}

export const playButtonStyle: CS = {
    position: 'absolute',
    bottom: '30px',
}