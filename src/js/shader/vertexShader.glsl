
varying vec2 vUv;
uniform float uTime;
uniform float uWave;
// uniform vec2 uFrequency;
uniform vec3 uFrequency;

void main() {
  vUv = uv;
  vec3 pos = position;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime * 0.1) * uWave;
  modelPosition.y += sin(modelPosition.x * uFrequency.x + uTime * 0.1) * uWave;
  modelPosition.x += sin(modelPosition.z * uFrequency.z + uTime * 0.1) * uWave;
  // modelPosition.x += sin(modelPosition.y * uFrequency.y + uTime * 1.5) * 10.0;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;
}