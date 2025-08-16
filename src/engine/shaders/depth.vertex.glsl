#version 300 es

//[
precision highp float;
//]
layout(location = 2) in float aDepth;
layout(location=3) in vec4 aPosition;

uniform mat4 lightPovMvp;

out float vDepth;

void main(){
    gl_Position = lightPovMvp * aPosition;
    vDepth = aDepth;
}
