import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

export class PostProcessing {
  constructor(renderer, scene, camera) {
    this.composer = new EffectComposer(renderer);
    this.setupPasses(scene, camera);
  }

  setupPasses(scene, camera) {
    // First render everything normally
    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    // Custom pass for localized chromatic aberration
    const localChromatic = {
      uniforms: {
        tDiffuse: { value: null },
        intensity: { value: 1.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float intensity;
        varying vec2 vUv;
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          
          // Only apply effect to bright (text) pixels
          float brightness = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
          
          if (brightness > 0.5) {
            // Get position relative to center for directional offset
            vec2 direction = (vUv - vec2(0.5)) * 2.0;
            
            // Sample each color channel with offset
            vec4 color;
            float offsetScale = 0.02 * intensity;
            
            color.r = texture2D(tDiffuse, vUv + direction * offsetScale).r;
            color.g = texel.g;
            color.b = texture2D(tDiffuse, vUv - direction * offsetScale).b;
            color.a = texel.a;
            
            // Only apply to pixels near cube center
            float distFromCenter = length(direction);
            float mask = smoothstep(0.8, 0.0, distFromCenter);
            
            gl_FragColor = mix(texel, color, mask);
          } else {
            gl_FragColor = texel;
          }
        }
      `
    };

    const chromaticPass = new ShaderPass(localChromatic);
    this.composer.addPass(chromaticPass);
  }

  dispose() {
    this.composer.dispose();
  }
}