import {MoldableCubeGeometry} from "@/engine/moldable-cube-geometry";
import {Mesh} from "@/engine/renderer/mesh";
import {materials} from "@/textures";
import {cylinderSelector2} from "@/modeling/building-blocks";
import {rampSection} from "@/modeling/hedge-maze-and-tube";
import {platformMaker} from "@/modeling/floating-platforms";

export function mountain() {
  return new Mesh(

    // Bottom Section
    new MoldableCubeGeometry(200, 80, 200, 6, 1, 6)
      .spreadTextureCoords(60, 30)

      // Mountain main bottom portion
      .selectBy(cylinderSelector2(100))
      .cylindrify(100)
      .invertSelection()
      .spherify(70, { x: 0, y: -100, z: 0})
      .scale_(1.5, 0.8, 1.5)
      .selectBy(vert => vert.y > 0)
      .rotate_(0, 0, -0.1)
      .scale_(0.8, 1, 0.8)
      .all_()
      .translate_(0, 40)

      // Ramp and platform for bottom portion
      .merge(rampSection(0, 1.5, 80, 120).spreadTextureCoords(30, 30))
      .merge(platformMaker(20).translate_(-10, 60, 80).spreadTextureCoords(30, 30))

      // Top Section
      .merge(new MoldableCubeGeometry(100, 90, 100, 6, 1, 6)
        .selectBy(cylinderSelector2(50))
        .cylindrify(50)
        .invertSelection()
        .spherify(50, { x: 0, y: -170, z: 0})
        .scale_(1.5, 1, 1.5)
        .selectBy(vert => vert.y > 0)
        .rotate_(0, 0, -0.1)
        .scale_(0.8, 1, 0.8)
        .spreadTextureCoords(30, 30)
        .all_()

      // Ramp and platform for top portion
      .merge(rampSection(0, 1, 40, 60).spreadTextureCoords(30, 30).rotate_(0, 5).translate_(0, -20))
        .merge(platformMaker(15).translate_(-35, 23, 12).spreadTextureCoords(30, 30))
        .merge(platformMaker(15).translate_(-30, 35, -20).spreadTextureCoords(30, 30))
        .translate_(-16, 100))

      // side blocking ramp
      .merge(new MoldableCubeGeometry(40, 60, 30)
        .selectBy(vert => vert.y < 0 && vert.z < 0)
        .translate_(0, 0, -50)
        .all_()
        .rotate_(0, 0.1)
        .translate_(104, 30, 0)

      )

    .all_()
    // World Location
      .rotate_(0, 3)
    .translate_(-130, 40, -130)
    // End world location

    .computeNormals()
    .done_(), materials.cartoonRockWall)
}