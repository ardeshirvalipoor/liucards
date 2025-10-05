import { CS } from "../../../base/utils/styler";

export const baseStyle: CS  = {
       height: '60px',
            backgroundColor: '#ffffff33',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'absolute',
            top: 'env(safe-area-inset-top)',
            left: '0',
            right: '0',
            paddingTop: 'env(safe-area-inset-top)',
            zIndex: '99999',
}
