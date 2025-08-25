import { Mesh } from '@/engine/renderer/mesh';
import { MoldableCubeGeometry } from '@/engine/moldable-cube-geometry';
import { materials } from '@/textures';

export function bridge() {
  const makeBridgePiece = (depth: number) => {
    return new MoldableCubeGeometry(depth, 40, 50, 6, 1, 8)
      .selectBy(vert => vert.y < 0 && Math.abs(vert.z) < 14)
      .cylindrify(15, 'x', { x: 0, y: -40, z: 0})
      .selectBy(vert => vert.y > 19)
      .cylindrify(20, 'x')
      .selectBy(vert => vert.y > 0)
      .scale_(1, 1.3, 1.8);
  };

  return new Mesh(
    makeBridgePiece(20).spreadTextureCoords()
      .merge(makeBridgePiece(2).all_().translate_(9, 3).spreadTextureCoords())
      .merge(makeBridgePiece(2).all_().translate_(-9, 3).spreadTextureCoords())
      .all_()

      .translate_(-190, 20, 9)
      .done_()

    , materials.marble);
}

export function frontRamp() {
  return new Mesh(
    new MoldableCubeGeometry(10, 2, 60)
      .spreadTextureCoords()

      .selectBy(vert => vert.z > 0)
      .translate_(0, -30)
      .all_()
      .rotate_(0, 0.6)
      .translate_(-59, 29, 108)
      .done_()

    , materials.marble);
}