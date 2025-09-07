import {State} from '@/core/state';
import {Scene} from '@/engine/renderer/scene';
import {Camera} from '@/engine/renderer/camera';
import {meshToFaces} from '@/engine/physics/parse-faces';
import {AttributeLocation, render} from '@/engine/renderer/renderer';
import {MoldableCubeGeometry} from '@/engine/moldable-cube-geometry';
import {computeSceneBounds, OctreeNode} from "@/engine/physics/octree";
import {ThirdPersonPlayer} from "@/core/third-person-player";
import {hedgeMazeAndTube, tunnel} from "@/modeling/hedge-maze-and-tube";
import {floatingPath} from "@/modeling/floating-path";
import {floatingPlatforms} from "@/modeling/floating-platforms";
import {rampToJump} from "@/modeling/ramp-to-jump";
import {mountain} from "@/modeling/mountain";
import {
  frontLeftCliffForBridge,
  mountainAreaLeftCliff, nightCave,
  tubeCliffAndCave, worldWall
} from "@/modeling/world-geography";
import {bridge, frontRamp} from "@/modeling/bridges";
import {WitchManager} from "@/engine/witch-manager";
import {playSong} from "@/sounds/song";
import {makeWorld} from "@/js13k-shared-modeling/full-world";
import {makeFloor} from "@/js13k-shared-modeling/world-geography";

export class GameState implements State {
  player: ThirdPersonPlayer;
  scene: Scene;


  witchManager: WitchManager;

  constructor() {
    this.scene = new Scene();
    //this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500));

    this.player = new ThirdPersonPlayer(new Camera(Math.PI / 2.5, 16 / 9, 1, 700));

    const floorGeo = new MoldableCubeGeometry(512, 1, 512, 31, 1, 31, 1)
    //const texDepths = new Array(256 * 256).fill(materials.cartoonGrass.texture.id);


    // for (let y = 0; y < 64; y++) {
    //   for (let x = 0; x < 64; x++) {
    //     if (y === 0 || y === 63 || x === 0 || x === 63) {
    //       const index = y * 64 + x;
    //       heightmap[index] = Math.min(heightmap[index] + 40, 50);
    //       //texDepths[index] = 3;
    //     }
    //   }
    // }

    // texDepths.data[0] = materials.marble.texture.id;
    // texDepths.data[1] = materials.marble.texture.id;


    // floorGeo.setAttribute_(AttributeLocation.TextureDepth, new Float32Array(texDepths), 1);





    const ramp = new MoldableCubeGeometry(10, 3, 60)
      .rotate_(Math.PI / 6, 0, 0)
      .translate_(150, 13.5, 25)
      .done_()

    const firstUpperLevel = new MoldableCubeGeometry(250, 30, 100)
      .translate_(125, 15, -50)
      .merge(ramp)
      .done_();



    // const features = rampToJump();

    // const path = await pathTest();

    // let val = 0;
    // for (let i = 3; i < path.data.length; i+=4) {
    //   val++
    //   if (path.data[i] !== 0) {
    //     texDepths[val] = 5 + path.data[i] / 255;
    //   }
    // }
    //
    // floor.geometry.setAttribute_(AttributeLocation.TextureDepth, new Float32Array(texDepths), 1);

    // floor.geometry.merge(new MoldableCubeGeometry(20, 10, 20).texturePerSide(materials.cartoonGrass)).done_();

    const hedgeMaze = hedgeMazeAndTube();
    const tnl = tunnel();
    const floating = floatingPlatforms();
    const path2 = floatingPath();
    const rampToJmp = rampToJump();
    const mntn = mountain();
    const tubeCaveArea = tubeCliffAndCave();
    const mtnAreaCliff = mountainAreaLeftCliff();
    const frontLeftCliff = frontLeftCliffForBridge();
    const brdge = bridge();
    const frntBrdge = frontRamp();
    const wrldWall = worldWall();
    const cave = nightCave();

    this.scene.add_(makeFloor(), makeWorld(), this.player.mesh);
    const faces = meshToFaces([makeFloor(), makeWorld()]);

    // precomputed world bounds, so not needed at runtime
    const worldBounds = computeSceneBounds(faces);
    this.octree = new OctreeNode(worldBounds, 0);
    faces.forEach(face => this.octree.insert(face));

    this.witchManager = new WitchManager(this.scene, this.octree);

    playSong();
    setInterval(playSong, 14_200);
  }


  // TODO: remember to update this from the computed octree when level design finished
  octree = new OctreeNode({
    max: {x: 512, y: 12, z: 512, w: 1},
    min: { x: -512, y: -3, z: -512 }
  }, 0);

  onUpdate() {
    tmpl.innerHTML = '';

    this.player.update(this.octree);
    this.witchManager.update(this.player);
    this.scene.updateWorldMatrix();
    render(this.player.camera, this.scene);
  }
}
