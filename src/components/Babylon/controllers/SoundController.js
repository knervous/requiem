import { Sound, Vector3 } from '@babylonjs/core';
const musicUrl = 'https://eqrequiem.blob.core.windows.net/assets/sounds/';

class SoundController {
  zoneSounds = [];
  dispose() {
    this.zoneSounds.forEach(sound => {
      sound.dispose();
    });
    this.zoneSounds = [];
  }
  
  hookUpZoneSounds(scene, sound2d, sound3d) {
    sound3d.forEach((sound, idx) => {
      const spatialSound = new Sound(`${sound.sound}_${idx}`, `${musicUrl}${sound.sound}.wav`, scene, null, {
        loop        : true,
        autoplay    : true,
        spatialSound: true,
        panningModel: 'HRTF',
        maxDistance : sound.radius,
        volume      : sound.volume
      });
      const [x, y, z] = sound.pos;
      spatialSound.setPosition(new Vector3(x, y, z));
      this.zoneSounds.push(spatialSound);

    });
  }
}

export const soundController = new SoundController();