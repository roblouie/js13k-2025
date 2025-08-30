import {Mesh} from "@/engine/renderer/mesh";
import {Scene} from "@/engine/renderer/scene";
import {makeWitch} from "@/modeling/witch";
import {EnhancedDOMPoint} from "@/engine/enhanced-dom-point";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {materials} from "@/textures";
import {areSpheresOverlapping, Sphere} from "@/engine/physics/aabb";
import {OctreeNode, querySphere} from "@/engine/physics/octree";
import {ThirdPersonPlayer} from "@/core/third-person-player";
import {theBestDamnCatHolyShit2} from "@/sounds/cat-sounds";
import {playPop} from "@/sounds/bubble-pop";
import {
  particleRandomizeHorizontal,
  particles,
  particleSpreadRadius,
  randomNegativeOneOne,
  spawnParticles
} from "@/engine/particles";

export class Witch {
  mesh: Mesh;
  collisionSphere: Sphere;
  orb: Mesh;
  octreeNodes: OctreeNode[] = [];

  constructor(mesh: Mesh) {
    this.mesh = mesh;
    this.collisionSphere = new Sphere(mesh.position.clone_(), 10);
    this.orb = new Mesh(new MoldableCubeGeometry(4, 4, 4, 4, 4, 4)
      .spherify(8)
      .translate_(mesh.position.x, mesh.position.y, mesh.position.z)
      .spreadTextureCoords(2, 2)
      .done_(), materials.bars);
  }
}

export class WitchManager {
  witches: Witch[] = [];
  sceneRef: Scene;

  constructor(sceneRef: Scene, octree: OctreeNode) {
    this.sceneRef = sceneRef;

    // 1 - Map start witch
    this.witches.push(new Witch(makeWitch(new EnhancedDOMPoint(103, 6.5, 125), new EnhancedDOMPoint(0, 50, 0))));

    // 2 - hedge maze witch
    this.witches.push(new Witch(makeWitch(new EnhancedDOMPoint(-202, 6.5, 195), new EnhancedDOMPoint(0, 37))));

    // 3 - behind bridge witch
    this.witches.push(new Witch(makeWitch(new EnhancedDOMPoint(-219, 6.5, 8), new EnhancedDOMPoint(0, 90))));

    // 4 - elevated path witch
    this.witches.push(new Witch(makeWitch(new EnhancedDOMPoint(212,46, -214), new EnhancedDOMPoint(0, -90))));

    // 5 - cave top witch
    this.witches.push(new Witch(makeWitch(new EnhancedDOMPoint(101, 63, 14.5), new EnhancedDOMPoint(0, 90))));

    // 6 - top of pipe witch
    this.witches.push(new Witch(makeWitch(new EnhancedDOMPoint(250, 91, -88.5), new EnhancedDOMPoint(0, -90))));

    // 7 - mountaintop witch
    this.witches.push(new Witch(makeWitch(new EnhancedDOMPoint(-105, 194.5, -106.5), new EnhancedDOMPoint(0, -180))));

    this.sceneRef.add_(...this.witches.flatMap(witch => [witch.mesh, witch.orb]));

    this.witches.forEach(witch => {
      querySphere(octree, witch.collisionSphere, node => {
        if (!node.witches) {
          node.witches = [];
        }
        node.witches.push(witch);
        witch.octreeNodes.push(node);
      });
    });
  }

  witchSavingTimer = 0;
  activeSavingWitch?: Witch;
  originalPlayerCameraPosition = new EnhancedDOMPoint();
  cameraPositionTarget = new EnhancedDOMPoint();
  starParticlePosition = new EnhancedDOMPoint();

  update(player: ThirdPersonPlayer) {
    this.witches.forEach(witch => {
      // Animation
      witch.mesh.alpha += 0.03;
      if (witch.mesh.alpha >= 1) {
        witch.mesh.alpha = 0;
        witch.mesh.frameA = witch.mesh.frameA === 0 ? 1 : 0;
        witch.mesh.frameB = witch.mesh.frameB === 0 ? 1 : 0;
      }
    });

    if (this.activeSavingWitch) {
      player.isFrozen = true;
      player.velocity.x = 0; player.velocity.z = 0;
      this.witchSavingTimer++;
      player.camera.position.set(this.cameraPositionTarget)
      player.camera.lookAt(this.activeSavingWitch.mesh.position);

      if (this.witchSavingTimer === 30) {
        theBestDamnCatHolyShit2();
      }

      if (this.witchSavingTimer === 100) {
        playPop();
        for (let i = 0; i < 30; i++) {
          particles.push({
            position: particleSpreadRadius(this.activeSavingWitch.mesh.position, 4),
            size: 50 + Math.random() * 10,
            life: 1.0,
            velocity: particleRandomizeHorizontal(0.4, 0.4),
            sizeModifier: -1,
            lifeModifier: 0.01,
            isAffectedByGravity: true,
          });
        }
        this.sceneRef.remove_(this.activeSavingWitch.orb);
      }

      if (this.witchSavingTimer === 110) {
        const pos = this.activeSavingWitch.mesh.position.clone_();
        pos.y += 4;
        for (let i = 0; i < 5; i++) {
          particles.push({
            position: particleSpreadRadius(pos, 1.5),
            size: 1 + Math.random(),
            life: 4,
            velocity: new EnhancedDOMPoint(randomNegativeOneOne() * 0.04, 0.04, randomNegativeOneOne() * 0.04),
            sizeModifier: 1,
            lifeModifier: 0.03,
            isAffectedByGravity: false,
          });
        }
      }

      if (this.witchSavingTimer === 200) {
        playPop(); // TODO: Replace with sparkle effect
        for (let i = 0; i < 50; i++) {
          particles.push({
            position: particleSpreadRadius(this.starParticlePosition, 2),
            size: 20 + Math.random() * 10,
            life: 3.0,
            velocity: particleRandomizeHorizontal(0.01, 0.13),
            sizeModifier: 1,
            lifeModifier: 0.03,
            isAffectedByGravity: false,
          });
        }
      }

      if (this.witchSavingTimer > 230) {
        this.activeSavingWitch.mesh.scale_.x *= 0.8;
        this.activeSavingWitch.mesh.scale_.z *= 0.8;
      }

      if (this.witchSavingTimer === 250) {
        this.witches.filter(w => w !== this.activeSavingWitch);
        this.sceneRef.remove_(this.activeSavingWitch.mesh);
        this.activeSavingWitch.octreeNodes.forEach(node => node.witches = node.witches?.filter(w => w !== this.activeSavingWitch));
      }

      if (this.witchSavingTimer === 300) {
        this.activeSavingWitch = undefined;
        player.isFrozen = false;
        player.camera.position.set(this.originalPlayerCameraPosition);
        player.camera.lookAt(player.mesh.position);
        this.witchSavingTimer = 0;
      }
      player.camera.updateWorldMatrix();
    } else {
      player.witchesToCheck.forEach(witch => {
        if (areSpheresOverlapping(witch.collisionSphere, player.collisionSphere)) {
          // for testing, just remove the witch from the nodes, scene, and the witch manager itself
          this.originalPlayerCameraPosition = player.camera.position.clone_();
          this.cameraPositionTarget = new EnhancedDOMPoint().set(witch.mesh.worldMatrix.transformPoint(new EnhancedDOMPoint(0,0,15)));
          this.starParticlePosition = new EnhancedDOMPoint().set(witch.mesh.worldMatrix.transformPoint(new EnhancedDOMPoint(0,0,6)));
          this.starParticlePosition.y -= 5;
          this.activeSavingWitch = witch;
        }
      });
    }
  }
}