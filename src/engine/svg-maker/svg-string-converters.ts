export async function toImage(svgImageBuilder: string): Promise<HTMLImageElement> {
  const image_ = new Image();
  image_.src = URL.createObjectURL(new Blob([svgImageBuilder], { type: 'image/svg+xml' }));
  return new Promise(resolve => image_.addEventListener('load', () => resolve(image_)));
}

export async function toImageData(svgString: string): Promise<ImageData> {
  const image_ = await toImage(svgString);
  const canvas = new OffscreenCanvas(image_.width, image_.height);
  const context = canvas.getContext('2d')!;
  // @ts-ignore
  context.drawImage(image_, 0, 0);
  // @ts-ignore
  return context.getImageData(0, 0, image_.width, image_.height);
}

export async function toHeightmap(svgString: string, scale_: number): Promise<number[]> {
  const imageData = await toImageData(svgString);
  const map = [];
  for (let i = 0; i < imageData.data.length; i+= 4) {
    map.push((imageData.data[i] / 255 - 0.5) * scale_);
    //map.push(0)
  }
  return map;
}
