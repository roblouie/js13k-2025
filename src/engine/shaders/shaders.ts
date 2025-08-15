// Generated with Shader Minifier 1.3.4 (https://github.com/laurentlb/Shader_Minifier/)
export const aCoords = 'N';
export const aDepth = 'K';
export const aNormal = 'H';
export const aPosition = 'e';
export const aTexCoord = 'I';
export const fragDepth = 'm';
export const fragPos = 'f';
export const lightPovMvp = 'i';
export const lightWorldPosition = 'v';
export const modelviewProjection = 'S';
export const normalMatrix = 'M';
export const outColor = 'g';
export const pointLightAttenuation = 'd';
export const positionFromLightPov = 'T';
export const shadowCubeMap = 'x';
export const spotlightDirection = 'y';
export const spotlightPosition = 'c';
export const uSampler = 'z';
export const u_skybox = 'L';
export const u_viewDirectionProjectionInverse = 'B';
export const vDepth = 'n';
export const vNormal = 'u';
export const vNormalMatrix = 'h';
export const vTexCoord = 'o';
export const v_position = 'F';
export const worldMatrix = 'l';
export const worldPosition = 't';

export const depth_fragment_glsl = `#version 300 es
precision highp float;
uniform vec3 v;in vec3 f;out float m;void main(){m=length(f-v)/40.;}`;

export const depth_vertex_glsl = `#version 300 es
precision highp float;
layout(location=0) in vec4 e;uniform mat4 i,l;out vec3 f;void main(){gl_Position=i*e;f=vec3(l*vec4(e.xyz,1));}`;

export const fragment_glsl = `#version 300 es
precision highp float;
in vec2 o;in float n;in vec3 u;in mat4 h;in vec3 t;uniform vec3 v,d;vec4 s=vec4(1);uniform mediump sampler2DArray z;uniform mediump samplerCube x;uniform vec3 c,y;vec4 A=vec4(1,1,.8,1);float C=1.,D=.85;vec4 G=vec4(.7,.7,.7,1);out vec4 g;float p(float v,float m,float f,float e){return 1./(v*v*m+v*f+e);}void main(){vec3 m=t-v,l=v-t;float f=length(m);vec3 e=normalize(m),i=normalize(l);float B=texture(x,e).x*40.,E=.015,F=0.;F=B+E<f?0.:1.;vec3 H=normalize(mat3(h)*u);float I=max(0.,dot(i,H)),J=p(f,d.x,d.y,d.z);vec4 K=s*I*J*F;vec3 L=c-t,M=normalize(L);float N=length(L),O=max(0.,dot(M,H)),P=dot(y,-M),Q=smoothstep(D,C,P),R=p(N,.005,.001,.4);vec4 S=A*O*Q*R,T=clamp(G+K+S,G,vec4(1));g=texture(z,vec3(o,n))*T;}`;

export const skybox_fragment_glsl = `#version 300 es
precision highp float;
uniform samplerCube L;uniform mat4 B;in vec4 F;out vec4 g;void main(){vec4 v=B*F;g=texture(L,v.xyz);}`;

export const skybox_vertex_glsl = `#version 300 es
layout(location=0) in vec4 N;out vec4 F;void main(){F=N;gl_Position=N;gl_Position.z=1.;}`;

export const vertex_glsl = `#version 300 es
layout(location=0) in vec3 N;layout(location=1) in vec3 H;layout(location=2) in vec2 I;layout(location=3) in float K;uniform mat4 S,M,i,l;out vec2 o;out float n;out vec3 u;out mat4 h;out vec4 T;out vec3 t;void main(){vec4 v=vec4(N,1);gl_Position=S*v;o=I;n=K;u=H;h=M;T=i*v;t=(l*v).xyz;}`;

