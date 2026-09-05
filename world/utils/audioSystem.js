import { Howl } from 'howler';
import { useAudioStore } from '../Experience/stores/audioStore';

const sounds = {
  buttonClick: new Howl({ src: ['/audio/sfx/ButtonClick.mp3'], volume: 0.5 }),
  doorOpening: new Howl({ src: ['/audio/sfx/DoorOpening.mp3'], volume: 0.4 }),
  doorClosing: new Howl({ src: ['/audio/sfx/DoorClosing.mp3'], volume: 0.4 }),
  backgroundMusic: new Howl({ src: ['/audio/music/meadow-loop.wav'], loop: true, volume: 0.45 }),
};

export function playSound(id) {
  if (useAudioStore.getState().isAudioEnabled) sounds[id]?.play();
}
export function playBackgroundMusic() {
  if (!sounds.backgroundMusic.playing()) sounds.backgroundMusic.play();
}
export function pauseBackgroundMusic() { sounds.backgroundMusic.pause(); }
