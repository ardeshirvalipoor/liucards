import { CS } from "./base/utils/styler";
import configs from "./configs";

export const baseStyle: CS = {
        margin: '0',
        transition: 'all .16s',
        overflow: 'hidden',
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        [`@media (max-width: ${configs.sizes.MOBILE}px)`]: {
            margin: '0',
        }
}