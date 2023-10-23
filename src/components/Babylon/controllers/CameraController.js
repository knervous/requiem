import { UniversalCamera, Vector3 } from '@babylonjs/core';
import { GameControllerChild } from './GameControllerChild';
import { eqtoBabylonVector } from '../../../util/vector';

class CameraController extends GameControllerChild { 
  /**
   * @type {import('@babylonjs/core/Cameras').UniversalCamera}
*/
  camera = null;
  isLocked = false;
  speedModified = false;
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
    document.removeEventListener('keydown', this.keyDownHandler);
    document.exitPointerLock();
    this.isLocked = false;
    this.speedModified = false;
  }

  constructor() {
    super();
    this.onChangePointerLock = this.onChangePointerLock.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
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

  keyDownHandler = e => {
    if (e.key === ' ') {
      this.camera.position.y += 5;
    }
    if (e.key === 'Shift' && !this.speedModified) {
      this.speedModified = true;
      this.camera.speed *= 3;
    }
  };

  keyUpHandler = e => {
    if (e.key === 'Shift' && this.speedModified) {
      this.speedModified = false;
      this.camera.speed /= 3;
    }
  };

  /**
   * @param {MouseEvent}e
   */
  sceneMouseDown(e) {
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
  }

  sceneMouseUp(e) {
    if (e.button === 2) {
      document.exitPointerLock();
    }
  }
  /**
   * 
   * @param {import('@babylonjs/core').Vector3} position
   * @returns 
   */
  createCamera = (position) => {
    if (!position) {
      const { safe_x, safe_y, safe_z } = this.state.zoneInfo;
      position = eqtoBabylonVector(safe_x, safe_y, safe_z);
    }
    if (sessionStorage.getItem('cam-loc')) {
      const { x, y, z } = JSON.parse(sessionStorage.getItem('cam-loc'));
      position = new Vector3(x, y, z);
    }
    position.y += 2;
    this.camera = new UniversalCamera('__camera__', position, this.currentScene);
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
    this.camera.speed = 2;
    document.addEventListener('keydown', this.keyDownHandler.bind(this));
    document.addEventListener('keyup', this.keyUpHandler.bind(this));

    
    document.addEventListener('pointerlockchange', this.onChangePointerLock, false);
    document.addEventListener('mspointerlockchange', this.onChangePointerLock, false);
    document.addEventListener(
      'mozpointerlockchange',
      this.onChangePointerLock,
      false,
    );
    document.addEventListener(
      'webkitpointerlockchange',
      this.onChangePointerLock,
      false,
    );
  };
}

export const cameraController = new CameraController();
