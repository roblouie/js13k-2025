// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'F';
export const aCoords1 = 'E';
export const aDepth = 'm';
export const aNormal = 'H';
export const aPosition = 'i';
export const aTexCoord = 'G';
export const alpha = 'J';
export const fragDepth = 'v';
export const frameA = 'K';
export const frameB = 'L';
export const lightPovMvp = 't';
export const modelviewProjection = 'B';
export const normalMatrix = 'I';
export const outColor = 'd';
export const positionFromLightPov = 'u';
export const shadowMap = 'h';
export const uSampler = 'e';
export const u_skybox = 'D';
export const u_viewDirectionProjectionInverse = 'c';
export const vDepth = 'f';
export const vNormal = 'n';
export const vNormalMatrix = 'o';
export const vTexCoord = 'l';
export const v_position = 'g';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
out float v;in float f;void main(){if(f>=10.f)discard;v=gl_FragCoord.z;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=2) in float m;layout(location=3) in vec4 i;uniform mat4 t;out float f;void main(){gl_Position=t*i;f=m;}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 l;in float f;in vec3 n;in mat4 o;in vec4 u;uniform mediump sampler2DArray e;uniform mediump sampler2DShadow h;vec3 s=vec3(-1,1.5,-1);vec4 y=vec4(.2,.2,.2,1);vec2 A[5]=vec2[](vec2(0),vec2(-1,0),vec2(1,0),vec2(0,1),vec2(0,-1));float z=1.,C=3200.;out vec4 d;void main(){vec3 v=vec3(u.xy,u.z-.001);float m=texture(h,v);vec3 i=normalize(mat3(o)*n),C=normalize(s);float t=dot(C,i)*m;vec3 z=t*vec3(1);vec4 A=clamp(vec4(z,1)+y,y,vec4(1));d=texture(e,vec3(l,f))*A;if(d.w<.5)discard;}`;

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube D;uniform mat4 c;in vec4 g;out vec4 d;void main(){vec4 v=c*g;d=texture(D,v.xyz);}`;

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 F;out vec4 g;void main(){g=F;gl_Position=F;gl_Position.z=1.;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 H;layout(location=1) in vec2 G;layout(location=2) in float m;layout(location=3) in vec3 F;layout(location=4) in vec3 E;uniform mat4 B,I,t;uniform float J;uniform int K,L;vec4 M[2];out vec2 l;out float f;out vec3 n;out mat4 o;out vec4 u;void main(){M[0]=vec4(F,1);M[1]=vec4(E,1);vec4 v=mix(M[K],M[L],J);gl_Position=B*v;l=G;f=m;n=H;o=I;u=t*v;}`;

