import { Vector3 } from '@babylonjs/core';

export const eqtoBabylonVector = (x, y, z) => {
  return new Vector3(y, z, x);
};