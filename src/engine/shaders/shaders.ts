// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'A';
export const aCoords1 = 'F';
export const aDepth = 'm';
export const aNormal = 'D';
export const aPosition = 'i';
export const aTexCoord = 'w';
export const alpha = 'B';
export const fragDepth = 'v';
export const frameA = 'H';
export const frameB = 'I';
export const lightPovMvp = 't';
export const modelviewProjection = 'G';
export const normalMatrix = 'E';
export const outColor = 'g';
export const positionFromLightPov = 'u';
export const shadowMap = 's';
export const uSampler = 'e';
export const u_skybox = 'z';
export const u_viewDirectionProjectionInverse = 'c';
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
in vec2 l;in float f;in vec3 n;in mat4 o;in vec4 u;uniform mediump sampler2DArray e;uniform mediump sampler2DShadow s;vec3 h=vec3(.05,.6,.2);vec4 d=vec4(.2,.2,.2,1);out vec4 g;float x(mediump sampler2DShadow f,vec4 v){float i=0.,n=1./4096.;for(int l=-1;l<=1;l++)for(int m=-1;m<=1;m++){vec2 e=vec2(l,m)*n;i+=texture(f,vec3(v.xy+e,v.z-.002));}return i/9.;}float x(float f,float v,float m){return 2.*v/(m+v-f*(m-v));}void main(){float v=x(s,u);vec3 m=normalize(mat3(o)*n),z=normalize(h);float i=max(dot(z,m),0.),t=mix(.2*i,i,v);vec3 c=t*vec3(1),A=c+d.xyz,C=clamp(A,d.xyz,vec3(1));vec4 D=texture(e,vec3(l,f));float w=x(gl_FragCoord.z,1.,7e2),F=clamp(smoothstep(.4,1.,w),0.,.5);vec3 G=vec3(.3,.3,.5),E=mix(D.xyz*C,G,F);g=vec4(E,D.w);if(g.w<.5)discard;}`;

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube z;uniform mat4 c;in vec4 C;out vec4 g;void main(){vec4 v=c*C;g=texture(z,v.xyz);}`;

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 A;out vec4 C;void main(){C=A;gl_Position=A;gl_Position.z=1.;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 D;layout(location=1) in vec2 w;layout(location=2) in float m;layout(location=3) in vec3 A;layout(location=4) in vec3 F;uniform mat4 G,E,t;uniform float B;uniform int H,I;vec4 r[2];out vec2 l;out float f;out vec3 n;out mat4 o;out vec4 u;void main(){r[0]=vec4(A,1);r[1]=vec4(F,1);vec4 v=mix(r[H],r[I],B);gl_Position=G*v;l=w;f=m;n=D;o=E;u=t*v;}`;

