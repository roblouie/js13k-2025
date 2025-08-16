import { Face } from './face';
import { EnhancedDOMPoint } from "@/engine/enhanced-dom-point";
import { FirstPersonPlayer } from '@/core/first-person-player';
import {ThirdPersonPlayer} from "@/core/third-person-player";
import {radsToDegrees} from "@/engine/helpers";

export function findWallCollisionsFromList(walls: Set<Face>, player: ThirdPersonPlayer) {
  player.isGrounded = false;

  for (const wall of walls) {
    const newWallHit = testSphereTriangle(player.collisionSphere, wall);

    if (newWallHit) {
      const depth = newWallHit.penetrationDepth + 0.00000001;
      player.smoothedNormal = player.smoothedNormal.lerp(wall.normal, 0.1).normalize_();

      if (wall.normal.y >= 0.6 && player.velocity.y < 0) {
        player.collisionSphere.center.y += depth;
        player.velocity.y = 0;
        player.isJumping = false;
        player.isGrounded = true;
        player.mesh.isUsingLookAt = true;
        player.mesh.rotationMatrix = new DOMMatrix();
        const axis = new EnhancedDOMPoint().crossVectors(player.mesh.up, player.smoothedNormal);
        const radians = Math.acos(player.smoothedNormal.dot(player.mesh.up));
        player.mesh.rotationMatrix.rotateAxisAngleSelf(axis.x, axis.y, axis.z, radsToDegrees(radians));
      } else {
        const correctionVector = newWallHit.penetrationNormal.scale_(depth);
        player.collisionSphere.center.add_(correctionVector);

        const normalComponent = newWallHit.penetrationNormal.scale_(player.velocity.dot(newWallHit.penetrationNormal));
        player.velocity.subtract(normalComponent);

        if (wall.normal.y <= -0.6 && player.velocity.y > 0) {
          player.velocity.y = 0;
        }
      }
    }
    }
  }

function testSphereTriangle(s: { center: EnhancedDOMPoint, radius: number }, wall: Face) {
  // Ignore back sides of triangles
  const dist = new EnhancedDOMPoint().subtractVectors(s.center, wall.points_[0]).dot(wall.normal);
  if (dist < 0) {
    return;
  }

  const p = closestPointInTriangle(s.center, wall.points_[0], wall.points_[1], wall.points_[2]);
  const v = new EnhancedDOMPoint().subtractVectors(s.center, p);
  const squaredDistanceFromPointOnTriangle = v.dot(v);
  const isColliding = squaredDistanceFromPointOnTriangle <= s.radius * s.radius;
  if (isColliding) {
    const penetrationNormal = v.normalize_();
    const penetrationDepth = s.radius - Math.sqrt(squaredDistanceFromPointOnTriangle);
    return {
      penetrationNormal,
      penetrationDepth,
    };
  }
}

function closestPointInTriangle(p: EnhancedDOMPoint, a: EnhancedDOMPoint, b: EnhancedDOMPoint, c: EnhancedDOMPoint) {
  const ab = new EnhancedDOMPoint().subtractVectors(b, a);
  const ac = new EnhancedDOMPoint().subtractVectors(c, a);
  const ap = new EnhancedDOMPoint().subtractVectors(p, a);

  const d1 = ab.dot(ap);
  const d2 = ac.dot(ap);

  if (d1 <= 0 && d2 <= 0) return a;

  const bp = new EnhancedDOMPoint().subtractVectors(p, b);
  const d3 = ab.dot(bp);
  const d4 = ac.dot(bp);

  if (d3 >= 0 && d4 <= d3) return b;

  const vc = d1 * d4 - d3 * d2;

  if (vc <= 0 && d1 >= 0 && d3 <= 0) {
    const v = d1 / (d1 - d3);
    return new EnhancedDOMPoint().addVectors(a, new EnhancedDOMPoint().set(ab).scale_(v));
  }

  const cp = new EnhancedDOMPoint().subtractVectors(p, c);
  const d5 = ab.dot(cp);
  const d6 = ac.dot(cp);

  if (d6 >= 0 && d5 <= d6) return c;

  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) {
    const w = d2 / (d2 - d6);
    return new EnhancedDOMPoint().addVectors(a, new EnhancedDOMPoint().set(ac).scale_(w));
  }

  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
    const w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
    const wbc = new EnhancedDOMPoint().subtractVectors(c, b).scale_(w);
    return new EnhancedDOMPoint().addVectors(b, wbc);
  }

  const denom = 1 / (va + vb + vc);
  const v = vb * denom;
  const w = vc * denom;
  const abv = new EnhancedDOMPoint().set(ab).scale_(v);
  const acw = new EnhancedDOMPoint().set(ac).scale_(w);
  return new EnhancedDOMPoint().addVectors(abv, acw).add_(a);
}
