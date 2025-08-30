#version 300 es

//[
precision highp float;
//]

in float vLife;
out vec4 fragColor;

uniform sampler2D uTex;

void main() {
    // gl_PointCoord is vec2(0..1)
    vec4 texColor = vec4(1.0, 0.0, 0.0, 1.0);

    // fade with life
    float alpha = texColor.a * vLife;

    if (alpha < 0.01) discard; // soft edges
    fragColor = vec4(texColor.rgb, alpha);
}