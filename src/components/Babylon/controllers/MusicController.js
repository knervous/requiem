import { Engine, Sound, Vector3 } from '@babylonjs/core';
import { Vector3 as ThreeVector3 } from 'three';
import { PointOctree } from 'sparse-octree';

const musicUrl = 'https://eqrequiem.blob.core.windows.net/assets/music/';

class MusicController {
  currentPlaying = null;

  /**
   * @type {import('@babylonjs/core/scene').Scene}
   */
  #scene = null;

  /**
   * @type {import('sparse-octree').PointOctree}
   */
  octree = null;

  /**
   * @type {import('@babylonjs/core').Vector3}
   */
  lastPosition = new Vector3(0, 0, 0);

  /**
   * @type {number}
   */
  maxRadius = 0;

  /**
   * @type {Array<{ sound: import('@babylonjs/core/Audio').Sound, track: object }>}
   */
  zoneTracks = [];

  /**
   * @type {number}
   */
  currentTrack = -1;
  
  /**
   * @type {number}
   */
  currentTimeout = -1;
  dispose() {
    this.zoneTracks.forEach(({ sound }) => {
      sound.dispose();
    });
    this.zoneTracks = [];
  }

  play(idx) {
    clearTimeout(this.currentTimeout);
    const { sound, track: _track } = this.zoneTracks[idx];
    sound.play();
    sound.onEndedObservable.addOnce(() => {
      this.currentTrack = -1;
    });
    // this.currentTimeout = setTimeout(() => {
    //   this.currentInterval = setInterval(() => {
    //     console.log('distance', Vector3.Distance(this.lastPosition, new Vector3(track.x, track.z, track.y)));
    //     if (Vector3.Distance(this.lastPosition, new Vector3(track.x, track.z, track.y)) > track.radius) {
    //       sound.stop();
    //       this.currentTrack = 0;
    //     }
    //   }, 2000);
      
    // }, track.fadeMs);
  }

  stopAll() {
    this.zoneTracks.forEach(({ sound }) => {
      sound.stop();
    });
  }

  hookUpZoneMusic(scene, zoneName, tracks, aabbTree) {
    // Disable the default audio unlock button
    Engine.audioEngine.useCustomUnlockedButton = true;

    // Unlock audio on first user interaction.
    window.addEventListener('click', () => {
      if (!Engine.audioEngine.unlocked) {
        Engine.audioEngine.unlock();
      }
    }, { once: true });
    this.#scene = scene;
    this.zoneTracks = tracks.map((t, idx) => {
      return {
        track: t,
        sound: new Sound(`${zoneName}-${idx}`, `${musicUrl}${zoneName}.xmi(${t.dayId + 1}).mp3`, scene)
      };
    });

    this.maxRadius = tracks.reduce((acc, val) => acc > val.radius ? acc : val.radius, 0);
    const { min, max } = aabbTree;
    this.octree = new PointOctree(new ThreeVector3(min.x, min.y, min.z), new ThreeVector3(max.x, max.y, max.z));
    this.zoneTracks.forEach(({ track }, idx) => {
      const [x, z, y] = track.pos;
      this.octree.set(new ThreeVector3(x, y, z), idx);
    });
  }


  updateMusic(position) {
    if (!Engine.audioEngine.unlocked) {
      return;
    }
    this.lastPosition = position;
    const threePosition = new ThreeVector3(position.x, position.z, position.y);
    const track = this.octree.findPoints(threePosition, this.maxRadius, true).sort((a, b) => a.distance - b.distance).slice(0, 1)?.[0]?.data ?? null;
    
    if (track !== null && this.currentTrack !== track) {
      this.stopAll();
      this.currentTrack = track;
      this.play(track);
    }
  }
}

export const musicController = new MusicController();