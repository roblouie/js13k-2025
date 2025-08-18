import { Material } from '@/engine/renderer/material';
import { textureLoader } from '@/engine/renderer/texture-loader';
import {toHeightmap, toImage, toImageData} from '@/engine/svg-maker/svg-string-converters';

const skyboxSize = 1024;

export const materials: {[key: string]: Material} = {};
export const skyboxes: {[key: string]: TexImageSource[]} = {};

export async function initTextures() {
  materials.wood = new Material({ texture: textureLoader.load_(await wood())});
  materials.silver = new Material({ texture: textureLoader.load_(await metals('', 20)) });
  materials.iron = new Material({ texture: textureLoader.load_(await metals()) });
  materials.marble = new Material({ texture: textureLoader.load_(await marbleFloor())});
  materials.ceilingTiles = new Material({ texture: textureLoader.load_(await ceilingTiles())});
  materials.cartoonGrass = new Material({ texture: textureLoader.load_(await cartoonGrass())});
  materials.cobblestone = new Material({ texture: textureLoader.load_(await cobblestonePath())});
  materials.greenPlasterWall = new Material({ texture: textureLoader.load_(await wallpaper())});
  materials.white = new Material({ texture: textureLoader.load_(await color('#bbb'))});
  materials.red = new Material({ texture: textureLoader.load_(await color('#b00'))});

  // NOTE: Right now in the fragment shader the texture depth is checked to determine
  // shadows, so that these don't cast shadows. That is currently set to depth >= 10.0f.
  // If any materials before this are removed, this number will be wrong, so adjust as needed.
  // If any materials are added after this, anythign using them won't cast shadows
  materials.catEye = new Material({ texture: textureLoader.load_(await catEye())});
  materials.catMouth = new Material({ texture: textureLoader.load_(await catMouth())});

  const box = await drawSkyboxHor();
  const slicer = horizontalSkyboxSlice(box);
  const horSlices = [await slicer(), await slicer(), await slicer(), await slicer()];
  skyboxes.test = [
    horSlices[3],
    horSlices[1],
    await toImage(drawSkyboxTop()),
    horSlices[0], // Floor
    horSlices[2],
    horSlices[0],
  ];

  textureLoader.bindTextures();
}

function wallpaper(isPattern = false) {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><pattern id="b" width="128" height="128" patternUnits="userSpaceOnUse"><path fill="#687A5E" d="M0 0h128v128H0z"/>${isPattern ? '<text x="64" y="64" style="font-size:64px" stroke="#506546" fill="#506546">❀</text><text y="128" style="font-size:50px" stroke="#506546" fill="#506546">✦</text>' : ''}</pattern><filter id="a"><feTurbulence baseFrequency=".4" stitchTiles="stitch"/><feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="#687A5E"><feDistantLight azimuth="120" elevation="45"/></feDiffuseLighting><feBlend in="SourceGraphic" mode="difference"/></filter><rect width="100%" height="100%" filter="url(#a)" fill="url(#b)"/></svg>`);
}

function redCarpet() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><filter id="a"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2"/><feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="#090" result="d"><feDistantLight azimuth="90" elevation="55"/></feDiffuseLighting></filter><rect width="100%" height="100%" filter="url(#a)"/></svg>`)
}

function ceilingTiles() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><pattern id="b" width="512" height="256" patternUnits="userSpaceOnUse"><path d="M8 7h502v248H8z"/></pattern><filter id="a"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="8"/><feComposite in="SourceGraphic" operator="arithmetic" k2=".5" k3=".5"/><feComponentTransfer result="n"><feFuncA type="gamma" exponent="4"/></feComponentTransfer><feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="#fff" surfaceScale="-1" result="d"><feDistantLight azimuth="40" elevation="55"/></feDiffuseLighting></filter><rect width="100%" height="100%" filter="url(#a)" fill="url(#b)"/></svg>`)
}


function marbleFloor() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><pattern id="a" width="256" height="256" patternUnits="userSpaceOnUse"><circle r="290" fill="#fff"/><path d="M0 0h128v256h128V128H0z"/></pattern><filter id="b"><feTurbulence baseFrequency=".04" numOctaves="5"/><feColorMatrix values="1 -1 0 0 0 1 -1 0 0 0 1 -1 0 0 0 0 0 0 0 0.3"/><feBlend in="SourceGraphic" mode="soft-light"/></filter><rect width="100%" height="100%" fill="url(#a)" filter="url(#b)"/></svg>`)
}

function wood() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><filter id="a"><feTurbulence type="fractalNoise" baseFrequency="0.1, 0.007" numOctaves="6" stitchTiles="stitch"/><feComposite in="s" operator="arithmetic" k2=".5" k3=".6"/><feComponentTransfer><feFuncA type="table" tableValues="0, .1, .2, .3, .4, .2, .4"/></feComponentTransfer><feDiffuseLighting color-interpolation-filters="sRGB" surfaceScale="3" lighting-color="#6e3f2b"><feDistantLight azimuth="110" elevation="48"/></feDiffuseLighting></filter><rect height="100%" width="100%" filter="url(#a)"/></svg>`)
}

export function metals(content = '', brightnessModifier = 1) {
  const value = 0.01 * brightnessModifier;
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><filter id="b"><feTurbulence baseFrequency="0.01,0.0008" numOctaves="2" seed="23" type="fractalNoise" stitchTiles="stitch" /><feColorMatrix values="${value}, ${value}, ${value}, 0, 0,${value}, ${value}, ${value}, 0, 0,${value}, ${value}, ${value}, 0, 0,1, 1, 1, 1, 1"/></filter><rect x="0" y="0" width="100%" height="100%" filter="url(#b)"/>${ content }</svg>`);
}

export function heightMap() {
  return toHeightmap(`<svg           height="256"                       width="256"   xmlns="http://www.w3.org/2000/svg"><filter            id="noise"                        ><feTurbulence baseFrequency="0.02"                 numOctaves="1"        seed="5" stitchTiles="stitch"    type="fractalNoise"      /><feColorMatrix  color-interpolation-filters="sRGB"                              values="0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0"    /><feComponentTransfer color-interpolation-filters="sRGB"><feFuncR type="table" tableValues="0,1"/><feFuncG type="table" tableValues="0,1"/><feFuncB type="table" tableValues="0,1"/><feFuncA type="table" tableValues="1,1"/></feComponentTransfer></filter><rect      filter="url(#noise)"     height="100%"                       width="100%" x="0" y="0"/></svg>`, 10)
}

function color(color: string | number) {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%" fill="${color}"/></svg>`)
}

function drawSkyboxHor() {
  const element = drawBetterClouds(skyboxSize * 4) + `
    <filter height="150%" id="f" width="100%" x="0" >
        <feTurbulence baseFrequency="0.008,0" numOctaves="4" seed="15" stitchTiles="stitch" type="fractalNoise" />
        <feDisplacementMap in="SourceGraphic" scale="100"/>
    </filter>
    <g><rect filter="url(#f)" height="50%" width="8192" x="0" y="1000"/></g>`

  return toImage(`<svg width="${skyboxSize * 4}" height="${skyboxSize}"  xmlns="http://www.w3.org/2000/svg">${element}</svg>`)
}

function drawSkyboxTop() {
  return `<svg width="${skyboxSize}" height="${skyboxSize}" style="background: #000" xmlns="http://www.w3.org/2000/svg">${drawClouds()}</svg>`;
}

function horizontalSkyboxSlice(image: CanvasImageSource) {
  let xPos = 0;
  const context = new OffscreenCanvas(skyboxSize, skyboxSize).getContext('2d')!;

  return async (): Promise<ImageData> => {
    // @ts-ignore
    context.drawImage(image, xPos, 0);
    xPos -= skyboxSize;
    // @ts-ignore
    return context.getImageData(0, 0, skyboxSize, skyboxSize);
  };
}

function drawBetterClouds(width_: number) {
  return `<linearGradient id="gradient" gradientTransform="rotate(90)">
        <stop stop-color="#248"/>
        <stop offset="1" stop-color="#579"/>
    </linearGradient>
    <filter id="filter">
        <feTurbulence type="fractalNoise" baseFrequency=".001 .003" numOctaves="6"/>
        <feComponentTransfer>
            <feFuncA type="gamma" exponent="1.1"/>
        </feComponentTransfer>
        <feColorMatrix values="0 0 0 0 1
                               0 0 0 0 1
                               0 0 0 0 1
                               0 0 0 -1 .4"/>
        <feBlend in2="SourceGraphic"/>
    </filter>
    <rect width="100%" height="100%" fill="url(#gradient)" filter="url(#filter)"/>`
}

function drawClouds() {
  return `<filter height="100%" id="f" width="100%" x="0" y="0"> <feTurbulence baseFrequency="0.003" numOctaves="6" seed="2" stitchTiles="stitch" type="fractalNoise"/><feComponentTransfer color-interpolation-filters="sRGB"><feFuncR type="table" tableValues="0.8,0.8"/><feFuncG type="table" tableValues="0.8,0.8"/><feFuncB type="table" tableValues="1,1"/><feFuncA type="table" tableValues="0,0,1"/></feComponentTransfer></filter><mask id="mask"><radialGradient id="g"><stop offset="20%" stop-color="white"/><stop offset="30%" stop-color="#666"/><stop offset="100%" stop-color="black"/></radialGradient><ellipse cx="1000" cy="1000" fill="url(#g)" rx="50%" ry="50%" /></mask><radialGradient id="l"><stop offset="10%" stop-color="#fff"/><stop offset="30%" stop-color="#0000"/></radialGradient><rect filter="url(#s)" height="100%" width="100%" x="0" y="0"/><ellipse cx="1000" cy="1000" fill="url(#l)" rx="200" ry="200"/><rect filter="url(#f)" height="100%" mask="url(#mask)" width="100%" x="0" y="0"/>`;
}

function catMouth() {
  return toImage(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Nose -->
  <path d="M256 210
           Q236 220 226 240
           Q256 250 286 240
           Q276 220 256 210 Z"
        fill="pink" stroke="black" stroke-width="4" />

  <!-- Mouth - smiling -->
  <path d="M256 250
           Q256 270 240 280
           Q220 290 200 280
           Q180 270 170 260"
        fill="none" stroke="pink" stroke-width="4" />
        
  <path d="M256 250
           Q256 270 272 280
           Q292 290 312 280
           Q332 270 342 260"
        fill="none" stroke="pink" stroke-width="4" />

  <!-- Whiskers left -->
  <line x1="200" y1="250" x2="120" y2="240" stroke="white" stroke-width="4"/>
  <line x1="200" y1="260" x2="120" y2="260" stroke="white" stroke-width="4"/>
  <line x1="200" y1="270" x2="120" y2="280" stroke="white" stroke-width="4"/>

  <!-- Whiskers right -->
  <line x1="312" y1="250" x2="392" y2="240" stroke="white" stroke-width="4"/>
  <line x1="312" y1="260" x2="392" y2="260" stroke="white" stroke-width="4"/>
  <line x1="312" y1="270" x2="392" y2="280" stroke="white" stroke-width="4"/>
</svg>
`);
}

function catEye() {
  return toImage(`<svg width="512" height="512" viewBox="0 0 512 512" style="transform: scaleY(2)" xmlns="http://www.w3.org/2000/svg">
  <!-- Left eye -->
  <path d="M80 256 Q80 180 160 180 Q240 180 240 256 Q240 332 160 332 Q80 332 80 256 Z"
        fill="limegreen" stroke="black" stroke-width="8"/>
  <ellipse cx="160" cy="256" rx="25" ry="70" fill="black"/>
  
  <!-- Right eye -->
  <path d="M272 256 Q272 180 352 180 Q432 180 432 256 Q432 332 352 332 Q272 332 272 256 Z"
        fill="limegreen" stroke="black" stroke-width="8"/>
  <ellipse cx="352" cy="256" rx="25" ry="70" fill="black"/>
</svg>`);
}

export function cartoonGrass() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <filter id="filter">
        <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="8"/>
        
        <feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="#0a0" surfaceScale="-3" result="d">
            <feDistantLight azimuth="40" elevation="60"/>
        </feDiffuseLighting>
        

    </filter>
    <rect width="100%" height="100%" filter="url(#filter)" />
</svg>`)
}

function cobblestonePath() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <filter id="blurMe">
    <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
  </filter>
  <filter id="shadow">
      <feDropShadow dx="1" dy="1" stdDeviation="2" />
    </filter>
    <pattern id="pattern" width="86.6" height="50" patternUnits="userSpaceOnUse">
        <circle r="100" fill="#333"/>
<!--          <path d="M0 25a20 20 0 1 1 0 1M43.3 0a20 20 0 1 0 40 0m0 50a20 20 0 1 0 -40 0" fill="#825130"/> -->
              <circle cx="20" cy="25" r="23" fill="#6A6473" filter="url(#shadow)" />
              <circle cx="63" cy="0" r="23" fill="#696472" filter="url(#shadow)"/>
              <circle cx="63" cy="50" r="23" fill="#696472" filter="url(#shadow)" />
      
              <circle cx="20" cy="23" r="14" fill="#7f7d88" filter="url(#blurMe)"/>
              <circle cx="60" cy="-2" r="14" fill="#807d86" filter="url(#blurMe)"/>
              <circle cx="60" cy="48" r="14" fill="#807d86" filter="url(#blurMe)"/>
    </pattern>
    <filter id="filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.017" numOctaves="1" stitchTiles="stitch"/>
        <feDisplacementMap in="SourceGraphic" xChannelSelector="R" scale="40"/>
    </filter>
    <rect x="-10%" y="-10%" width="120%" height="120%" fill="url(#pattern)" filter="url(#filter)" />
</svg>`);
}

export function pathTest() {
  return toImageData(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" style="filter: blur(2px)">
<filter id="blurMe">
    <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
  </filter>
   
  <path
    d="M 10 80 Q 52.5 10, 95 80 T 180 80"
    stroke="white"
        stroke-width="10px"
    fill="transparent" />
</svg>`)
}