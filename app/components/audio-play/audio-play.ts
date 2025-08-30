import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"
import * as styles from "./audio-play.style"

// todo: check if cache needed
// private audioCache: Map<string, HTMLAudioElement> = new Map();
// let audio = this.audioCache.get(url);
// if (!audio) {
//     audio = new Audio(url);
//     this.audioCache.set(url, audio);
// }

export const AudioPlay = (audio?: string) => {

    let _audio = audio

    const base = Div()
    withRipple(base, {bg: '#ccc'})
    base.cssClass(styles.baseStyle)

    const play = Img(images.icons.play, { width: 24, height: 24 })
    play.cssClass(styles.playStyle)
    play.el.onclick = playAudio
    base.append(play)

    const pause = Img(images.icons.pause, { width: 20, height: 20 })
    pause.cssClass(styles.pauseStyle)
    pause.el.onclick = pauseAudio
    base.append(pause)

    async function playAudio(): Promise<void> {
        try {
            if (!_audio) return;
            let audio = new Audio(_audio);
            audio.currentTime = 0;
            await audio.play();
            play.style({ transform: 'rotateY(180deg)' });
            pause.style({ transform: 'rotateY(0deg)' });
        } catch (error) {
            console.error('Failed to play audio:', error);
            throw error;
        }
    }

    async function pauseAudio(): Promise<void> {
        try {
            if (!_audio) return;
            let audio = new Audio(_audio);
            audio.pause();
            play.style({ transform: 'rotateY(0deg)' });
            pause.style({ transform: 'rotateY(180deg)' });
        } catch (error) {
            console.error('Failed to pause audio:', error);
            throw error;
        }
    }

    return Object.assign(base, {
        setAudio(audio: string) {
            _audio = audio
        },
        reset() {
            play.style({transform: 'rotateY(180deg)'})
            pause.style({transform: 'rotateY(180deg)'})
            _audio = undefined
        }
    })
}




