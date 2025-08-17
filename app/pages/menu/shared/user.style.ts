import { CENTER } from "../../../base/helpers/style";
import { CS } from "../../../base/utils/styler";

export const baseStyle: CS = {
    position: 'relative',
    fontSize: '18px',
    padding: '20px',
    overflow: 'hidden',
    backgroundColor: '#dbf9f2',
    borderRadius: '20px',
    margin: '10px 0 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
}

export const phoneStyle: CS = {
    fontSize: '22px'
}

export const exitStyle: CS = {
    cursor: 'pointer',
    padding: '10px 20px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    ...CENTER
}