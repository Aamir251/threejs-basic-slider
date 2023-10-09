uniform float time;
varying float pulse;

varying vec2 vUv;

varying vec3 vNormal;

varying vec3 vThreshold;

void main()
{
    vUv = uv;
    vNormal = normal;
    vThreshold = step(0.4, position);

    vec3 newPosition = position;
    newPosition.z = sin(length(position) * 20.0 + time * 0.8 )  * 0.1;

    pulse = newPosition.z * 20.0;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;

    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;



}