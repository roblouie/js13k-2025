import {State} from '@/core/state';
import {Scene} from '@/engine/renderer/scene';
import {Camera} from '@/engine/renderer/camera';
import {heightMap, materials, pathTest, skyboxes} from '@/textures';
import {Mesh} from '@/engine/renderer/mesh';
import {meshToFaces} from '@/engine/physics/parse-faces';
import {AttributeLocation, render} from '@/engine/renderer/renderer';
import {MoldableCubeGeometry} from '@/engine/moldable-cube-geometry';
import {audioContext, biquadFilter, SimplestMidiRev2} from '@/engine/audio/simplest-midi';
import {elevatorDoor1, elevatorDoorTest, footstep} from '@/sounds';
import {computeSceneBounds, OctreeNode} from "@/engine/physics/octree";
import {ThirdPersonPlayer} from "@/core/third-person-player";
import {Skybox} from "@/engine/skybox";
import {hedgeMazeAndTube, tunnel} from "@/modeling/hedge-maze-and-tube";

export class GameState implements State {
  player: ThirdPersonPlayer;
  scene: Scene;

  sfxPlayer = new SimplestMidiRev2();

  constructor() {
    this.sfxPlayer.volume_.connect(biquadFilter);
    const skybox = new Skybox(...skyboxes.test);
    skybox.bindGeometry();
    this.scene = new Scene(skybox);
    //this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500));

    this.player = new ThirdPersonPlayer(new Camera(Math.PI / 3, 16 / 9, 1, 700));
  }

  octree = new OctreeNode({
    max: {x: 1024, y: 12, z: 1024, w: 1},
    min: { x: -1024, y: -3, z: -1024 }
  }, 0);

  async onEnter() {
    const heightmap = await heightMap();
    const floorGeo = new MoldableCubeGeometry(512, 1, 512, 63, 1, 63, 1)
    // const texDepths = new Array(256 * 256).fill(materials.cartoonGrass.texture.id);


    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        if (y === 0 || y === 63 || x === 0 || x === 63) {
          const index = y * 64 + x;
          heightmap[index] = Math.min(heightmap[index] + 40, 50);
          // texDepths[index] = 3;
        }
      }
    }

    // texDepths.data[0] = materials.marble.texture.id;
    // texDepths.data[1] = materials.marble.texture.id;


    // floorGeo.setAttribute_(AttributeLocation.TextureDepth, new Float32Array(texDepths), 1);

    const floor = new Mesh(
      floorGeo
        .modifyEachVertex((vert, index) => vert.y = heightmap[index])
      .spreadTextureCoords(5, 5).computeNormals().done_(), materials.cartoonGrass);

    const raisedSideArea = new MoldableCubeGeometry(100, 16, 100)
      .selectBy(vert => vert.z < 50)
      .translate_(-100)
      .all_()
      .translate_(100, 8, 200)
      .done_();

    const ramp = new MoldableCubeGeometry(10, 3, 60)
      .rotate_(Math.PI / 6, 0, 0)
      .translate_(150, 13.5, 25)
      .done_()

    const firstUpperLevel = new MoldableCubeGeometry(250, 30, 100)
      .translate_(125, 15, -50)
      .merge(ramp)
      .done_();



    const features = tunnel();

    const path = await pathTest();

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

    this.scene.add_(floor, features, this.player.mesh);
    const faces = meshToFaces([floor, features]);

    // precomputed world bounds, so not needed at runtime
    const worldBounds = computeSceneBounds(faces);
    this.octree = new OctreeNode(worldBounds, 0);
    faces.forEach(face => this.octree.insert(face));
  }

  onUpdate() {
    tmpl.innerHTML = '';

    this.player.update(this.octree);
    this.scene.updateWorldMatrix();
    render(this.player.camera, this.scene);
  }

  playElevatorSound() {
    this.player.sfxPlayer.playNote(audioContext.currentTime, 60, 70, elevatorDoor1, audioContext.currentTime + 4);
    this.player.sfxPlayer.playNote(audioContext.currentTime + 0.5, 60, 70, footstep, audioContext.currentTime + 2.5);
    this.player.sfxPlayer.playNote(audioContext.currentTime + 1.8, 60, 70, footstep, audioContext.currentTime + 2.5);
    this.sfxPlayer.playNote(audioContext.currentTime, 60, 70, elevatorDoorTest, audioContext.currentTime + 1);
  }

}
