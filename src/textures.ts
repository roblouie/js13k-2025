import { Material } from '@/engine/renderer/material';
import { textureLoader } from '@/engine/renderer/texture-loader';
import {toHeightmap, toImage, toImageData} from '@/engine/svg-maker/svg-string-converters';
import {audioContext} from "@/engine/audio/simplest-midi";

const skyboxSize = 1024;

export const materials: {[key: string]: Material} = {};
export const skyboxes: {[key: string]: TexImageSource[]} = {};
export const heightmap = { data: [] };

// ultra hack firefox detection. If there's room, do this in a less insane way, like checking user agent for firefox
const filterTag = (id: string) => `<filter id="${id}" ${audioContext.listener.positionX ? 'width="100%" height="100%" x="0" y="0"' : ''} >`

export async function initTextures() {
  materials.bars = new Material({ texture: textureLoader.load_(await bars())});
  materials.iron = new Material({ texture: textureLoader.load_(await metals()) });
  materials.marble = new Material({ texture: textureLoader.load_(await marbleFloor())});
  materials.cartoonRockWall = new Material({ texture: textureLoader.load_(await cartoonRockWall())});
  materials.cartoonGrass = new Material({ texture: textureLoader.load_(await flora('#008115', .005))});
  materials.shrubs = new Material({ texture: textureLoader.load_(await flora('#0d4b22', .1))});

  materials.cobblestone = new Material({ texture: textureLoader.load_(await solidColor('#bbb'))});
  materials.white = new Material({ texture: textureLoader.load_(await solidColor('#bbb'))});
  materials.witchFace = new Material({ texture: textureLoader.load_(await witchFace())});
  materials.witchSkin = new Material({ texture: textureLoader.load_(await solidColor('#63C328'))});

  // NOTE: Right now in the fragment shader the texture depth is checked to determine
  // shadows, so that these don't cast shadows. That is currently set to depth >= 10.0f.
  // If any materials before this are removed, this number will be wrong, so adjust as needed.
  // If any materials are added after this, anythign using them won't cast shadows
  materials.catEye = new Material({ texture: textureLoader.load_(await catEye())});
  materials.catMouth = new Material({ texture: textureLoader.load_(await catMouth())});
  materials.witchClothes = new Material({ texture: textureLoader.load_(await solidColor('#902EBB'))});
  materials.sparkle = new Material({ texture: textureLoader.load_(await emojiParticle('✨', 'filter: hue-rotate(160deg)'))});
  materials.heart = new Material({ texture: textureLoader.load_(await emojiParticle('❤️'))});
  materials.bubbles = new Material({ texture: textureLoader.load_(await emojiParticle('🫧'))});

  heightmap.data = await heightMap();


  const box = await drawSkyboxHor();
  const slicer = horizontalSkyboxSlice(box);
  const horSlices = [await slicer(), await slicer(), await slicer(), await slicer()];
  skyboxes.test = [
    horSlices[3],
    horSlices[1],
    await solidColor('#248', skyboxSize),
    await solidColor('#094009', skyboxSize),
    horSlices[2],
    horSlices[0],
  ];

  textureLoader.bindTextures();
}

function emojiParticle(emoji: string, style = '') {
  return toImage(`<text x="50%" y="50%" font-size="400" text-anchor="middle" dominant-baseline="middle" style="${style}">${emoji}</text>`)
}

function bars() {
  return toImage(`<rect width="50%" height="100%" x="25%" fill="#fff"/>`);
}

export function cartoonRockWall() {
  return toImage(`${filterTag('m')}
        <feTurbulence type="fractalNoise" baseFrequency=".005" numOctaves="7" stitchTiles="stitch"/>
        <feDiffuseLighting diffuseConstant="6" surfaceScale="4" lighting-color="#7B3F00" color-interpolation="sRGB">
            <feDistantLight elevation="4" azimuth="170"/>
        </feDiffuseLighting>
    </filter>
    <rect width="100%" height="100%" filter="url(#m)"/>`)
}


function marbleFloor() {
  return toImage(`<pattern id="a" width="256" height="256" patternUnits="userSpaceOnUse"><circle r="290" fill="#fff"/><path d="M0 0h128v256h128V128H0z"/></pattern><filter id="b"><feTurbulence baseFrequency=".04" numOctaves="5"/><feColorMatrix values="1 -1 0 0 0 1 -1 0 0 0 1 -1 0 0 0 0 0 0 0 0.3"/><feBlend in="SourceGraphic" mode="soft-light"/></filter><rect width="100%" height="100%" fill="url(#a)" filter="url(#b)"/>`)
}

function wood() {
  return toImage(`<filter id="a"><feTurbulence type="fractalNoise" baseFrequency="0.1, 0.007" numOctaves="6" stitchTiles="stitch"/><feComposite in="s" operator="arithmetic" k2=".5" k3=".6"/><feComponentTransfer><feFuncA type="table" tableValues="0, .1, .2, .3, .4, .2, .4"/></feComponentTransfer><feDiffuseLighting color-interpolation-filters="sRGB" surfaceScale="3" lighting-color="#6e3f2b"><feDistantLight azimuth="110" elevation="48"/></feDiffuseLighting></filter><rect height="100%" width="100%" filter="url(#a)"/>`)
}

export function metals() {
  return toImage(`<filter id="b">
<feTurbulence baseFrequency="0.01,0.0008" numOctaves="2" seed="23" type="fractalNoise" stitchTiles="stitch" />
<feColorMatrix values="0.01 0.01 0.01 0 0 0.01 0.01 0.01 0 0 0.01 0.01 0.01 0 0 1 1 1 1 1"/>
</filter>
<rect x="0" y="0" width="100%" height="100%" filter="url(#b)"/>`);
}

export function heightMap() {
  return toHeightmap(`<filter id="b">
    <feTurbulence baseFrequency="0.12,0.2" numOctaves="1" seed="7" type="fractalNoise" stitchTiles="stitch" />
    <feColorMatrix values="0,0,0,.5,0,
                           0,0,0,.5,0,
                           0,0,0,.5,0,
                           1,1,1,0,0"/>
    </filter>
        <rect x="0" y="0" width="100%" height="100%" fill="#808080"/>
       <rect x="13" y="21" width="16" height="9" filter="url(#b)"/>

<!--    <rect x="23" y="10" width="12" height="10" fill="#808080"/>-->
<!--        <rect x="0" y="9" width="12" height="10" fill="#888"/>-->

`, 32, 45)
}

function solidColor(color: string | number, size = 512) {
  return toImage(`<rect x="0" y="0" width="100%" height="100%" fill="${color}"/>`, size);
}

function drawSkyboxHor() {
  const element = `
<filter id="filter" width="100%" height="100%" x="0">
        <feTurbulence type="fractalNoise" baseFrequency=".002 .01" numOctaves="5" stitchTiles="stitch" seed="25"/>
        <feColorMatrix values="0 0 0 0 1
                               0 0 0 0 1
                               0 0 0 0 1
                               0 0 0 -0.45 0.2"/>
        <feBlend in2="SourceGraphic"/>
    </filter>
    <rect width="100%" height="100%" fill="#248" filter="url(#filter)"/>
    <filter height="100%" id="f" width="100%" x="0" >
        <feTurbulence baseFrequency="0.008,0" numOctaves="2" seed="15" stitchTiles="stitch" type="fractalNoise" />
        <feDisplacementMap in="SourceGraphic" scale="100"/>
    </filter>
    <g><rect filter="url(#f)" height="100%" width="100%" y="700" fill="#094009"/></g>`

  return toImage(element, skyboxSize * 4, skyboxSize);
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

function catMouth() {
  return toImage(`<path d="M256 210
           Q236 220 226 240
           Q256 250 286 240
           Q276 220 256 210 Z"
        fill="pink" stroke="black" stroke-width="4" />

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

  <line x1="200" y1="250" x2="120" y2="240" stroke="white" stroke-width="4"/>
  <line x1="200" y1="260" x2="120" y2="260" stroke="white" stroke-width="4"/>
  <line x1="200" y1="270" x2="120" y2="280" stroke="white" stroke-width="4"/>

  <line x1="312" y1="250" x2="392" y2="240" stroke="white" stroke-width="4"/>
  <line x1="312" y1="260" x2="392" y2="260" stroke="white" stroke-width="4"/>
  <line x1="312" y1="270" x2="392" y2="280" stroke="white" stroke-width="4"/>`);
}

function witchFace() {
  const yPos = 220;
  const color = 'white';
  return toImage(`<rect x="0" y="0" width="100%" height="100%" fill="#63C328"/>
    
    <circle r="40" cx="160" cy="${yPos}" fill="${color}"  stroke-width="8" />
    <circle r="40" cx="352" cy="${yPos}" fill="${color}"  stroke-width="8" />

    <circle cx="352" cy="${yPos + 10}" r="30" fill="#black"/>
    <circle cx="160" cy="${yPos + 10}" r="30" fill="#black"/>

    <circle cx="256" cy="360" r="60" fill="white"/>
    <rect x="0" y="300" width="100%" height="50" fill="#63C328"/>`);
}

function catEye() {
  return toImage(`<circle r="75" cx="160" cy="256" fill="limegreen" stroke="black" stroke-width="8" />

  <ellipse cx="160" cy="256" rx="25" ry="70" fill="black"/>
  
    <circle r="75" cx="352" cy="256" fill="limegreen" stroke="black" stroke-width="8" />
  <ellipse cx="352" cy="256" rx="25" ry="70" fill="black"/>`);
}

export function flora(color: string, baseFrequency: number) {
  return toImage(`${filterTag('filter')}
        <feTurbulence type="fractalNoise" baseFrequency="${baseFrequency}" numOctaves="8" stitchTiles="stitch"/>
        
        <feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="${color}" surfaceScale="-3" result="d">
            <feDistantLight azimuth="0" elevation="40"/>
        </feDiffuseLighting>
       
    </filter>
    <rect width="100%" height="100%" filter="url(#filter)" />`)
}

// function cobblestonePath() {
//   return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
//   <filter id="blurMe">
//     <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
//   </filter>
//   <filter id="shadow">
//       <feDropShadow dx="1" dy="1" stdDeviation="2" />
//     </filter>
//     <pattern id="pattern" width="86.6" height="50" patternUnits="userSpaceOnUse">
//         <circle r="100" fill="#333"/>
//               <circle cx="20" cy="25" r="23" fill="#6A6473" filter="url(#shadow)" />
//               <circle cx="63" cy="0" r="23" fill="#696472" filter="url(#shadow)"/>
//               <circle cx="63" cy="50" r="23" fill="#696472" filter="url(#shadow)" />
//
//               <circle cx="20" cy="23" r="14" fill="#7f7d88" filter="url(#blurMe)"/>
//               <circle cx="60" cy="-2" r="14" fill="#807d86" filter="url(#blurMe)"/>
//               <circle cx="60" cy="48" r="14" fill="#807d86" filter="url(#blurMe)"/>
//     </pattern>
//     <filter id="filter">
//         <feTurbulence type="fractalNoise" baseFrequency="0.017" numOctaves="1" stitchTiles="stitch"/>
//         <feDisplacementMap in="SourceGraphic" xChannelSelector="R" scale="40"/>
//     </filter>
//     <rect x="-10%" y="-10%" width="120%" height="120%" fill="url(#pattern)" filter="url(#filter)" />
// </svg>`);
// }

export function pathTest() {
  return toImageData(`<filter id="blurMe">
    <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
  </filter>
   
  <path
    d="M 10 80 Q 52.5 10, 95 80 T 180 80"
    stroke="white"
        stroke-width="10px"
    fill="transparent" />`)
}