import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GlassCube } from './GlassCube';
import { PostProcessing } from './PostProcessing';
import { BackgroundText } from './TextBackground';

const AnimatedHeader = () => {
  const mountRef = useRef(null);
  const frameIdRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const composerRef = useRef(null);

  useEffect(() => {
    // Constants
    const NAVBAR_WIDTH = 240;
    const HEADER_HEIGHT = 200;
    const windowWidth = window.innerWidth;
    const contentWidth = windowWidth - NAVBAR_WIDTH;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      contentWidth / HEADER_HEIGHT,
      0.1,
      1000
    );
    camera.position.z = 10;
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(contentWidth, HEADER_HEIGHT);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Initialize components
    const backgroundText = new BackgroundText(scene, renderer, camera);
    const glassCube = new GlassCube(scene, renderer);
    const postProcessing = new PostProcessing(renderer, scene, camera);
    
    composerRef.current = postProcessing.composer;

    // Animation
    let time = 0;
    const animate = () => {
      time += 0.01;
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (glassCube) {
        backgroundText.updateTexture(glassCube);
        glassCube.animate(time);
      }
      
      composerRef.current.render();
    };

    // Handle resize
    const handleResize = () => {
      const newWindowWidth = window.innerWidth;
      const newContentWidth = newWindowWidth - NAVBAR_WIDTH;

      camera.aspect = newContentWidth / HEADER_HEIGHT;
      camera.updateProjectionMatrix();

      renderer.setSize(newContentWidth, HEADER_HEIGHT);
      composerRef.current.setSize(newContentWidth, HEADER_HEIGHT);
      
      // Update resolution uniform in cube shader
      if (glassCube?.mesh?.material) {
        glassCube.mesh.material.uniforms.resolution.value.set(newContentWidth, HEADER_HEIGHT);
      }
    };

    window.addEventListener('resize', handleResize);
    mountRef.current.appendChild(renderer.domElement);
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      glassCube.dispose();
      backgroundText.dispose();
      postProcessing.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="h-[200px] relative overflow-hidden ml-[240px]"
      style={{ 
        width: 'calc(100% - 240px)',
        background: 'black' 
      }}
    />
  );
};

export default AnimatedHeader;