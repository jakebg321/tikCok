// CubeText.js
import * as THREE from 'three';

export class CubeText {
  constructor(scene, renderer, camera) {  // Add camera parameter
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;  // Store camera reference
    this.textRenderTarget = null;
    this.effectPass = null;
    this.setupRenderTarget();
    this.setupEffect();
  }

  setupRenderTarget() {
    this.textRenderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );
  }

  setupEffect() {
    const material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        cubeMatrix: { value: new THREE.Matrix4() },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        prismStrength: { value: 2.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform mat4 cubeMatrix;
        uniform vec2 resolution;
        uniform float prismStrength;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          
          if (texel.a > 0.0) {
            vec4 worldPos = vec4(vPosition, 1.0);
            vec4 cubeSpace = cubeMatrix * worldPos;
            float distFromCenter = length(cubeSpace.xyz) / 2.0;
            
            if (distFromCenter < 1.0) {
              vec2 offset = cubeSpace.xy * prismStrength * 0.01;
              
              vec4 prismatic;
              prismatic.r = texture2D(tDiffuse, vUv + offset).r;
              prismatic.g = texture2D(tDiffuse, vUv).g;
              prismatic.b = texture2D(tDiffuse, vUv - offset).b;
              prismatic.a = texel.a;
              
              float edgeFactor = smoothstep(0.8, 1.0, distFromCenter);
              prismatic.rgb *= 1.0 + edgeFactor * 0.5;
              
              gl_FragColor = prismatic;
            } else {
              gl_FragColor = texel;
            }
          } else {
            gl_FragColor = texel;
          }
        }
      `,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.effectPass = new THREE.Mesh(geometry, material);
    this.effectPass.frustumCulled = false;
    this.scene.add(this.effectPass);  // Add to scene
  }

  updateCubeTransform(cube) {
    if (this.effectPass && cube.mesh) {
      cube.mesh.updateMatrixWorld();
      const invMatrix = cube.mesh.matrixWorld.clone().invert();
      this.effectPass.material.uniforms.cubeMatrix.value.copy(invMatrix);
    }
  }

  render(cube) {
    if (!this.effectPass || !cube.mesh) return;
    
    this.updateCubeTransform(cube);
    
    const currentRenderTarget = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.textRenderTarget);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(currentRenderTarget);
    
    this.effectPass.material.uniforms.tDiffuse.value = this.textRenderTarget.texture;
  }

  dispose() {
    if (this.textRenderTarget) {
      this.textRenderTarget.dispose();
    }
    if (this.effectPass) {
      this.effectPass.geometry.dispose();
      this.effectPass.material.dispose();
      if (this.effectPass.parent) {
        this.effectPass.parent.remove(this.effectPass);
      }
    }
  }
}