import { State } from '@/core/state';
import { FirstPersonPlayer } from '@/core/first-person-player';
import { Scene } from '@/engine/renderer/scene';
import { Camera } from '@/engine/renderer/camera';
import { materials } from '@/textures';
import { Mesh } from '@/engine/renderer/mesh';
import { meshToFaces } from '@/engine/physics/parse-faces';
import { render } from '@/engine/renderer/renderer';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { audioContext, biquadFilter, SimplestMidiRev2 } from '@/engine/audio/simplest-midi';
import {elevatorDoor1, elevatorDoorTest, elevatorMotionRev1, footstep, hideSound} from '@/sounds';
import {OctreeNode} from "@/engine/physics/octree";

export class GameState implements State {
  player: FirstPersonPlayer;
  scene: Scene;

  sfxPlayer = new SimplestMidiRev2();

  constructor() {
    this.sfxPlayer.volume_.connect(biquadFilter);
    this.scene = new Scene();
    //this.player = new FreeCam(new Camera(Math.PI / 3, 16 / 9, 1, 500));

    this.player = new FirstPersonPlayer(new Camera(Math.PI / 3, 16 / 9, 1, 500));
  }

  octree = new OctreeNode({
    max: {x: 90, y: 12, z: 154, w: 1},
    min: { x: -90, y: -3, z: -26 }
  }, 0);

  onEnter() {
    const floor = new Mesh(new MoldableCubeGeometry(180, 1, 180).spreadTextureCoords(5, 5).translate_(0, 0, 64).done_(), materials.redCarpet);

    this.scene.add_(floor);
    const faces = meshToFaces([floor]);

    // precomputed world bounds, so not needed at runtime
    // const worldBounds = computeSceneBounds(faces);
    faces.forEach(face => this.octree.insert(face));

    this.player.cameraRotation.set(0, Math.PI, 0);
    this.player.sfxPlayer.playNote(audioContext.currentTime, 60, 70, elevatorMotionRev1, audioContext.currentTime + 6);
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
