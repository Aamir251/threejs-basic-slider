varying float pulse;
varying vec2 vUv;
uniform float time;
uniform sampler2D uTexture;
uniform vec2 uTextureSize;
varying vec3 vNormal;
varying vec2 vSize;
uniform float uProgress;

vec2 getUV (vec2 uv, vec2 textureSize, vec2 quadSize) {
    vec2 tempUV = uv - vec2(0.5);

    float quadAspectRatio = quadSize.x / quadSize.y;
    float textureAspectRatio = textureSize.x / textureSize.y;

    if (quadAspectRatio < textureAspectRatio) {
        tempUV *= vec2(quadAspectRatio / textureAspectRatio, 1.0);
    } else {
        tempUV *= vec2(1.0, textureAspectRatio / quadAspectRatio);
    }

    tempUV += vec2(0.5);
    return tempUV;
}


void main()
{


    // vec2 newUV = (vUv - vec2(0.5)) * 2.0 + vec2(0.5);

    vec2 correctUV = getUV(vUv, uTextureSize, vSize);

    vec4 image = texture2D(uTexture, correctUV);

    gl_FragColor = vec4(vUv, 0.1, 1.0);
    gl_FragColor = image;

}