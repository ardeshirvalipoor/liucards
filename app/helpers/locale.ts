function replacePersianDigits(value: string = ''): string {
    return value.toString().replace(/[۰-۹]/g, (d: string) => String.fromCharCode(d.charCodeAt(0) - 1728))
}

// strings like 01 -> ۰۱
function replaceLatinDigits(value: string = ''): string {
    return value.toString().replace(/[0-9]/g, (d: string) => String.fromCharCode(d.charCodeAt(0) + 1728))
}

function isRTL(char: string): boolean {
    return /[\u0600-\u06FF]/.test(char)
}

// function digitToPersian(value: string): string {
//     return String.fromCharCode(value.charCodeAt(0) + 1728)
// }
const jMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
]

function formatToInternationalPhoneNumber(phoneNumber: string): string {
    const englishDigitsPhone = replacePersianDigits(phoneNumber)
    const phoneWithoutPlus = englishDigitsPhone.replace(/^\+/, '')
    if (phoneWithoutPlus.length == 11) return phoneWithoutPlus.replace(/^0?9/, '989')
    return phoneWithoutPlus
}

export default {
    replaceLatinDigits,
    replacePersianDigits,
    // digitToPersian,
    isRTL,
    jMonths,
    formatToInternationalPhoneNumber
}