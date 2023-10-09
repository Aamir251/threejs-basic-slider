varying float pulse;
varying vec2 vUv;
uniform float time;

uniform sampler2D uTexture;

varying vec3 vNormal;


void main()
{
    // float sinePulse = (1.0 + sin(vUv.x * 10.0 + time)) + 0.5;

    vec4 textureColor = texture2D(uTexture, vUv + sin(vUv * 20.0 + time) * 0.01 );
    gl_FragColor = vec4(textureColor);

    // gl_FragColor = vec4(vNormal, 1);
}