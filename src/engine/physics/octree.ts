import {Face} from "@/engine/physics/face";
import {AABB, isAABBOverlapping, isSphereOverlappingAABB} from "@/engine/physics/aabb";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {Sphere} from "@/core/first-person-player";

// TODO: In full js13k release, precomupte this and just put in the hard bounds in the base
// octree, and delete th is function
export function computeSceneBounds(triangles: Face[]): AABB {
  const min = new EnhancedDOMPoint(Infinity, Infinity, Infinity);
  const max = new EnhancedDOMPoint(-Infinity, -Infinity, -Infinity);

  triangles.forEach(triangle => {
    min.x = Math.min(min.x, triangle.aabb.min.x);
    min.y = Math.min(min.y, triangle.aabb.min.y);
    min.z = Math.min(min.z, triangle.aabb.min.z);

    max.x = Math.max(max.x, triangle.aabb.max.x);
    max.y = Math.max(max.y, triangle.aabb.max.y);
    max.z = Math.max(max.z, triangle.aabb.max.z);
  });

  return { min, max };
}

export function querySphere(node: OctreeNode, sphere: Sphere, results: Set<Face>) {
  if (!isSphereOverlappingAABB(sphere, node.bounds)) {
    return;
  }

  if (!node.children) {
    node.faces.forEach(face => results.add(face));
  } else {
    node.children.forEach(child => querySphere(child, sphere, results));
  }
}

export class OctreeNode {
  bounds: AABB;
  faces: Face[] = [];
  children: OctreeNode[] | null = null;
  depth: number;

  static MAX_TRIANGLES = 10;
  static MAX_DEPTH = 6;
  static MIN_HEIGHT = 2;

  constructor(bounds: AABB, depth = 0) {
    this.bounds = bounds;
    this.depth = depth;
  }

  private isBigEnough() {
    return (this.bounds.max.y - this.bounds.min.y) >= OctreeNode.MIN_HEIGHT;
  }

  insert(face: Face) {
    if (!this.children) {
      this.faces.push(face);

      if (this.faces.length > OctreeNode.MAX_TRIANGLES && this.depth < OctreeNode.MAX_DEPTH && this.isBigEnough()) {
        this.subdivide();
        for (const tri of this.faces) {
          this.insertIntoChildren(tri);
        }
        this.faces = [];
      }
    } else {
      this.insertIntoChildren(face);
    }
  }

  private insertIntoChildren(face: Face) {
    for (const child of this.children!) {
      if (isAABBOverlapping(face.aabb, child.bounds)) {
        child.insert(face);
      }
    }
  }

  private subdivide() {
    const {min, max} = this.bounds;
    const center = {
      x: (min.x + max.x) / 2,
      y: (min.y + max.y) / 2,
      z: (min.z + max.z) / 2,
    };

    this.children = [];

    for (let i = 0; i < 8; i++) {
      const childMin = {
        x: (i & 1) ? center.x : min.x,
        y: (i & 2) ? center.y : min.y,
        z: (i & 4) ? center.z : min.z,
      };
      const childMax = {
        x: (i & 1) ? max.x : center.x,
        y: (i & 2) ? max.y : center.y,
        z: (i & 4) ? max.z : center.z,
      };

      this.children.push(new OctreeNode({min: childMin, max: childMax}, this.depth + 1));
    }
  }
}