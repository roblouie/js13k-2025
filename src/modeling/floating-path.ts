import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {materials} from "@/textures";
import {Mesh} from "@/engine/renderer/mesh";
import {cylinderSelector2} from "@/modeling/building-blocks";

export function floatingPath() {
  return new Mesh(
    new MoldableCubeGeometry(4, 1, 20)
      .merge(new MoldableCubeGeometry(20, 1, 4).translate_(-8, 0, 12))
      .merge(new MoldableCubeGeometry(4, 1, 38).translate_(-20, 0, 29))
      .merge(new MoldableCubeGeometry(18, 1, 4).translate_(-13, 0, 50))
      .merge(new MoldableCubeGeometry(4, 1, 20).translate_(-6, 0, 62))
      .merge(new MoldableCubeGeometry(4, 1, 4, 3, 1, 3).selectBy(cylinderSelector2).cylindrify(8).all_().translate_(-6, 0, 79.5))
      .translate_(0, 10).done_()
    , materials.cartoonGrass);
}