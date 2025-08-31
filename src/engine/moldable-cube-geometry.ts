import { AttributeLocation } from '@/engine/renderer/renderer';
import { EnhancedDOMPoint, VectorLike } from '@/engine/enhanced-dom-point';
import { radsToDegrees, unormalizedNormal } from "@/engine/helpers";
import { gl } from '@/engine/renderer/lil-gl';
import { Material } from '@/engine/renderer/material';

type BufferInfo = { data: Float32Array; size: number };

export function getTextureForSide(uDivisions: number, vDivisions: number, material: Material) {
  // @ts-ignore
  return new Array((uDivisions + 1) * (vDivisions + 1)).fill().map(_ => material.texture.id);
}


export class MoldableCubeGeometry {
  vertices: EnhancedDOMPoint[] = [];
  verticesToActOn: EnhancedDOMPoint[] = [];

  buffers: Map<AttributeLocation, BufferInfo> = new Map<AttributeLocation, BufferInfo>();
  private indices: Uint16Array;
  vao: WebGLVertexArrayObject;
  widthSegments: number;
  heightSegments: number;
  depthSegments: number;

  texturePerSide(leftOrAll: Material, right?: Material, top?: Material, bottom?: Material, back?: Material, front?: Material) {
    const allSides = [
      ...getTextureForSide(this.widthSegments, this.depthSegments, top ?? leftOrAll),
      ...getTextureForSide(this.widthSegments, this.depthSegments, bottom ?? leftOrAll),
      ...getTextureForSide(this.depthSegments, this.heightSegments, leftOrAll),
      ...getTextureForSide(this.depthSegments, this.heightSegments, right ?? leftOrAll),
      ...getTextureForSide(this.widthSegments, this.heightSegments, back ?? leftOrAll),
      ...getTextureForSide(this.widthSegments, this.heightSegments, front ?? leftOrAll),
    ];

    this.setAttribute_(AttributeLocation.TextureDepth, new Float32Array(allSides), 1);
    return this;
  }

  constructor(width_ = 1, height_ = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1, sidesToDraw = 6) {
    this.widthSegments = widthSegments;
    this.depthSegments = depthSegments;
    this.heightSegments = heightSegments;

    this.vao = gl.createVertexArray()!;
    const indices: number[] = [];
    const uvs: number[] = [];
    let vertexCount = 0;

    const buildPlane = (
      u: keyof EnhancedDOMPoint,
      v: keyof EnhancedDOMPoint,
      w: keyof EnhancedDOMPoint,
      uDir: number,
      vDir: number,
      width: number,
      height: number,
      depth: number,
      gridX: number,
      gridY: number
    ) => {
      const segmentWidth = width / gridX;
      const segmentHeight = height / gridY;

      const widthHalf = width / 2;
      const heightHalf = height / 2;
      const depthHalf = depth / 2;

      const gridX1 = gridX + 1;
      const gridY1 = gridY + 1;

      for (let iy = 0; iy < gridY1; iy++) {
        const y = iy * segmentHeight - heightHalf;

        for (let ix = 0; ix < gridX1; ix++) {
          const x = ix * segmentWidth - widthHalf;

          const vector = new EnhancedDOMPoint();
          vector[u] = x * uDir;
          vector[v] = y * vDir;
          vector[w] = depthHalf;

          this.vertices.push(vector);
          uvs.push(ix / gridX, iy / gridY);
        }
      }

      for (let iy = 0; iy < gridY; iy++) {
        for (let ix = 0; ix < gridX; ix++) {
          const a = vertexCount + ix + gridX1 * iy;
          const b = vertexCount + ix + gridX1 * (iy + 1);
          const c = vertexCount + (ix + 1) + gridX1 * (iy + 1);
          const d = vertexCount + (ix + 1) + gridX1 * iy;

          indices.push(a, b, d, b, c, d);
        }
      }

      vertexCount += gridX1 * gridY1;
    };

    const sides = [
      ['x', 'z', 'y', 1, 1, width_, depth, height_, widthSegments, depthSegments], // top
      ['x', 'z', 'y', 1, -1, width_, depth, -height_, widthSegments, depthSegments], // bottom
      ['z', 'y', 'x', -1, -1, depth, height_, width_, depthSegments, heightSegments], // left
      ['z', 'y', 'x', 1, -1, depth, height_, -width_, depthSegments, heightSegments], // right
      ['x', 'y', 'z', 1, -1, width_, height_, depth, widthSegments, heightSegments], // front
      ['x', 'y', 'z', -1, -1, width_, height_, -depth, widthSegments, heightSegments], // back
    ];

    for (let i = 0; i < sidesToDraw; i++) {
      // @ts-ignore
      buildPlane(...sides[i]);
    }

    this.setAttribute_(AttributeLocation.TextureCoords, new Float32Array(uvs), 2);
    this.indices = new Uint16Array(indices);
    this
      .computeNormals()
      .done_()
      .all_();
  }

  all_() {
    this.verticesToActOn = this.vertices;
    return this;
  }

  invertSelection() {
    this.verticesToActOn = this.vertices.filter(vertex => !this.verticesToActOn.includes(vertex));
    return this;
  }

  selectBy(callback: (vertex: EnhancedDOMPoint, index: number, array: EnhancedDOMPoint[]) => boolean) {
    this.verticesToActOn = this.vertices.filter(callback);
    return this;
  }

  refineSelect(callback: (vertex: EnhancedDOMPoint, index: number, array: EnhancedDOMPoint[]) => boolean) {
    this.verticesToActOn = this.verticesToActOn.filter(callback);
    return this;
  }

  translate_(x = 0, y = 0, z = 0) {
    this.verticesToActOn.forEach(vertex => vertex.add_({x, y, z}));
    return this;
  }

  scale_(x = 1, y = 1, z = 1) {
    const scaleMatrix = new DOMMatrix().scaleSelf(x, y, z);
    this.verticesToActOn.forEach(vertex => vertex.set(scaleMatrix.transformPoint(vertex)));
    return this;
  }

  rotate_(x = 0, y = 0, z = 0) {
    const rotationMatrix = new DOMMatrix().rotateSelf(radsToDegrees(x), radsToDegrees(y), radsToDegrees(z));
    this.verticesToActOn.forEach(vertex => vertex.set(rotationMatrix.transformPoint(vertex)));
    return this;
  }

  modifyEachVertex(callback: (vertex: EnhancedDOMPoint, index: number, array: EnhancedDOMPoint[]) => void) {
    this.verticesToActOn.forEach(callback);
    return this;
  }

  spherify(radius: number, circleCenter: VectorLike = {x: 0, y: 0, z: 0}) {
    this.modifyEachVertex(vertex => {
      vertex.subtract(circleCenter).normalize_().scale_(radius);
    });
    return this;
  }

  merge(otherMoldable: MoldableCubeGeometry) {
    const updatedOtherIndices = otherMoldable.getIndices()!.map(index => index + this.vertices.length);
    this.indices = new Uint16Array([...this.indices, ...updatedOtherIndices]);

    this.vertices.push(...otherMoldable.vertices);

    const thisTextureCoords = this.getAttribute_(AttributeLocation.TextureCoords).data;
    const otherTextureCoords = otherMoldable.getAttribute_(AttributeLocation.TextureCoords).data;
    const combinedCoords = new Float32Array([...thisTextureCoords, ...otherTextureCoords]);
    this.setAttribute_(AttributeLocation.TextureCoords, combinedCoords, 2);

    const thisNormals = this.getAttribute_(AttributeLocation.Normals).data;
    const otherNormals = otherMoldable.getAttribute_(AttributeLocation.Normals).data;
    const combinedNormals = new Float32Array([...thisNormals, ...otherNormals]);
    this.setAttribute_(AttributeLocation.Normals, combinedNormals, 3);

    if (this.getAttribute_(AttributeLocation.TextureDepth)) {
      const thisTextureDepth = this.getAttribute_(AttributeLocation.TextureDepth).data;
      const otherTextureDepth = otherMoldable.getAttribute_(AttributeLocation.TextureDepth).data;
      const combinedTextureDepth = new Float32Array([...thisTextureDepth, ...otherTextureDepth]);
      this.setAttribute_(AttributeLocation.TextureDepth, combinedTextureDepth, 1);
    }
    return this;
  }

  cylindrify(radius: number, aroundAxis: 'x' | 'y' | 'z' = 'y', circleCenter: VectorLike = {x: 0, y: 0, z: 0}) {
    this.modifyEachVertex(vertex => {
      const originalAxis = vertex[aroundAxis];
      vertex[aroundAxis] = 0;
      vertex.subtract(circleCenter).normalize_().scale_(radius);
      vertex[aroundAxis] = originalAxis;
    });
    return this;
  }

  cylindrify2(radius: number) {
    // Find bounds along X for angle mapping
    let minX = Infinity, maxX = -Infinity;
    this.verticesToActOn.forEach(v => {
      if (v.x < minX) minX = v.x;
      if (v.x > maxX) maxX = v.x;
    });

    // Cylindrical transform
    this.modifyEachVertex(vertex => {
      const angle = (vertex.x - minX) / (maxX - minX) * 2 * Math.PI;

      vertex.x = radius * Math.cos(angle);
      vertex.z = radius * Math.sin(angle);
    });

    return this;
  }

  spreadTextureCoords(scaleX = 12, scaleY = 12, shiftX = 0, shiftY = 0) {
    const texCoordSideCount = (u: number, v: number) => (2 + (u - 1)) * (2 + (v - 1)) * 2;
    const xzCount = texCoordSideCount(this.widthSegments, this.depthSegments);
    const zyCount = xzCount + texCoordSideCount(this.depthSegments, this.heightSegments);

    const textureCoords = this.getAttribute_(AttributeLocation.TextureCoords).data;
    let u,v;
    this.vertices.forEach((vert, index) => {
      if (index < xzCount) {
        u = vert.x; v = vert.z;
      } else if (index < zyCount) {
        u = vert.z; v = vert.y;
      } else {
        u = vert.x; v = vert.y;
      }
      const pointInTextureGrid = [u / scaleX + shiftX, v / scaleY + shiftY];
      textureCoords.set(pointInTextureGrid, index * 2);
    });
    this.setAttribute_(AttributeLocation.TextureCoords, textureCoords, 2);

    return this;
  }


  /**
   * Computes normals. By default it uses faces on a single plane. Use this on moldable planes or for moldable cube
   * shapes where each side should have it's own normals, like a cube, ramp, pyramid, etc.
   *
   * You can optionally pass the shouldCrossPlanes boolean to tell it to use faces from other sides of the cube to
   * compute the normals. Use this for shapes that should appear continuous, like spheres.
   */
  computeNormals(shouldCrossPlanes = false) {
    const vertexNormals = this.vertices.map(_ => new EnhancedDOMPoint());
    const indices = shouldCrossPlanes ? this.getIndicesWithUniquePositions() : this.indices;
    for (let i = 0; i < indices.length; i+= 3) {
      const faceNormal = unormalizedNormal([this.vertices[indices[i]], this.vertices[indices[i + 1]], this.vertices[indices[i + 2]]]);
      vertexNormals[indices[i]].add_(faceNormal);
      vertexNormals[indices[i + 1]].add_(faceNormal);
      vertexNormals[indices[i + 2]].add_(faceNormal);
    }

    this.setAttribute_(AttributeLocation.Normals, new Float32Array( vertexNormals.flatMap(vector => vector.normalize_().toArray())), 3);
    return this;
  }

  getIndicesWithUniquePositions() {
    const checkedPositions: EnhancedDOMPoint[] = [];
    const indexCopy = this.indices.slice();

    this.verticesToActOn.forEach(selectedVertex => {
      if (checkedPositions.find(compareVertex => selectedVertex.isEqualTo(compareVertex))) {
        return;
      }

      checkedPositions.push(selectedVertex);

      const originalIndex = this.vertices.findIndex(compareVertex => selectedVertex.isEqualTo(compareVertex));

      this.vertices.forEach((compareVertex, vertexIndex) => {
        if (selectedVertex.isEqualTo(compareVertex)) {
          const indicesIndex = indexCopy.indexOf(vertexIndex);
          indexCopy[indicesIndex] = originalIndex;
        }
      })
    });

    return indexCopy;
  }

  done_() {
    this.setAttribute_(AttributeLocation.Positions, new Float32Array(this.vertices.flatMap(point => point.toArray())), 3);
    return this;
  }

  getAttribute_(attributeLocation: AttributeLocation) {
    return this.buffers.get(attributeLocation)!;
  }

  setAttribute_(attributeLocation: AttributeLocation, data: Float32Array, size: number) {
    this.buffers.set(attributeLocation, { data, size });
    return this;
  }

  getIndices(): Uint16Array {
    return this.indices;
  }

  addFrame(frameNum: number, vertices: EnhancedDOMPoint[]) {
    this.setAttribute_(AttributeLocation.Positions + frameNum, new Float32Array(vertices.flatMap(point => point.toArray())), 3);
    return this;
  }

  bindGeometry() {
    const fullSize = [...this.buffers.values()].reduce((total, current) => total += current.data.length , 0);
    const fullBuffer = new Float32Array(fullSize);

    gl.bindBuffer(0x8892, gl.createBuffer()!);

    gl.bindVertexArray(this.vao);

    let byteOffset = 0;
    let lengthOffset = 0;
    new Map([...this.buffers.entries()].sort()).forEach((buffer, position) => {
      gl.vertexAttribPointer(position, buffer.size, gl.FLOAT, false, 0, byteOffset);
      gl.enableVertexAttribArray(position);
      fullBuffer.set(buffer.data, lengthOffset);

      byteOffset += buffer.data.length * buffer.data.BYTES_PER_ELEMENT;
      lengthOffset+= buffer.data.length;
    });

    gl.bufferData(0x8892, fullBuffer, gl.STATIC_DRAW);


    gl.bindBuffer(0x8893, gl.createBuffer()!);
    gl.bufferData(0x8893, this.indices, gl.STATIC_DRAW);
  }
}
