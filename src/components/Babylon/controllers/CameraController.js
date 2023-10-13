import { UniversalCamera, Vector3 } from '@babylonjs/core';
import { GameControllerChild } from './GameControllerChild';

class CameraController extends GameControllerChild { 
  /**
   * @type {import('@babylonjs/core/Cameras').UniversalCamera}
*/
  camera = null;
  isLocked = false;
  dispose() {
    if (this.camera) {
      this.camera.dispose();
    }
    document.removeEventListener(
      'pointerlockchange',
      this.onChangePointerLock,
      false,
    );
    document.removeEventListener(
      'mspointerlockchange',
      this.onChangePointerLock,
      false,
    );
    document.removeEventListener(
      'mozpointerlockchange',
      this.onChangePointerLock,
      false,
    );
    document.removeEventListener(
      'webkitpointerlockchange',
      this.onChangePointerLock,
      false,
    );
    document.removeEventListener('keydown', this.keyHandler);
  }

  onChangePointerLock = () => {
    const controlEnabled =
        document.mozPointerLockElement ||
        document.webkitPointerLockElement ||
        document.msPointerLockElement ||
        document.pointerLockElement ||
        null;
    if (!controlEnabled) {
      this.isLocked = false;
    } else {
      this.isLocked = true;
    }
  };

  keyHandler = e => {
    if (e.key === ' ') {
      this.camera.position.y += 5;
    } 
  };

  /**
   * 
   * @param {import('@babylonjs/core/scene').Scene} scene 
   * @returns 
   */
  createCamera = (scene) => {
    let startingLoc = new Vector3(5, 10, 0);
    if (sessionStorage.getItem('cam-loc')) {
      const { x, y, z } = JSON.parse(sessionStorage.getItem('cam-loc'));
      startingLoc = new Vector3(x, y, z);
    }
    this.camera = new UniversalCamera('__camera__', startingLoc, scene);
    this.camera.setTarget(new Vector3(1, 10, 1));
    this.camera.touchAngularSensibility = 5000;

    this.camera.applyGravity = true;
    this.camera.ellipsoid = new Vector3(4, 4.5, 2);
    this.camera.checkCollisions = true;
    this.camera.attachControl(this.canvas, true);
    this.camera.keysUp.push(87);
    this.camera.keysDown.push(83);
    this.camera.keysRight.push(68);
    this.camera.keysLeft.push(65);
    this.camera.keysUpward.push(32);

    document.addEventListener('keydown', this.keyHandler.bind(this));
  
    if (scene && this.canvas) {
      scene.onPointerDown = (e) => {
        if (
          (e.button === 2 && !this.isLocked && this.canvas.requestPointerLock) ||
          this.canvas.msRequestPointerLock ||
          this.canvas.mozRequestPointerLock ||
          this.canvas.webkitRequestPointerLock
        ) {
          try {
            this.canvas.requestPointerLock();
          } catch {}
        }
      };
      scene.onPointerUp = e => {
        if (e.button === 2) {
          document.exitPointerLock();
        }
      };
    }
    
    document.addEventListener('pointerlockchange', this.onChangePointerLock.bind(this), false);
    document.addEventListener('mspointerlockchange', this.onChangePointerLock.bind(this), false);
    document.addEventListener(
      'mozpointerlockchange',
      this.onChangePointerLock.bind(this),
      false,
    );
    document.addEventListener(
      'webkitpointerlockchange',
      this.onChangePointerLock.bind(this),
      false,
    );
  };
}

export const cameraController = new CameraController();
