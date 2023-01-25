
varying vec2 vUv;
uniform float uTime;
uniform vec2 uFrequency;

void main() {
  vUv = uv;
  vec3 pos = position;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime * 1.5) * 10.0;
  modelPosition.y += sin(modelPosition.y * uFrequency.y + uTime * 1.5) * 10.0;
  // modelPosition.x += sin(modelPosition.y * uFrequency.y + uTime * 1.5) * 10.0;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;
}