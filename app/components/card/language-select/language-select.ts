import { Option } from "../../../base/components/native/option";
import { Select } from "../../../base/components/native/select"
import * as styles from './language-select.style'

const LANGUAGES: any[] = [
    { code: 'en-US', name: 'English (US)', nativeName: 'English' },
    { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands' },
    { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
    { code: 'fr-FR', name: 'French', nativeName: 'Français' },
    { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
    { code: 'it-IT', name: 'Italian', nativeName: 'Italiano' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
    { code: 'sv-SE', name: 'Swedish', nativeName: 'Svenska' },
    { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português' },
    { code: 'ru-RU', name: 'Russian', nativeName: 'Русский' },
    { code: 'ko-KR', name: 'Korean', nativeName: '한국어' },
    { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'pl-PL', name: 'Polish', nativeName: 'Polski' },
    { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'th-TH', name: 'Thai', nativeName: 'ไทย' },
    { code: 'id-ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'cs-CZ', name: 'Czech', nativeName: 'Čeština' }
];

export const LanguageSelect = () => {
    const base = Select()
    base.cssClass(styles.baseStyle)

    LANGUAGES.forEach(lang => {
        const option = Option(lang.code, lang.name)
        base.append(option)
    })

    return Object.assign(base, {
        getValue: () => {
            return base.el.value
        },
        setValue: (val: string) => {
            base.el.value = val
        }
    })
}
