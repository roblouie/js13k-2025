import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Mesh} from "@/engine/renderer/mesh";
import {materials} from "@/textures";

function tubify(innerRadius: number, outerRadius: number) {
  return new MoldableCubeGeometry(4, 20, 40, 1, 1, 6).translate_(-20)
    .merge(new MoldableCubeGeometry(38, 20, 6.4, 6).translate_(1, 0, 16.8))
    .merge(new MoldableCubeGeometry(38, 20, 6.4, 6).translate_(1, 0, -16.8))
    .selectBy(vertex => Math.abs(vertex.x) <= 19 && Math.abs(vertex.z) <= 19)
    .cylindrify(innerRadius)
    .invertSelection()
    .cylindrify(outerRadius)
    .all_()
    .done_();
}

export function hedgeMazeAndTube() {
  return new Mesh(tubify(20, 25)
    .merge(tubify(50, 55).rotate_(0, Math.PI / 2))
    .merge(new MoldableCubeGeometry(6, 20, 26).rotate_(0, Math.PI / -4).translate_(27, 0, -26))
    .translate_(0, 10)
    .computeNormals()
    .done_(), materials.cartoonGrass);
}

export function tunnel() {
  return new Mesh(tubify(25, 35).scale_(1, 10).rotate_(Math.PI / 2, 0, Math.PI / -2).translate_(0, 20).computeNormals().done_(), materials.cartoonGrass);
}