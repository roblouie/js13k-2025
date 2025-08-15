import { Camera } from '@/engine/renderer/camera';
import { EnhancedDOMPoint } from '@/engine/enhanced-dom-point';
import { Face } from '@/engine/physics/face';
import { controls } from '@/core/controls';
import {
  findWallCollisionsFromList,
} from '@/engine/physics/surface-collision';
import { audioContext, compressor, SimplestMidiRev2 } from '@/engine/audio/simplest-midi';
import { lightInfo } from '@/light-info';
import {OctreeNode, querySphere} from "@/engine/physics/octree";

export class Sphere {
  center: EnhancedDOMPoint;
  radius: number;

  constructor(center: EnhancedDOMPoint, radius: number) {
    this.center = center;
    this.radius = radius;
  }
}

export class FirstPersonPlayer {
  feetCenter = new EnhancedDOMPoint();
  velocity = new EnhancedDOMPoint();

  camera: Camera;
  cameraRotation = new EnhancedDOMPoint();
  collisionSphere: Sphere;
  listener: AudioListener;
  sfxPlayer: SimplestMidiRev2;
  normal = new EnhancedDOMPoint();

  health = 100;

  constructor(camera: Camera) {
    this.sfxPlayer = new SimplestMidiRev2();
    this.sfxPlayer.volume_.connect(compressor);
    this.feetCenter.set(2, 50, -2);
    this.collisionSphere = new Sphere(this.feetCenter, 2);
    this.camera = camera;
    this.listener = audioContext.listener;

    const rotationSpeed = 0.001;
    controls.onMouseMove(mouseMovement => {
        this.cameraRotation.x += mouseMovement.y * -rotationSpeed;
        this.cameraRotation.y += mouseMovement.x * -rotationSpeed;
        this.cameraRotation.x = Math.min(Math.max(this.cameraRotation.x, -Math.PI / 2), Math.PI / 2)
        this.cameraRotation.y = this.cameraRotation.y % (Math.PI * 2);
    });
  }

  nearbyFaces = new Set<Face>();

  update(octreeNode: OctreeNode) {

    tmpl.innerHTML += `<div style="font-size: 40px; text-align: center; position: absolute; bottom: 10px; right: 280px; color: #b00;">♥ <div style="position: absolute; bottom: 13px; left: 30px; width: ${this.health * 2}px; height: 20px; background-color: #b00;"></div></div>`;

    this.updateVelocityFromControls();

      this.velocity.y -= 0.008; // gravity

      this.nearbyFaces.clear();
      querySphere(octreeNode, this.collisionSphere, this.nearbyFaces);

      findWallCollisionsFromList(this.nearbyFaces, this);

      this.feetCenter.add_(this.velocity);

      this.camera.position.set(this.feetCenter);
      this.camera.position.y += 3.5;

    this.camera.setRotation_(...this.cameraRotation.toArray());

    this.normal.set(0, 0, -1);
    this.normal.set(this.camera.rotationMatrix.transformPoint(this.normal));
    lightInfo.spotLightPosition.set(this.camera.position);
    lightInfo.spotLightDirection.set(this.normal);

    this.camera.updateWorldMatrix();
    this.updateAudio();
  }

  protected updateVelocityFromControls() {
    const speed = 0.24;

    const depthMovementZ = Math.cos(this.cameraRotation.y) * controls.inputDirection.y * speed;
    const depthMovementX = Math.sin(this.cameraRotation.y) * controls.inputDirection.y * speed;

    const sidestepZ = Math.cos(this.cameraRotation.y + Math.PI / 2) * controls.inputDirection.x * speed;
    const sidestepX = Math.sin(this.cameraRotation.y + Math.PI / 2) * controls.inputDirection.x * speed;

    this.velocity.z = depthMovementZ + sidestepZ;
    this.velocity.x = depthMovementX + sidestepX;
    this.velocity.normalize_().scale_(speed);
  }

  private updateAudio() {
    if (this.listener.positionX) {
      this.listener.positionX.value = this.camera.position.x;
      this.listener.positionY.value = this.camera.position.y;
      this.listener.positionZ.value = this.camera.position.z;

      this.listener.forwardX.value = this.normal.x;
      this.listener.forwardY.value = this.normal.y;
      this.listener.forwardZ.value = this.normal.z;
    } else {
      this.listener.setPosition(...this.camera.position.toArray());
      this.listener.setOrientation(this.normal.x, this.normal.y, this.normal.z, 0, 1, 0);
    }
  }
}
