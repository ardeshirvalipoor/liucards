import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"
import { DButton } from "../../pages/shared/d-button"
import services from "../../services"
import { AudioPlay } from "../audio-play/audio-play"
import { LanguageSelect } from "../card/language-select/language-select"
import * as styles from './add-audio.style'

export const AddAudio = () => {
    const base = Div()
    base.cssClass(styles.baseStyle)
    let audio: string | null = null
    let text: string = ''
    const generate = withRipple(Div())
    generate.append(Img(images.icons.music, { width: 24, height: 24 }))
    generate.cssClass(styles.generateStyle)
    generate.el.onclick = () => {
        if (!text) return;
        generate.style({ display: 'none' })
        action.style({ display: 'flex' })
    }
    base.append(generate)

    const action = Div()
    action.cssClass({ display: 'none', alignItems: 'center', gap: '10px', marginBottom: '8px' })
    base.append(action)
    const langs = LanguageSelect()
    action.append(langs)
    const go = DButton('Go')
    action.append(go)


    const play = AudioPlay()
    play.style({ display: 'none' })
    base.append(play)


    go.el.onclick = async () => {
        action.style({ pointerEvents: 'none', opacity: '0.5' });
        const selectedLang = langs.getValue();
        let final = await services.supabase.generateAudio(text, selectedLang);
        console.log('audio saved:', final);
        audio = final;
        play.setAudio(final);

        action.style({ display: 'none' });
        play.style({ display: 'block' });
    }




    return Object.assign(base, {
        getUrl: () => {
            return audio
        },
        setText: (newText: string) => {
            text = newText;
        },
        resetUI: () => {
            generate.style({ display: 'flex' });
            action.style({ display: 'none' });
            play.style({ display: 'none' });
            audio = null;
            text = '';
        }
    })
}