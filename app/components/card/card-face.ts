import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import { AudioPlay } from "../audio-play/audio-play"
import * as styles from "./card-face.style"

export const CardFace = (text: string, audio?: string) => {
    const base = Div()
    base.cssClass(styles.baseStyle)

    const content = Div(text)
    content.cssClass(styles.contentStyle)
    base.append(content)

    if (audio) {
        const audioPlay = AudioPlay(audio)
        audioPlay.cssClass(styles.playButtonStyle)
        base.append(audioPlay)
    }

    return base
}




