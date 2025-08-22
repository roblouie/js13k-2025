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

out vec4 outColor;

float sampleShadowPCF(mediump sampler2DShadow shadowMap, vec4 shadowCoord) {
    float shadow = 0.0;
    float texelSize = 1.0 / 4096.0; // match your shadow map resolution

    // 3x3 PCF kernel
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 offset = vec2(x, y) * texelSize;
            shadow += texture(shadowMap, vec3(shadowCoord.xy + offset, shadowCoord.z - 0.002));
        }
    }

    return shadow / 9.0; // average result
}

void main() {
    float hitByLight = sampleShadowPCF(shadowMap, positionFromLightPov);

    vec3 correctedNormals = normalize(mat3(vNormalMatrix) * vNormal);
    vec3 normalizedLightPosition = normalize(lightDirection);
    float litPercent = dot(normalizedLightPosition, correctedNormals) * hitByLight;
    vec3 litColor = litPercent * vec3(1.0, 1.0, 1.0);
    vec4 vColor = clamp(vec4(litColor, 1.0) + ambientLight, ambientLight, vec4(1.0, 1.0, 1.0, 1.0));

    outColor = texture(uSampler, vec3(vTexCoord, vDepth)) * vColor;

    if (outColor.a < 0.5) {
        discard;
    }
}

