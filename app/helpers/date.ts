import { jDateFormatter } from "../base/helpers/date"

export default {
    format: (date: Date | string) => {
        if (typeof date === 'string') date = new Date(date)
        return jDateFormatter.format(date).replace(',', '').split(' ').reverse().join(' ')
    },
    getDateParts(date: Date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return { year, month, day };
    }
}