#version 300 es

layout(location = 0) in vec3 aCoords;
layout(location = 1) in float aSize;
layout(location = 2) in float aLife;

uniform mat4 uViewProj;

out float vLife;

void main() {
    gl_Position = uViewProj * vec4(aCoords, 1.0);
    gl_PointSize = aSize;   // in screen pixels
    vLife = aLife;          // pass to frag
}
