import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {cylinderSelector2} from "@/modeling/building-blocks";
import {Mesh} from "@/engine/renderer/mesh";
import {materials} from "@/textures";

// TODO: Finish landing area
export function rampToJump() {
  return new Mesh(new MoldableCubeGeometry(4,6,4,6,1,6).selectBy(cylinderSelector2).cylindrify(14).all_().translate_(5, 3, 40)
      .merge(new MoldableCubeGeometry(4,18,4,6,1,6).cylindrify(8).all_().translate_(7, 9))
      .merge(new MoldableCubeGeometry(12, 20, 12, 4, 1, 6)
        .selectBy(vert => vert.x <= -4)
        .cylindrify(6, 'y', { x: 1, y: 0, z: 0})
        .selectBy(vert => vert.x >= 4)
        .cylindrify(8, 'y', { x: -3, y: 0, z: 0})
        .selectBy(vert => vert.x > -2)
        .translate_(30, 5)
        .selectBy(vert => vert.x > 30)
        .translate_(30, 10)
        .rotate_(0, -0.4)
        .scale_(1.2, 1, 1.2)
        .selectBy(vert => vert.y < 10)
        .modifyEachVertex(vert => vert.y = -14)
        .all_()
        .translate_(18, 14, 0)
        .spreadTextureCoords()
        .done_())

      .merge(new MoldableCubeGeometry(4, 40, 4, 6, 1, 6).selectBy(cylinderSelector2).cylindrify(8).all_().translate_(80, 20, 70).done_())
      .merge(new MoldableCubeGeometry(4, 40, 4, 6, 1, 6).selectBy(cylinderSelector2).cylindrify(8).all_().translate_(40, 20, 60).done_())
      .computeNormals()

      .done_(),
    materials.white
  );
}