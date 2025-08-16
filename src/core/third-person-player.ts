import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Face } from '@/engine/physics/face';
import { findWallCollisionsFromList } from '@/engine/physics/surface-collision';
import { clamp } from '@/engine/helpers';
import {OctreeNode, querySphere} from "@/engine/physics/octree";
import {Sphere} from "@/core/first-person-player";
import {controls} from "@/core/controls";
import {Mesh} from "@/engine/renderer/mesh";
import {audioContext} from "@/engine/audio/simplest-midi";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {materials} from "@/textures";

export class ThirdPersonPlayer {
  isJumping = false;
  chassisCenter = new EnhancedDOMPoint(0, 0, 0);
  velocity = new EnhancedDOMPoint(0, 0, 0);

  mesh: Mesh;
  camera: Camera;
  idealPosition = new EnhancedDOMPoint(0, 8, -17);
  idealLookAt = new EnhancedDOMPoint(0, 2, 0);

  listener: AudioListener;


  constructor(camera: Camera) {
    this.mesh = new Mesh(new MoldableCubeGeometry(1, 3, 1, 2, 2, 2).selectBy(vert => vert.x === 0).translate_(0, 0, 1).done_(), materials.marble);
    this.chassisCenter.y = 10;
    this.camera = camera;
    this.camera.position.set(this.chassisCenter);
    this.camera.position.z -=3;
    this.listener = audioContext.listener;
  }

  private transformIdeal(ideal: EnhancedDOMPoint): EnhancedDOMPoint {
    return new EnhancedDOMPoint()
      // .set(this.mesh.rotationMatrix.transformPoint(ideal))
      .add_(this.mesh.position);
  }

  speed = 1;
  speedCounter = 0;
  angle = 0;

  nearbyFaces = new Set<Face>();
  collisionSphere = new Sphere(this.chassisCenter, 2);

  update(octreeNode: OctreeNode) {
    this.updateVelocityFromControls();  // set x / z velocity based on input

    this.velocity.y -= 0.01; // gravity
    this.chassisCenter.add_(this.velocity);  // move the player position by the velocity

    // if the player falls through the floor, reset them
    if (this.chassisCenter.y < -100) {
      this.chassisCenter.y = 50;
      this.velocity.y = 0;
    }

    this.velocity.y = clamp(this.velocity.y, -1, 1);
    this.collideWithLevel(octreeNode); // do collision detection, if collision is found, feetCenter gets pushed out of the collision

    this.mesh.position.set(this.chassisCenter); // at this point, feetCenter is in the correct spot, so draw the mesh there
    this.mesh.position.y -= 0.5; // move up by half height so mesh ends at feet position

    const cameraPositionTarget = this.mesh.position.clone_();
    cameraPositionTarget.y += 4;

    // Keep camera away regardless of lerp
    const distanceToKeep = 15;
    const {x, z} = this.camera.position.clone_()
      .subtract(this.mesh.position) // distance from camera to player
      .normalize_() // direction of camera to player
      .scale_(distanceToKeep) // scale direction out by distance, giving us a lerp direction but constant distance
      .add_(this.mesh.position); // move back relative to player

    cameraPositionTarget.x = x;
    cameraPositionTarget.z = z;
    this.camera.position.lerp(cameraPositionTarget, 0.1);


    // Potentially the look at itself should be lerped, by having like a "meshTarget" that is updated to lerp towards mesh.position
    // This would smooth out some of the abrupt movements when the model goes over bumpy surfaces
    this.camera.lookAt(this.mesh.position);
    this.camera.updateWorldMatrix();

    this.updateAudio();
  }

  collideWithLevel(octreeNode: OctreeNode) {
    this.nearbyFaces.clear();
    querySphere(octreeNode, this.collisionSphere, this.nearbyFaces);

    findWallCollisionsFromList(this.nearbyFaces, this);

    this.chassisCenter.add_(this.velocity);
  }

  protected updateVelocityFromControls() {
    const speedMultiplier = 0.1;

    const mag = controls.inputDirection.magnitude;

    if (mag > 0.01) {
      const camDir = new EnhancedDOMPoint().set(this.camera.rotationMatrix.transformPoint(new EnhancedDOMPoint(0, 0, -1)));
      camDir.y = 0;
      camDir.normalize_();

      const camRight = new EnhancedDOMPoint(camDir.z, 0, -camDir.x);
      this.velocity.x = (camDir.x * -controls.inputDirection.y + camRight.x * -controls.inputDirection.x) * speedMultiplier;
      this.velocity.z = (camDir.z * -controls.inputDirection.y + camRight.z * -controls.inputDirection.x) * speedMultiplier;

      // Face direction of movement
      this.angle = Math.atan2(this.velocity.x, this.velocity.z);
      this.mesh.setRotation_(0, this.angle, 0);
    } else {
      this.velocity.x = 0;
      this.velocity.z = 0;
    }

    if (controls.isJump) {
      if (!this.isJumping) {
        this.velocity.y = 0.4;
        this.isJumping = true;
      }
    }
  }

  private updateAudio() {
    if (this.listener.positionX) {
      this.listener.positionX.value = this.mesh.position.x;
      this.listener.positionY.value = this.mesh.position.y;
      this.listener.positionZ.value = this.mesh.position.z;
    }

    const cameraPlayerDirection = this.mesh.position.clone_()
      .subtract(this.camera.position) // distance from camera to player
      .normalize_() // direction of camera to player

    if (this.listener.forwardX) {
      this.listener.forwardX.value = cameraPlayerDirection.x;
      this.listener.forwardZ.value = cameraPlayerDirection.z;
    }
  }
}
