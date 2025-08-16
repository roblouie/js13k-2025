// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'J';
export const aCoords1 = 'E';
export const aDepth = 'G';
export const aNormal = 'I';
export const aPosition = 'm';
export const aTexCoord = 'H';
export const alpha = 'L';
export const fragDepth = 'v';
export const frameA = 'M';
export const frameB = 'N';
export const lightPovMvp = 'f';
export const modelviewProjection = 'B';
export const normalMatrix = 'K';
export const outColor = 't';
export const positionFromLightPov = 'u';
export const shadowMap = 'h';
export const uSampler = 'e';
export const u_skybox = 'd';
export const u_viewDirectionProjectionInverse = 'D';
export const vDepth = 'n';
export const vNormal = 'o';
export const vNormalMatrix = 'l';
export const vTexCoord = 'i';
export const v_position = 'F';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
out float v;void main(){v=gl_FragCoord.z;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=3) in vec4 m;uniform mat4 f;void main(){gl_Position=f*m;}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 i;in float n;in vec3 o;in mat4 l;in vec4 u;uniform mediump sampler2DArray e;uniform mediump sampler2DShadow h;vec3 s=vec3(-1,1.5,-1);float z=.2f;vec2 A[5]=vec2[](vec2(0),vec2(-1,0),vec2(1,0),vec2(0,1),vec2(0,-1));float g=1.,C=4200.;out vec4 t;void main(){for(int v=0;v<5;v++){vec3 m=vec3(u.xy+A[v]/C,u.z-.001);float f=texture(h,m);g*=max(f,.87);}vec3 v=normalize(mat3(l)*o),f=normalize(s);float m=max(dot(f,v)*g,z);vec3 d=m*vec3(1);vec4 D=vec4(d.xyz,1);t=texture(e,vec3(i,n))*D;if(t.w<.5)discard;}`;

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube d;uniform mat4 D;in vec4 F;out vec4 t;void main(){vec4 v=D*F;t=texture(d,v.xyz);}`;

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 J;out vec4 F;void main(){F=J;gl_Position=J;gl_Position.z=1.;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 I;layout(location=1) in vec2 H;layout(location=2) in float G;layout(location=3) in vec3 J;layout(location=4) in vec3 E;uniform mat4 B,K,f;uniform float L;uniform int M,N;vec4 O[2];out vec2 i;out float n;out vec3 o;out mat4 l;out vec4 u;void main(){O[0]=vec4(J,1);O[1]=vec4(E,1);vec4 v=mix(O[M],O[N],L);gl_Position=B*v;i=H;n=G;o=I;l=K;u=f*v;}`;

