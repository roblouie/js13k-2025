#version 300 es

//[
precision highp float;
//]

layout(location=3) in vec4 aPosition;

uniform mat4 lightPovMvp;

void main(){
    gl_Position = lightPovMvp * aPosition;
}
