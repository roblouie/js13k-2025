// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'i';
export const aCoords1 = 'H';
export const aDepth = 'm';
export const aLife = 'w';
export const aNormal = 'E';
export const aSize = 'c';
export const aTexCoord = 'B';
export const alpha = 'K';
export const fragColor = 'D';
export const fragDepth = 'v';
export const frameA = 'L';
export const frameB = 'M';
export const lightPovMvp = 't';
export const modelviewProjection = 'I';
export const normalMatrix = 'J';
export const outColor = 'u';
export const positionFromLightPov = 'e';
export const shadowMap = 'd';
export const uSampler = 's';
export const uViewProj = 'A';
export const u_skybox = 'C';
export const u_viewDirectionProjectionInverse = 'F';
export const vDepth = 'f';
export const vLife = 'g';
export const vNormal = 'n';
export const vNormalMatrix = 'o';
export const vTexCoord = 'l';
export const v_position = 'G';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
out float v;in float f;void main(){if(f>=10.f)discard;v=gl_FragCoord.z;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=2) in float m;layout(location=3) in vec4 i;uniform mat4 t;out float f;void main(){gl_Position=t*i;f=m;}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 l;in float f;in vec3 n;in mat4 o;in vec4 e;uniform mediump sampler2DArray s;uniform mediump sampler2DShadow d;vec3 h=vec3(.05,.6,.2);vec4 z=vec4(.2,.2,.2,1);out vec4 u;float x(mediump sampler2DShadow f,vec4 v){float i=0.,n=1./4096.;for(int l=-1;l<=1;l++)for(int m=-1;m<=1;m++){vec2 e=vec2(l,m)*n;i+=texture(f,vec3(v.xy+e,v.z-.002));}return i/9.;}float x(float f,float i,float m){return 2.*i/(m+i-f*(m-i));}void main(){float v=x(d,e);vec3 m=normalize(mat3(o)*n),i=normalize(h);float t=max(dot(i,m),0.),c=mix(.2*t,t,v);vec3 g=c*vec3(1),A=g+z.xyz,C=clamp(A,z.xyz,vec3(1));vec4 D=texture(s,vec3(l,f));float w=x(gl_FragCoord.z,1.,7e2),F=clamp(smoothstep(.4,1.,w),0.,.5);vec3 G=vec3(.3,.3,.5),E=mix(D.xyz*C,G,F);u=vec4(E,D.w);if(u.w<.5)discard;}`;

export const particle_fragment_glsl = `#version 300 es
precision highp float;
in float g,f;out vec4 D;uniform mediump sampler2DArray s;void main(){vec4 m=texture(s,vec3(gl_PointCoord,f));float v=m.w*g;if(v<.01)discard;D=vec4(m.xyz,v);}`;

export const particle_vertex_glsl = `#version 300 es
layout(location=0) in vec3 i;layout(location=1) in float c;layout(location=2) in float w;layout(location=3) in float m;uniform mat4 A;out float g,f;void main(){gl_Position=A*vec4(i,1);gl_PointSize=c;g=w;f=m;}`;

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube C;uniform mat4 F;in vec4 G;out vec4 u;void main(){vec4 v=F*G;u=texture(C,v.xyz);}`;

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 i;out vec4 G;void main(){G=i;gl_Position=i;gl_Position.z=1.;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 E;layout(location=1) in vec2 B;layout(location=2) in float m;layout(location=3) in vec3 i;layout(location=4) in vec3 H;uniform mat4 I,J,t;uniform float K;uniform int L,M;vec4 r[2];out vec2 l;out float f;out vec3 n;out mat4 o;out vec4 e;void main(){r[0]=vec4(i,1);r[1]=vec4(H,1);vec4 v=mix(r[L],r[M],K);gl_Position=I*v;l=B;f=m;n=E;o=J;e=t*v;}`;

