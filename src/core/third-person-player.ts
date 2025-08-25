import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Face } from '@/engine/physics/face';
import { findWallCollisionsFromList } from '@/engine/physics/surface-collision';
import {clamp, radsToDegrees} from '@/engine/helpers';
import {OctreeNode, querySphere} from "@/engine/physics/octree";
import {controls} from "@/core/controls";
import {audioContext} from "@/engine/audio/simplest-midi";
import {Object3d} from "@/engine/renderer/object-3d";
import {makeCat} from "@/modeling/cat";
import {Sphere} from "@/engine/physics/aabb";
import {Mesh} from "@/engine/renderer/mesh";

export class ThirdPersonPlayer {
  isJumping = false;
  isGrounded = false;
  groundedTimer = 0;
  smoothedNormal = new EnhancedDOMPoint(0, 1, 0);
  chassisCenter = new EnhancedDOMPoint(0, 0, 0);
  velocity = new EnhancedDOMPoint(0, 0, 0);

  mesh: Object3d;
  camera: Camera;

  listener: AudioListener;

  constructor(camera: Camera) {
    this.mesh = new Object3d(makeCat());
    this.chassisCenter.y = 10;
    this.camera = camera;
    this.camera.position.set(this.chassisCenter);
    this.camera.position.z -=3;
    this.listener = audioContext.listener;
  }

  speed = 1;
  angle = 0;

  nearbyFaces = new Set<Face>();
  collisionSphere = new Sphere(this.chassisCenter, 2);

  yaw = 0;
  pitch = 0;
  cameraSpeed = 0.05;
  maxPitch = Math.PI / 2;

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

    if (this.groundedTimer < 10 && !this.isJumping) {
      const mesh = this.mesh.children_[0] as Mesh;
      mesh.alpha += this.velocity.magnitude / 2;

      if (mesh.alpha >= 1) {
        mesh.alpha = 0;
        mesh.frameA = mesh.frameA === 0 ? 1 : 0;
        mesh.frameB = mesh.frameB === 0 ? 1 : 0;
      }
    }

    const distanceToKeep = 15;

    if (controls.cameraDirection.magnitude) {
      this.yaw += controls.cameraDirection.x * -this.cameraSpeed;
      this.pitch += controls.cameraDirection.y * this.cameraSpeed;
      this.pitch = clamp(this.pitch, -this.maxPitch, this.maxPitch);
    } else {
      const toCam = this.camera.position.clone_().subtract(this.mesh.position).normalize_();
      // recover spherical angles from vector
      const onGround = this.groundedTimer < 10;
      const idlePitch = Math.atan2(4, distanceToKeep); // target pitch
      this.pitch += (idlePitch - this.pitch) * (onGround ? 0 : 0.05);   // smooth drift

      this.yaw   = Math.atan2(toCam.x, toCam.z);
    }

    const offsetX = distanceToKeep * Math.cos(this.pitch) * Math.sin(this.yaw);
    const offsetY = distanceToKeep * Math.sin(this.pitch);
    const offsetZ = distanceToKeep * Math.cos(this.pitch) * Math.cos(this.yaw);

    const desiredPosition = this.mesh.position.clone_().add_({
      x: offsetX,
      y: offsetY,
      z: offsetZ
    });

    this.camera.position.lerp(desiredPosition, 0.2);

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

    if (this.isGrounded) {
      this.groundedTimer = 0;
    } else {
      this.groundedTimer++;
      if (this.groundedTimer > 10) {
        this.smoothedNormal = this.smoothedNormal.lerp(new EnhancedDOMPoint(0,1,0), 0.1).normalize_();
        this.mesh.rotationMatrix = new DOMMatrix();
        const axis = new EnhancedDOMPoint().crossVectors(this.mesh.up, this.smoothedNormal);
        const radians = Math.acos(this.smoothedNormal.dot(this.mesh.up));
        this.mesh.rotationMatrix.rotateAxisAngleSelf(axis.x, axis.y, axis.z, radsToDegrees(radians));
      }
    }

    this.chassisCenter.add_(this.velocity);
  }

  protected updateVelocityFromControls() {
    const speedMultiplier = 0.2;

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
      this.mesh.children_[0].setRotation_(0, this.angle, 0);
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
