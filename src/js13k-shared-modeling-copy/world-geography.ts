import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import {materials} from "@/textures";

const geoTexPerSide = () => [materials.cartoonRockWall, materials.cartoonRockWall, materials.cartoonGrass, materials.cartoonRockWall, materials.cartoonRockWall, materials.cartoonRockWall];

export function tubeCliffAndCave() {
  return new Mesh(
    new MoldableCubeGeometry(130, 30, 90, 4, 3, 4)
      .texturePerSide(...geoTexPerSide())

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