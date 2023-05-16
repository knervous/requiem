import * as THREE from 'three';

export function worldToScreen(canvas, vec3_, camera_) {

  const pos = new THREE.Vector3(vec3_.x, vec3_.y, vec3_.z);
  pos.project(camera_);

  pos.x = (pos.x * canvas.width / 2) + canvas.width / 2;
  pos.y = -(pos.y * canvas.height / 2) + canvas.height / 2;
  pos.z = 0;

  return { x: pos.x, y: pos.y };
    
}

export class PylonBufferGeometry extends THREE.BufferGeometry {
  constructor(radius_, height_, offset_) {
    super(radius_, height_, offset_);
    this.parameters = {

      raidus: radius_,
      height: height_,
    
    };
    
    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];
    
    vertices.push(0, offset_, 0);
    
    for (let i = 0; i < 3; i++) {
    
      const dx = radius_ * Math.cos(Math.PI * 2 / 3 * i);
      const dy = offset_ + height_;
      const dz = radius_ * Math.sin(Math.PI * 2 / 3 * i);
    
      vertices.push(dx, dy, dz);
    
    }
    
    indices.push(0, 1, 2, 0, 2, 3, 0, 3, 1, 3, 2, 1);
    
    for (let i = 0; i < indices.length / 3; i++) {
    
      // const a = new THREE.Vector3(vertices[i], offset_ + vertices[i + 1], vertices[i + 2]);
      const b = new THREE.Vector3(vertices[(i + 1)], offset_ + vertices[(i + 1) + 1], vertices[(i + 2) + 2]);
      const c = new THREE.Vector3(vertices[(i + 2)], offset_ + vertices[(i + 2) + 1], vertices[(i + 2) + 2]);
    
      const ab = b.sub(b);
      const ac = b.sub(c);
      const n = ab.cross(ac);   
    
      normals.push(n.x, n.y, n.z);
      // uvs.push( u, 1 - v );
    
    }
    
    this.setIndex(indices);
    this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  }

}

// export function getPositionFromLongLat(center_, object_) {
    
//   const centerCoords = mapboxgl.MercatorCoordinate.fromLngLat(center_.LngLat, 0);
//   const objectCoords = mapboxgl.MercatorCoordinate.fromLngLat(object_.LngLat, 0);
    
//   let dx = centerCoords.x - objectCoords.x;
//   let dy = centerCoords.y - objectCoords.y;
    
//   dx /= center_.scale;
//   dy /= center_.scale;

//   return new THREE.Vector3(-dx, 0, -dy);
// }
           