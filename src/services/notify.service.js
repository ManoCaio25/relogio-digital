import { Howl } from 'howler';
import soundUrl from '../assets/sounds/notify.mp3?url';

let sound;

try {
  sound = new Howl({
    src: [soundUrl],
    volume: 0.35
  });
} catch (error) {
  console.warn('notifyService:init', error);
}

export const notifyService = {
  play() {
    try {
      sound?.play();
    } catch (error) {
      console.warn('notifyService', error);
    }
  }
};
