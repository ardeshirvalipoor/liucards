import { withRipple } from "../../base/components/advanced/ghost/ghost"
import { Div } from "../../base/components/native/div"
import { Img } from "../../base/components/native/img"
import images from "../../configs/images"
import * as styles from "./audio-play.style"

export const AudioPlay = (audioUrl?: string) => {
  let _audioUrl = audioUrl
  let currentAudio: HTMLAudioElement | null = null
  
  const base = Div()
  withRipple(base, {bg: '#ccc'})
  base.cssClass(styles.baseStyle)
  
  const play = Img(images.icons.play, { width: 30, height: 30 })
  play.cssClass(styles.playStyle)
  play.el.onclick = playAudio
  base.append(play)

  const pause = Img(images.icons.pause, { width: 26, height: 26 })
  pause.cssClass(styles.pauseStyle)
  pause.el.onclick = pauseAudio
  base.append(pause)
  
  function showPlayButton() {
    play.style({ transform: 'rotateY(0deg)' })
    pause.style({ transform: 'rotateY(180deg)' })
  }
  
  function showPauseButton() {
    play.style({ transform: 'rotateY(180deg)' })
    pause.style({ transform: 'rotateY(0deg)' })
  }
  
  async function playAudio(): Promise<void> {
    try {
      if (!_audioUrl) return
      
      // If there's already an audio instance, reuse it
      if (!currentAudio || currentAudio.src !== _audioUrl) {
        // Clean up previous audio if it exists
        if (currentAudio) {
          currentAudio.pause()
          currentAudio.removeEventListener('ended', handleAudioEnded)
        }
        
        currentAudio = new Audio(_audioUrl)
        
        // Add event listener for when audio ends
        currentAudio.addEventListener('ended', handleAudioEnded)
      }
      
      currentAudio.currentTime = 0
      await currentAudio.play()
      showPauseButton()
    } catch (error) {
      console.error('Failed to play audio:', error)
      showPlayButton()
      throw error
    }
  }
  
  async function pauseAudio(): Promise<void> {
    try {
      if (!currentAudio) return
      
      currentAudio.pause()
      showPlayButton()
    } catch (error) {
      console.error('Failed to pause audio:', error)
      throw error
    }
  }
  
  function handleAudioEnded() {
    showPlayButton()
  }
  
  return Object.assign(base, {
    setAudio(audio: string) {
      _audioUrl = audio
      // Reset the current audio instance when changing audio
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.removeEventListener('ended', handleAudioEnded)
        currentAudio = null
      }
      showPlayButton()
    },
    reset() {
      showPlayButton()
      _audioUrl = undefined
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.removeEventListener('ended', handleAudioEnded)
        currentAudio = null
      }
    },
    // Optional: cleanup method for when component is destroyed
    cleanup() {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.removeEventListener('ended', handleAudioEnded)
        currentAudio = null
      }
    },
    playAudio,
  })
}