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

      // const testSphere = new MoldableCubeGeometry(4, 4, 4, 4, 4, 4)
      //   .spherify(10)
      //   .translate_(witch.mesh.position.x, witch.mesh.position.y, witch.mesh.position.z)
      //   .spreadTextureCoords(2, 2)
      //   .done_();
      // this.sceneRef.add_(new Mesh(testSphere, materials.bars))
    });
  }

  witchSavingTimer = 0;
  activeSavingWitch?: Witch;
  originalPlayerCameraPosition = new EnhancedDOMPoint();
  cameraPositionTarget = new EnhancedDOMPoint();

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

    // maybe move this into game state as it feels jank to modify player here, but doing it for now for testing

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
        this.sceneRef.remove_(this.activeSavingWitch.orb);
      }


      if (this.witchSavingTimer > 300) {
        this.witches.filter(w => w !== this.activeSavingWitch);
        this.sceneRef.remove_(this.activeSavingWitch.mesh);
        this.activeSavingWitch.octreeNodes.forEach(node => node.witches = node.witches?.filter(w => w !== this.activeSavingWitch));
        player.isFrozen = false;
        player.camera.position.set(this.originalPlayerCameraPosition);
        this.activeSavingWitch = undefined;
        this.witchSavingTimer = 0;
      }
      player.camera.updateWorldMatrix();
    } else {
      player.witchesToCheck.forEach(witch => {
        if (areSpheresOverlapping(witch.collisionSphere, player.collisionSphere)) {
          // for testing, just remove the witch from the nodes, scene, and the witch manager itself
          this.originalPlayerCameraPosition = player.camera.position.clone_();
          this.cameraPositionTarget = new EnhancedDOMPoint().set(witch.mesh.worldMatrix.transformPoint(new EnhancedDOMPoint(0,0,15)));
          this.activeSavingWitch = witch;
        }
      });
    }
  }
}