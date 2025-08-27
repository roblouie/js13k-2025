import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import {materials} from "@/textures";
import {makeBridgePiece} from "@/modeling/bridges";

const geoTexPerSide = () => [materials.cartoonRockWall, materials.cartoonRockWall, materials.cartoonGrass, materials.cartoonRockWall, materials.cartoonRockWall, materials.cartoonRockWall];

export function tubeCliffAndCave() {
  return new Mesh(
    new MoldableCubeGeometry(130, 30, 90, 4, 3, 2)
      .texturePerSide(...geoTexPerSide())

      .selectBy(vert => vert.x > 60)
      .translate_(0, 0, -5)

      .selectBy(vert => vert.x > 60 && vert.z < -30)
      .translate_(40, 0, 35)

      .selectBy(vert => vert.x < 30)
      .translate_(0, 0, 10)

      .selectBy(vert => vert.y > 10)
      .scale_(1.2, 1, 1.2)

      .all_()

      // world positioning
      .translate_(150, 15, -100).done_()

    , materials.cartoonRockWall);
}

export function mountainAreaLeftCliff() {
  return new Mesh(
    new MoldableCubeGeometry(240, 40, 240, 4, 2, 4)
      .texturePerSide(...geoTexPerSide())

      // Make a bit of a hill so the surface isn't just flat
      .selectBy(vert => vert.y > 15 && Math.abs(vert.x) < 120 && Math.abs(vert.z) < 120)
      .translate_(0, 7)

      // extend back side to connect to raised path
      .selectBy(vert => vert.x > 0 && vert.z < 40)
      .translate_(25, 0)

      .selectBy(vert => vert.x > 0 && vert.z < 0)
      .translate_(90)


      // create overhang
      .selectBy(vert => vert.y > 15 && vert.x > 0)
      .scale_(1.1, 1, 1.1)

      // World positioning
      .all_()
      .spreadTextureCoords(20, 20)
      .translate_(-135, 20, -135)
      .done_()
  , materials.cartoonRockWall);
}

export function frontLeftCliffForBridge() {
  return new Mesh(
    new MoldableCubeGeometry(180, 30, 60, 4, 2, 2)
      .texturePerSide(...geoTexPerSide())

      .selectBy(vert => vert.x < -30 && vert.z > 20)
      .translate_(0, 0, 20)

      .selectBy(vert => vert.z < 0 && vert.x < 20 && vert.x > -60 && vert.y > 0)
      .translate_(0, 10)

      .selectBy(vert => vert.x < -60)
      .translate_(0, 0, 30)

      .selectBy(vert => vert.x > 30 && vert.x < 50 && vert.z > 20)
      .translate_(0, 0, 10)

      .selectBy(vert => vert.x > 50)
      .scale_(1, 1, 0.3)

      .selectBy(vert => vert.y > 10 && vert.x > -90)
      .scale_(1.2, 1, 1.2)

      .spreadTextureCoords(20, 20)

      // World positioning
      .all_()
      .translate_(-170, 15, 65)
      .done_()
    , materials.cartoonRockWall);
}

export function worldWall() {
  return new Mesh(
    new MoldableCubeGeometry(512, 24, 2).texturePerSide(materials.cartoonGrass).translate_(0, 12, 256)      .spreadTextureCoords()

      .merge(new MoldableCubeGeometry(2, 24, 512).texturePerSide(materials.cartoonGrass).translate_(256, 12)      .spreadTextureCoords())

      .merge(new MoldableCubeGeometry(2, 24, 512, 1, 1, 4)
        .selectBy(vert => vert.z < 256 && vert.y > 0)
        .translate_(0, 20)
        .selectBy(vert => vert.z < 128 && vert.y > 0)
        .translate_(0, 20)
        .all_()
        .texturePerSide(materials.cartoonGrass).translate_(-256, 12)
        .spreadTextureCoords()
      )

      .merge(
        new MoldableCubeGeometry(512, 24, 2, 4)
          .texturePerSide(materials.cartoonRockWall)
          .selectBy(vert => vert.y > 0 && vert.x < 256)
          .translate_(0, 40)
          .all_()
          .translate_(0, 12, -256)
          .spreadTextureCoords(20, 20)
      )

      .done_()

    , materials.cartoonGrass);
}

export function nightCave() {
  return new Mesh(
    makeBridgePiece(60, 1, 1.3)
      .selectBy(vert => vert.z > 10 && vert.y < 0)
      .translate_(0, -13)
      // .selectBy(vert => vert.x > 5 && vert.y > -20)
      // .scale_(1, 0.8, 0.5)

      // .selectBy(vert => vert.x > 6 && vert.y > 0 && vert.y < 25)
      // .scale_(1, 0.8, 0.8)


      // Roof with opening
      .merge(
        makeBridgePiece(2, 1, 1.3)
          .selectBy(vert => vert.y < 0 && Math.abs(vert.z) < 20)
          .scale_(1, 1, 0.2)
          .selectBy(vert => vert.y > 5 && vert.y < 16 && Math.abs(vert.z) < 17)
          .translate_(0, -14)
          .selectBy(vert => vert.y < 0)
          .translate_(0, -14)
          .spreadTextureCoords(20, 20)
          .all_().translate_(31).done_()
      )




    //roate and scale bridge into place
      .all_()
      .rotate_(0, 0, Math.PI / 2)
      .scale_(3, 1, 3)

      // backing wall
      .merge(new MoldableCubeGeometry(2, 100, 150, 1, 1, 10)
        .selectBy(vert => vert.y > 0)
        .cylindrify(90, 'x')
        .translate_(0, -40)
        .all_()
        .translate_(100, 25)
      )

      // rooftop cave opening
      .merge(makeBridgePiece(120, 1, 1.).scale_(1, 1, 1.3).all_().scale_(1, 1.3, 2).translate_(40, 50))

      // wall behind pipe

      // world positioniong
      .translate_(155, 25, 15)
      .computeNormals()
      .done_()
    , materials.cartoonRockWall);
}