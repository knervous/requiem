const aabb = require('./aabb.json');
const { Vector3 } = require('three');

const leafNodes = [];

import('sparse-octree').then(async ({ PointOctree }) => {
  const traverseNode = node => {
    if (node.left) {
      traverseNode(node.left);
    }
    if (node.right) {
      traverseNode(node.right);
    }
    if (!node.right && !node.left && JSON.stringify(node) !== '{}') {
      leafNodes.push(node);
    }
  };
  const { Vector3: BabylonVector3 } = await import('@babylonjs/core');
  traverseNode(aabb);
  const { min, max } = aabb;
  const octree = new PointOctree(new Vector3(min.x, min.y, min.z), new Vector3(max.x, max.y, max.z));
      
  let maxDistance = 0;
  for (const leafNode of leafNodes) {
    maxDistance = Math.max(maxDistance, BabylonVector3.Distance(new BabylonVector3(leafNode.min.x, leafNode.min.y, leafNode.min.z), new BabylonVector3(leafNode.max.x, leafNode.max.y, leafNode.max.z)));
    octree.set(new Vector3(leafNode.min.x, leafNode.min.y, leafNode.min.z), {
      max    : leafNode.max,
      regions: leafNode.regions,
      zone   : leafNode.zone
    });
  }
  const r = 123;
  require('fs').writeFileSync('./leafNodes.json', JSON.stringify(leafNodes));

});
