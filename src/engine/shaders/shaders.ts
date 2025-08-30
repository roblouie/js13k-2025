// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'i';
export const aCoords1 = 'I';
export const aDepth = 'm';
export const aLife = 'y';
export const aNormal = 'B';
export const aSize = 'c';
export const aTexCoord = 'H';
export const alpha = 'L';
export const fragColor = 'D';
export const fragDepth = 'v';
export const frameA = 'M';
export const frameB = 'N';
export const lightPovMvp = 'e';
export const modelviewProjection = 'J';
export const normalMatrix = 'K';
export const outColor = 'g';
export const positionFromLightPov = 'u';
export const shadowMap = 'h';
export const uSampler = 's';
export const uTex = 'w';
export const uViewProj = 'A';
export const u_skybox = 'F';
export const u_viewDirectionProjectionInverse = 'G';
export const vDepth = 'f';
export const vLife = 'C';
export const vNormal = 'n';
export const vNormalMatrix = 'o';
export const vTexCoord = 'l';
export const v_position = 'E';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
out float v;in float f;void main(){if(f>=10.f)discard;v=gl_FragCoord.z;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=2) in float m;layout(location=3) in vec4 i;uniform mat4 e;out float f;void main(){gl_Position=e*i;f=m;}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 l;in float f;in vec3 n;in mat4 o;in vec4 u;uniform mediump sampler2DArray s;uniform mediump sampler2DShadow h;vec3 z=vec3(.05,.6,.2);vec4 d=vec4(.2,.2,.2,1);out vec4 g;float t(mediump sampler2DShadow f,vec4 v){float i=0.,n=1./4096.;for(int l=-1;l<=1;l++)for(int m=-1;m<=1;m++){vec2 e=vec2(l,m)*n;i+=texture(f,vec3(v.xy+e,v.z-.002));}return i/9.;}float t(float f,float v,float i){return 2.*v/(i+v-f*(i-v));}void main(){float v=t(h,u);vec3 m=normalize(mat3(o)*n),i=normalize(z);float e=max(dot(i,m),0.),c=mix(.2*e,e,v);vec3 y=c*vec3(1),A=y+d.xyz,C=clamp(A,d.xyz,vec3(1));vec4 D=texture(s,vec3(l,f));float w=t(gl_FragCoord.z,1.,7e2),F=clamp(smoothstep(.4,1.,w),0.,.5);vec3 G=vec3(.3,.3,.5),E=mix(D.xyz*C,G,F);g=vec4(E,D.w);if(g.w<.5)discard;}`;

export const particle_fragment_glsl = `#version 300 es
precision highp float;
in float C;out vec4 D;uniform sampler2D w;void main(){vec4 v=vec4(1,0,0,1);float f=v.w*C;if(f<.01)discard;D=vec4(v.xyz,f);}`;

export const particle_vertex_glsl = `#version 300 es
layout(location=0) in vec3 i;layout(location=1) in float c;layout(location=2) in float y;uniform mat4 A;out float C;void main(){gl_Position=A*vec4(i,1);gl_PointSize=c;C=y;}`;

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube F;uniform mat4 G;in vec4 E;out vec4 g;void main(){vec4 v=G*E;g=texture(F,v.xyz);}`;

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 i;out vec4 E;void main(){E=i;gl_Position=i;gl_Position.z=1.;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 B;layout(location=1) in vec2 H;layout(location=2) in float m;layout(location=3) in vec3 i;layout(location=4) in vec3 I;uniform mat4 J,K,e;uniform float L;uniform int M,N;vec4 r[2];out vec2 l;out float f;out vec3 n;out mat4 o;out vec4 u;void main(){r[0]=vec4(i,1);r[1]=vec4(I,1);vec4 v=mix(r[M],r[N],L);gl_Position=J*v;l=H;f=m;n=B;o=K;u=e*v;}`;

