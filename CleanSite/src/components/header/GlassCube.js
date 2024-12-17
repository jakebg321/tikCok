import * as THREE from 'three';

export class GlassCube {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
    this.mesh = null;
    this.setupCube();
    this.setupLights();
  }

  setupCube() {
    const geometry = new THREE.BoxGeometry(3, 3, 3, 32, 32, 32);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        prismStrength: { value: 0.8 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vWorldNormal;
        
        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vUv = uv;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform float prismStrength;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vWorldNormal;

        // Function to generate text effect
        vec4 getTextEffect(vec3 pos, vec3 normal, float edgeFactor) {
          // Define text regions (LA and NG)
          vec2 textPos = pos.xy;
          float leftSide = step(-1.5, pos.x) * (1.0 - step(0.0, pos.x));
          float rightSide = step(0.0, pos.x) * (1.0 - step(1.5, pos.x));
          
          // Create text-like patterns
          float textPattern = 0.0;
          
          // "LA" on left side
          if (leftSide > 0.0) {
            textPattern = step(0.2, fract(pos.y * 2.0 + pos.x));
          }
          // "NG" on right side
          if (rightSide > 0.0) {
            textPattern = step(0.2, fract(pos.y * 2.0 - pos.x));
          }
          
          // Add some animation
          float wobble = sin(time * 2.0 + pos.x * 4.0) * 0.5 + 0.5;
          textPattern *= wobble;
          
          // Create chromatic aberration
          vec3 textColor;
          float offset = 0.05;
          textColor.r = textPattern;
          textColor.g = textPattern * 0.8;
          textColor.b = textPattern * 0.6;
          
          // Enhance edges
          textColor *= (1.0 + edgeFactor * 2.0);
          
          // Add slight green tint
          textColor.g *= 1.2;
          
          return vec4(textColor, textPattern);
        }
        
        void main() {
          vec3 viewDirection = normalize(vViewPosition);
          
          // Calculate fresnel
          float fresnelFactor = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);
          
          // Edge highlighting
          float edge = 1.0 - abs(dot(vNormal, viewDirection));
          edge = pow(edge, 3.0);
          
          // Get text effect
          vec4 textEffect = getTextEffect(vPosition, vNormal, edge);
          
          // Internal reflections
          float internalReflection = 
            sin(vPosition.x * 8.0 + time) * 0.03 +
            sin(vPosition.y * 6.0 + time * 1.2) * 0.03;
          
          // Base glass color with slight blue tint
          vec3 glassColor = vec3(0.95, 0.98, 1.0);
          
          // Combine effects
          vec3 finalColor = glassColor;
          
          // Add text where it should appear
          if (textEffect.a > 0.1) {
            finalColor = mix(finalColor, textEffect.rgb, textEffect.a * 0.6);
            finalColor += textEffect.rgb * edge * 0.4;
          }
          
          // Add glass effects
          finalColor *= (1.0 + internalReflection);
          finalColor += vec3(edge) * 0.2;
          
          // Dynamic transparency
          float alpha = mix(0.1, 0.4, fresnelFactor + edge);
          if (textEffect.a > 0.1) {
            alpha = mix(alpha, 0.7, textEffect.a * 0.3);
          }
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 0, 1);
    
    // Add subtle wireframe
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08
    });
    const wireframe = new THREE.LineSegments(edges, edgeMaterial);
    this.mesh.add(wireframe);
    
    this.scene.add(this.mesh);
  }

  setupLights() {
    const lights = [
      { color: 0xff3333, position: [-2, 1, 2], intensity: 0.6 },
      { color: 0x33ff33, position: [0, -2, 2], intensity: 0.6 },
      { color: 0x3333ff, position: [2, 1, 2], intensity: 0.6 }
    ];

    lights.forEach(({ color, position, intensity }) => {
      const light = new THREE.PointLight(color, intensity, 10);
      light.position.set(...position);
      this.scene.add(light);
    });

    const ambient = new THREE.AmbientLight(0xffffff, 0.15);
    this.scene.add(ambient);
  }

  animate(time) {
    if (this.mesh) {
      this.mesh.rotation.x = Math.sin(time * 0.15) * 0.3;
      this.mesh.rotation.y += 0.003;
      this.mesh.rotation.z = Math.cos(time * 0.1) * 0.2;
      
      this.mesh.material.uniforms.time.value = time;
    }
  }

  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.scene.children
        .filter(child => child instanceof THREE.Light)
        .forEach(light => this.scene.remove(light));
    }
  }
}