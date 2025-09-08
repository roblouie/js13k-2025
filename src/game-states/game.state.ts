import {State} from '@/core/state';
import {Scene} from '@/engine/renderer/scene';
import {Camera} from '@/engine/renderer/camera';
import {meshToFaces} from '@/engine/physics/parse-faces';
import {render} from '@/engine/renderer/renderer';
import {computeSceneBounds, OctreeNode} from "@/engine/physics/octree";
import {ThirdPersonPlayer} from "@/core/third-person-player";

import {WitchManager} from "@/witch-manager";
import {playSong} from "@/sounds/song";
import {makeWorld} from "@/modeling/full-world";
import {makeFloor} from "@/modeling/world-geography";
import {makeJackOLantern} from "@/modeling/jack-o-lantern";
import {EnemyManager} from "@/enemy-manager";

export class GameState implements State {
  player: ThirdPersonPlayer;
  scene: Scene;


  witchManager: WitchManager;
  enemyManager: EnemyManager;

  constructor() {
    this.scene = new Scene();
    //this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500));

    this.player = new ThirdPersonPlayer(new Camera(Math.PI / 2.5, 16 / 9, 1, 700));


    this.scene.add_(makeFloor(), makeWorld(), this.player.mesh);
    const faces = meshToFaces([makeFloor(), makeWorld()]);

    // precomputed world bounds, so not needed at runtime
    const worldBounds = computeSceneBounds(faces);
    this.octree = new OctreeNode(worldBounds, 0);
    faces.forEach(face => this.octree.insert(face));

    this.witchManager = new WitchManager(this.scene, this.octree);
    this.enemyManager = new EnemyManager(this.scene);

    playSong();
    setInterval(playSong, 14_200);
  }


  // TODO: remember to update this from the computed octree when level design finished
  octree = new OctreeNode({
    max: {x: 512, y: 12, z: 512, w: 1},
    min: { x: -512, y: -3, z: -512 }
  }, 0);

  onUpdate() {
    // tmpl.innerHTML = '';

    this.player.update(this.octree);
    this.enemyManager.update(this.player);
    this.witchManager.update(this.player);
    this.scene.updateWorldMatrix();
    render(this.player.camera, this.scene);
  }
}
