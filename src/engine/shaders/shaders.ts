// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'I';
export const aCoords1 = 'E';
export const aDepth = 'm';
export const aNormal = 'H';
export const aPosition = 'i';
export const aTexCoord = 'G';
export const alpha = 'L';
export const fragDepth = 'v';
export const frameA = 'M';
export const frameB = 'N';
export const lightPovMvp = 't';
export const modelviewProjection = 'B';
export const normalMatrix = 'K';
export const outColor = 'd';
export const positionFromLightPov = 'u';
export const shadowMap = 'h';
export const uSampler = 'e';
export const u_skybox = 'D';
export const u_viewDirectionProjectionInverse = 'F';
export const vDepth = 'f';
export const vNormal = 'n';
export const vNormalMatrix = 'o';
export const vTexCoord = 'l';
export const v_position = 'J';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
out float v;in float f;void main(){if(f>=10.f)discard;v=gl_FragCoord.z;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=2) in float m;layout(location=3) in vec4 i;uniform mat4 t;out float f;void main(){gl_Position=t*i;f=m;}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 l;in float f;in vec3 n;in mat4 o;in vec4 u;uniform mediump sampler2DArray e;uniform mediump sampler2DShadow h;vec3 s=vec3(-1,1.5,-1);float z=.2f;vec2 A[5]=vec2[](vec2(0),vec2(-1,0),vec2(1,0),vec2(0,1),vec2(0,-1));float g=1.,C=4200.;out vec4 d;void main(){for(int v=0;v<5;v++){vec3 m=vec3(u.xy+A[v]/C,u.z-.001);float i=texture(h,m);g*=max(i,.87);}vec3 v=normalize(mat3(o)*n),i=normalize(s);float m=max(dot(i,v)*g,z);vec3 t=m*vec3(1);vec4 D=vec4(t.xyz,1);d=texture(e,vec3(l,f))*D;if(d.w<.5)discard;}`;

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube D;uniform mat4 F;in vec4 J;out vec4 d;void main(){vec4 v=F*J;d=texture(D,v.xyz);}`;

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 I;out vec4 J;void main(){J=I;gl_Position=I;gl_Position.z=1.;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 H;layout(location=1) in vec2 G;layout(location=2) in float m;layout(location=3) in vec3 I;layout(location=4) in vec3 E;uniform mat4 B,K,t;uniform float L;uniform int M,N;vec4 O[2];out vec2 l;out float f;out vec3 n;out mat4 o;out vec4 u;void main(){O[0]=vec4(I,1);O[1]=vec4(E,1);vec4 v=mix(O[M],O[N],L);gl_Position=B*v;l=G;f=m;n=H;o=K;u=t*v;}`;

