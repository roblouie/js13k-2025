import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';

export const makeBridgePiece = (depth: number, scaleY: number, scaleZ: number) => {
  return new MoldableCubeGeometry(depth, 40, 50, 1, 1, 8)
    .selectBy(vert => vert.y < 0 && Math.abs(vert.z) < 14)
    .cylindrify(15, 'x', { x: 0, y: -40, z: 0})
    .selectBy(vert => vert.y > 19)
    .cylindrify(20, 'x')
    .selectBy(vert => vert.y > 0)
    .scale_(1, scaleY, scaleZ);
};

export function bridge() {
  return new Mesh(
    makeBridgePiece(20, 1.3, 2).texturePerSide(materials.cobblestone).spreadTextureCoords(20, 20)
      .merge(makeBridgePiece(2, 1.3, 2).texturePerSide(materials.cobblestone).all_().translate_(9, 3).spreadTextureCoords(20, 20))
      .merge(makeBridgePiece(2, 1.3, 2).texturePerSide(materials.cobblestone).all_().translate_(-9, 3).spreadTextureCoords(20, 20))

      .merge(new MoldableCubeGeometry(1, 38, 35).texturePerSide(materials.bars).spreadTextureCoords(3))

      // platform behind bridge
      .merge(
        new MoldableCubeGeometry(4, 26, 4, 4, 1, 4)
          .texturePerSide(materials.cartoonGrass)
          .cylindrify(10)
          .merge(new MoldableCubeGeometry(4, 16, 4, 4, 1, 4).texturePerSide(materials.cartoonGrass).cylindrify(10).translate_(0, -3, -20))
          .all_()
          .translate_(-54, -11, 25)
          .done_()
      )

      .all_()

      .translate_(-190, 20, 9)
      .done_()

    , materials.cobblestone);
}

export function frontRamp() {
  return new Mesh(
    new MoldableCubeGeometry(10, 2, 60)
      .spreadTextureCoords(20, 20)

      .selectBy(vert => vert.z > 0)
      .translate_(0, -30)
      .all_()
      .rotate_(0, 0.6)
      .translate_(-59, 29, 108)
      .done_()

    , materials.cobblestone);
}