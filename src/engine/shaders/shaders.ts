// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'c';
export const aCoords1 = 'H';
export const aDepth = 'm';
export const aNormal = 'D';
export const aPosition = 'f';
export const aTexCoord = 'F';
export const alpha = 'B';
export const fragDepth = 'v';
export const frameA = 'I';
export const frameB = 'J';
export const lightPovMvp = 't';
export const modelviewProjection = 'G';
export const normalMatrix = 'E';
export const outColor = 'd';
export const positionFromLightPov = 'u';
export const shadowMap = 'h';
export const uSampler = 'e';
export const u_skybox = 'A';
export const u_viewDirectionProjectionInverse = 'C';
export const vDepth = 'i';
export const vNormal = 'n';
export const vNormalMatrix = 'o';
export const vTexCoord = 'l';
export const v_position = 'g';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
out float v;in float i;void main(){if(i>=10.f)discard;v=gl_FragCoord.z;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=2) in float m;layout(location=3) in vec4 f;uniform mat4 t;out float i;void main(){gl_Position=t*f;i=m;}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 l;in float i;in vec3 n;in mat4 o;in vec4 u;uniform mediump sampler2DArray e;uniform mediump sampler2DShadow h;vec3 s=vec3(-1,1.5,-1);vec4 z=vec4(.2,.2,.2,1);out vec4 d;float r(mediump sampler2DShadow v,vec4 i){float f=0.,n=1./4096.;for(int l=-1;l<=1;l++)for(int m=-1;m<=1;m++){vec2 e=vec2(l,m)*n;f+=texture(v,vec3(i.xy+e,i.z-.002));}return f/9.;}void main(){float m=r(h,u);vec3 v=normalize(mat3(o)*n),f=normalize(s);float t=dot(f,v)*m;vec3 A=t*vec3(1);vec4 C=clamp(vec4(A,1)+z,z,vec4(1));d=texture(e,vec3(l,i))*C;if(d.w<.5)discard;}`;

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube A;uniform mat4 C;in vec4 g;out vec4 d;void main(){vec4 v=C*g;d=texture(A,v.xyz);}`;

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 c;out vec4 g;void main(){g=c;gl_Position=c;gl_Position.z=1.;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 D;layout(location=1) in vec2 F;layout(location=2) in float m;layout(location=3) in vec3 c;layout(location=4) in vec3 H;uniform mat4 G,E,t;uniform float B;uniform int I,J;vec4 K[2];out vec2 l;out float i;out vec3 n;out mat4 o;out vec4 u;void main(){K[0]=vec4(c,1);K[1]=vec4(H,1);vec4 v=mix(K[I],K[J],B);gl_Position=G*v;l=F;i=m;n=D;o=E;u=t*v;}`;

