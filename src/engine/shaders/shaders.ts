// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'F';
export const aCoords1 = 'w';
export const aDepth = 'm';
export const aNormal = 'D';
export const aPosition = 'i';
export const aTexCoord = 'c';
export const alpha = 'B';
export const fragDepth = 'v';
export const frameA = 'H';
export const frameB = 'I';
export const lightPovMvp = 't';
export const modelviewProjection = 'G';
export const normalMatrix = 'E';
export const outColor = 'd';
export const positionFromLightPov = 'u';
export const shadowMap = 'h';
export const uSampler = 'e';
export const u_skybox = 'g';
export const u_viewDirectionProjectionInverse = 'A';
export const vDepth = 'f';
export const vNormal = 'n';
export const vNormalMatrix = 'o';
export const vTexCoord = 'l';
export const v_position = 'C';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
out float v;in float f;void main(){if(f>=10.f)discard;v=gl_FragCoord.z;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=2) in float m;layout(location=3) in vec4 i;uniform mat4 t;out float f;void main(){gl_Position=t*i;f=m;}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 l;in float f;in vec3 n;in mat4 o;in vec4 u;uniform mediump sampler2DArray e;uniform mediump sampler2DShadow h;vec3 s=vec3(.05,.6,.2);vec4 z=vec4(.2,.2,.2,1);out vec4 d;float p(mediump sampler2DShadow f,vec4 v){float i=0.,n=1./4096.;for(int l=-1;l<=1;l++)for(int m=-1;m<=1;m++){vec2 e=vec2(l,m)*n;i+=texture(f,vec3(v.xy+e,v.z-.002));}return i/9.;}float p(float f,float v,float m){return 2.*v/(m+v-f*(m-v));}void main(){float v=p(h,u);vec3 m=normalize(mat3(o)*n),i=normalize(s);float t=dot(i,m)*v;vec3 g=t*vec3(1);vec4 A=clamp(vec4(g,1)+z,z,vec4(1));float w=p(gl_FragCoord.z,1.,7e2),C=smoothstep(.5,1.,w);C=min(C,.5);vec4 D=texture(e,vec3(l,f))*A;vec3 F=mix(D.xyz,vec3(.3,.3,.5),C);d=vec4(F,D.w);if(d.w<.5)discard;}`;

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube g;uniform mat4 A;in vec4 C;out vec4 d;void main(){vec4 v=A*C;d=texture(g,v.xyz);}`;

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 F;out vec4 C;void main(){C=F;gl_Position=F;gl_Position.z=1.;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 D;layout(location=1) in vec2 c;layout(location=2) in float m;layout(location=3) in vec3 F;layout(location=4) in vec3 w;uniform mat4 G,E,t;uniform float B;uniform int H,I;vec4 r[2];out vec2 l;out float f;out vec3 n;out mat4 o;out vec4 u;void main(){r[0]=vec4(F,1);r[1]=vec4(w,1);vec4 v=mix(r[H],r[I],B);gl_Position=G*v;l=c;f=m;n=D;o=E;u=t*v;}`;

