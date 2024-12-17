import * as THREE from 'three';

export class TextPlane {
  constructor(scene, width, height) {
    this.scene = scene;
    this.width = width;
    this.height = height;
    this.mesh = null;
    this.canvas = document.createElement('canvas');
    this.texture = null;
    this.setup();
  }

  setup() {
    this.canvas.width = this.width * 2;
    this.canvas.height = this.height * 2;
    const ctx = this.canvas.getContext('2d');

    // Create gradient text
    const gradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f0f0f0');

    ctx.fillStyle = gradient;
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LAUNCHING', this.canvas.width / 2, this.canvas.height / 2);

    // Create texture
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    // Create mesh
    const geometry = new THREE.PlaneGeometry(12, 6);
    const material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      opacity: 1
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.z = -2;
    this.scene.add(this.mesh);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width * 2;
    this.canvas.height = height * 2;
    this.setup();
  }

  dispose() {
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.texture.dispose();
    }
  }
}
