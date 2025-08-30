import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"
import * as styles from "./card-face.style"

//   private audioCache: Map<string, HTMLAudioElement> = new Map();
export const CardFace = (text: string, audio?: string) => {
    const base = Div()
    base.cssClass(styles.baseStyle)

    const content = Div(text)
    base.append(content)

    if (audio) {
        console.log('Y', audio);

        const play = withRipple(Img(images.icons.play, { width: 24, height: 24 }))
        play.el.onclick = playAudio.bind(null, audio)
        play.cssClass(styles.playButtonStyle)
        base.append(play)
    }

    async function playAudio(url: string): Promise<void> {
        try {
            // let audio = this.audioCache.get(url);
            // if (!audio) {
            //     audio = new Audio(url);
            //     this.audioCache.set(url, audio);
            // }
            let audio = new Audio(url);
            // this.audioCache.set(url, audio);

            // Reset to beginning and play
            audio.currentTime = 0;
            await audio.play();
        } catch (error) {
            console.error('Failed to play audio:', error);
            throw error;
        }
    }

    return base
}




