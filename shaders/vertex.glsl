uniform float time;
varying float pulse;
uniform float uProgress;
varying vec2 vUv;
uniform vec2 uResolution;
uniform vec2 uQuadSize;
varying vec2 vSize;
uniform vec4 uCorners;
uniform float uScrollProgress;

void main()
{
    float PI = 3.1415926;
    vUv = uv;
    float sine = sin(PI * uProgress);
    float wave = sine * 0.1 * sin(5.0 * length(uv) + 10.0 * uProgress);
    // vec3 newPosition = position;
    // newPosition.z = sin(length(position) * 20.0 + time * 0.8 )  * 0.1;

    // pulse = newPosition.z * 20.0;
    vec4 defaultState = modelMatrix * vec4(position, 1.0);
    vec4 fullScreenState = vec4(position, 1.0);

    fullScreenState.x *= uResolution.x;
    fullScreenState.y *= uResolution.y;
    fullScreenState.z += uCorners.x;

    // fullScreenState.y *= 2.0;
    float cornerProgress = mix(
        mix(uCorners.x, uCorners.y, uv.x),
        mix(uCorners.z, uCorners.w, uv.x),
        uv.y
    );

    // vec4 finalState = mix(defaultState, fullScreenState, cornerProgress);

    // vSize = mix(uQuadSize, uResolution, cornerProgress);

    // vec4 modelPosition = defaultState;

    // modelPosition.x += mix(0., uv.y, uScrollProgress);

    // vec4 viewPosition = viewMatrix * modelPosition;

    // vec4 projectionPosition = projectionMatrix * viewPosition;

    // gl_Position = projectionPosition;

    vec4 finalState = mix(defaultState,fullScreenState,cornerProgress);

    vSize = mix(uQuadSize,uResolution,cornerProgress);
    gl_Position = projectionMatrix * viewMatrix * finalState;

}