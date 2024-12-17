import * as THREE from 'three';

export class BackgroundText {
  constructor(scene, renderer, camera) {
    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.textMesh = null;
    this.renderTarget = null;
    this.setupRenderTarget();
    this.setupText();
  }

  setupRenderTarget() {
    this.renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );
  }

  setupText() {
    // Create text canvas
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    // Draw text
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = 'bold 200px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('LAUNCHING', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const geometry = new THREE.PlaneGeometry(12, 3);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1
    });

    this.textMesh = new THREE.Mesh(geometry, material);
    this.textMesh.position.z = -2;
    this.textMesh.renderOrder = 1; // Ensure text renders before cube
    this.scene.add(this.textMesh);
  }

  updateTexture(cube) {
    if (!cube.mesh) return;
    
    // Store cube's current visibility
    const wasVisible = cube.mesh.visible;
    cube.mesh.visible = false;
    
    // Render only the text to the render target
    const currentRenderTarget = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(currentRenderTarget);
    
    // Restore cube visibility
    cube.mesh.visible = wasVisible;
    
    // Update the cube's background texture
    if (cube.mesh.material.uniforms.tText) {
      cube.mesh.material.uniforms.tText.value = this.renderTarget.texture;
    }
  }

  dispose() {
    if (this.textMesh) {
      this.textMesh.geometry.dispose();
      this.textMesh.material.dispose();
      if (this.textMesh.material.map) {
        this.textMesh.material.map.dispose();
      }
    }
    if (this.renderTarget) {
      this.renderTarget.dispose();
    }
  }
}