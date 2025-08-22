#version 300 es

//[
precision highp float;
//]
in vec2 vTexCoord;
in float vDepth;
in vec3 vNormal;
in mat4 vNormalMatrix;
in vec4 positionFromLightPov;

uniform mediump sampler2DArray uSampler;
uniform mediump sampler2DShadow shadowMap;

vec3 lightDirection = vec3(-1, 1.5, -1);
vec4 ambientLight = vec4(0.2, 0.2, 0.2, 1.0);

vec2 adjacentPixels[5] = vec2[](
    vec2(0, 0),
    vec2(-1, 0),
    vec2(1, 0),
    vec2(0, 1),
    vec2(0, -1)
);

float visibility = 1.0;
float shadowSpread = 3200.0;

out vec4 outColor;

void main() {
//    for (int i = 0; i < 5; i++) {
        vec3 samplePosition = vec3(positionFromLightPov.xy, positionFromLightPov.z - 0.001);
        float hitByLight = texture(shadowMap, samplePosition);
//        visibility *= max(hitByLight, 0.7);
//    }

    vec3 correctedNormals = normalize(mat3(vNormalMatrix) * vNormal);
    vec3 normalizedLightPosition = normalize(lightDirection);
    float litPercent = dot(normalizedLightPosition, correctedNormals) * hitByLight;
    vec3 litColor = litPercent * vec3(1.0, 1.0, 1.0);
//    vec4 vColor = vec4(litColor.rgb, 1.0);
    vec4 vColor = clamp(vec4(litColor, 1.0) + ambientLight, ambientLight, vec4(1.0, 1.0, 1.0, 1.0));

    outColor = texture(uSampler, vec3(vTexCoord, vDepth)) * vColor;

    if (outColor.a < 0.5) {
        discard;
    }
}
