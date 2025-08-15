import { State } from '@/core/state';
import { FirstPersonPlayer } from '@/core/first-person-player';
import { Scene } from '@/engine/renderer/scene';
import { Camera } from '@/engine/renderer/camera';
import {heightMap, materials, metals} from '@/textures';
import { Mesh } from '@/engine/renderer/mesh';
import { meshToFaces } from '@/engine/physics/parse-faces';
import { render } from '@/engine/renderer/renderer';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { audioContext, biquadFilter, SimplestMidiRev2 } from '@/engine/audio/simplest-midi';
import {elevatorDoor1, elevatorDoorTest, elevatorMotionRev1, footstep, hideSound} from '@/sounds';
import {computeSceneBounds, OctreeNode} from "@/engine/physics/octree";
import {ThirdPersonPlayer} from "@/core/third-person-player";

export class GameState implements State {
  player: ThirdPersonPlayer;
  scene: Scene;

  sfxPlayer = new SimplestMidiRev2();

  constructor() {
    this.sfxPlayer.volume_.connect(biquadFilter);
    this.scene = new Scene();
    //this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500));

    this.player = new ThirdPersonPlayer(new Camera(Math.PI / 3, 16 / 9, 1, 500));
  }

  octree = new OctreeNode({
    max: {x: 1024, y: 12, z: 1024, w: 1},
    min: { x: -1024, y: -3, z: -1024 }
  }, 0);

  async onEnter() {
    const heightmap = await heightMap();
    const floor = new Mesh(new MoldableCubeGeometry(1024, 1, 1024, 255, 1, 255, 1)
      .modifyEachVertex((vert, index) => vert.y = heightmap[index])
      .spreadTextureCoords(5, 5).translate_(0, -3, 0).done_(), materials.redCarpet);

    this.scene.add_(floor, this.player.mesh);
    const faces = meshToFaces([floor]);

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
