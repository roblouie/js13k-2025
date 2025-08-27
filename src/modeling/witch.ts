function witchHead(dipNRot = 0) {
  const witchLimb = (flip?: boolean) => {
    return new MoldableCubeGeometry(2.5, 1, 1, 1, 3, 3)
      .cylindrify(0.5, 'x')
      .selectBy(vert => flip ? vert.x < 0 :vert.x > 0)
      .scale_(1, 0.5, 0.5)
      .all_()
      .texturePerSide(materials.witchClothes)
    // .merge(
    //     new MoldableCubeGeometry(1, 1, 1, 1, 3, 3)
    //         .cylindrify(0.4, 'x')
    //         .selectBy(vert => vert.x < 0)
    //         .scale_(0.5, 0.5, 0.5)
    //         .all_()
    //         .translate_(-1.5)
    //         .texturePerSide(materials.witchFace)
    // )
  }

  return new MoldableCubeGeometry(bodyRadius, bodyRadius, bodyRadius, 8, 8, 8)
    .texturePerSide(materials.witchSkin, materials.witchSkin, materials.witchSkin, materials.witchSkin, materials.witchFace, materials.witchSkin)
    .spherify(bodyRadius)
    // Flatten eye area
    .selectBy(vert => vert.z > 1 && vert.y > 0)
    .translate_(0, 0.3, -0.2)

    // hat
    .merge(
      new MoldableCubeGeometry(3, 3, 3, 3, 3, 3)
        .cylindrify(2.5)
        .translate_(0, 1)
        .modifyEachVertex(vert => {
          const t = vert.y / 3; // normalize against height
          const inv = 1 - t;
          const scale = Math.pow(inv, 2.5);
          vert.x *= scale;
          vert.z *= scale;
          if (vert.y > 0) {
            vert.y -= 0.5;
          }
        })
        .translate_(0, 1.5)
        .texturePerSide(materials.witchClothes)
    )

    // hair
    .merge(
      new MoldableCubeGeometry(2, 4, 2, 2, 1, 2)
        .cylindrify(2)
        .selectBy(vert => vert.y < 0)
        .scale_(1.2, 1, 0.5)
        .translate_(0,0, -1.8)
        .all_()
        .translate_(0, -1, 0)
        .texturePerSide(materials.iron)
    )

    // body
    .merge(
      new MoldableCubeGeometry(3, 5, 3, 3, 3, 3)
        .cylindrify(2.2)
        .translate_(0, 1)
        .modifyEachVertex(vert => {
          const t = vert.y / 5; // normalize against height
          const inv = 1 - t;
          const scale = Math.pow(inv, 1.5);
          vert.x *= scale;
          vert.z *= scale;
          if (vert.y > 0) {
            vert.y -= 0.5;
          }
        })
        .translate_(0, -4.5)
        .texturePerSide(materials.witchClothes)
    )

    // arms & legs
    .merge(
      witchLimb()
        .rotate_(0, 0, -0.3)
        .translate_(-1.5, -2, 0)
    )
    .merge(witchLimb(true).rotate_(0, 0, 0.3).translate_(1.5, -2))

    .computeNormals()
}