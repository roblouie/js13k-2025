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

vec3 lightDirection = normalize(vec3(0.3, 0.3, 0.2));
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

float linearizeDepth(float z, float near, float far) {
    return (2.0 * near) / (far + near - z * (far - near));
}

void main() {
    // === Shadow sampling ===
    float shadowFactor = sampleShadowPCF(shadowMap, positionFromLightPov);
    // 1.0 = fully lit, 0.0 = fully shadowed

    // === Normalized inputs ===
    vec3 normal     = normalize(mat3(vNormalMatrix) * vNormal);

    // === Basic diffuse ===
    float NdotL = max(dot(lightDirection, normal), 0.0);

    // Instead of killing diffuse in shadow, scale it down
    float shadowedDiffuse = mix(0.2 * NdotL, NdotL, shadowFactor);

    // === Lighting ===
    vec3 diffuseColor = shadowedDiffuse * vec3(1.0); // white light
    vec3 litColor = diffuseColor + ambientLight.rgb;

    // Clamp to [ambient .. 1] range
    vec3 finalLighting = clamp(litColor, ambientLight.rgb, vec3(1.0));

    // === Texture sample ===
    vec4 baseColor = texture(uSampler, vec3(vTexCoord, vDepth));
    vec3 shadedColor = baseColor.rgb * finalLighting;

    // === Fog ===
    float depth = linearizeDepth(gl_FragCoord.z, 1.0, 700.0);
    // Fog ramps from near → far, capped so it never fully grays out
    float fogFactor = clamp(smoothstep(0.4, 1.0, depth), 0.0, 0.5);

    vec3 fogColor = vec3(0.3, 0.3, 0.5);
    vec3 foggedColor = mix(shadedColor, fogColor, fogFactor);

    // === Final output ===
    outColor = vec4(foggedColor, baseColor.a);

    if (outColor.a < 0.5) {
        discard;
    }
}

