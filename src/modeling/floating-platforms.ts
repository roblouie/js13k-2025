import {materials} from "@/textures";
import {Mesh} from "@/engine/renderer/mesh";
import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {cylinderSelector2} from "@/modeling/building-blocks";

export function floatingPlatforms() {
  const platformMaker = (rad: number) => new MoldableCubeGeometry(4, rad/2, 4, 6, 1, 6)
    .selectBy(cylinderSelector2).cylindrify(rad)
    .selectBy(vert => vert.y < 0).scale_(0, 1, 0).all_()

  return new Mesh(
    platformMaker(8)
      .merge(platformMaker(20).translate_(30, 8, 18))
      .merge(platformMaker(12).translate_(68, 19, 40))
      .merge(platformMaker(10).translate_(60, 32, 10))
      .merge(platformMaker(28).translate_(30, 40, -20))
      .all_()
      .translate_(0, 10).done_()
    , materials.white);
}