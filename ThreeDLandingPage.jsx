import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Lenis from 'lenis';

const ThreeDLandingPage = () => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !contentRef.current) return;

    // 1. --- THREE.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true, // Make canvas transparent
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create a 3D path for the camera to follow
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 0, 10),
      new THREE.Vector3(-5, 5, 5),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, -5, 5),
      new THREE.Vector3(10, 0, 10),
    ]);

    // Visualize the path with a TubeGeometry
    const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.2, 8, false);
    const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true });
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube);

    // Add some lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // 2. --- Lenis Setup ---
    const lenis = new Lenis({
      // Use the content div as the scrollable element
      wrapper: contentRef.current,
      content: contentRef.current.querySelector('.content-inner'),
    });

    // 3. --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = (time) => {
      // Update Lenis
      lenis.raf(time);

      // Get scroll progress (0 to 1)
      const scrollProgress = lenis.progress;

      // Get a point on the curve based on scroll progress
      const cameraPosition = curve.getPointAt(scrollProgress);
      
      // Get a point slightly ahead on the curve to look at
      const lookAtPosition = curve.getPointAt(Math.min(scrollProgress + 0.01, 1));

      // Update camera
      camera.position.copy(cameraPosition);
      camera.lookAt(lookAtPosition);

      // Animate the tube for some life
      tube.rotation.x = time / 10000;
      tube.rotation.y = time / 10000;

      // Render the scene
      renderer.render(scene, camera);

      // Continue the loop
      requestAnimationFrame(animate);
    };

    // Start the animation loop
    requestAnimationFrame(animate);

    // 4. --- Handle Resizing ---
    const handleResize = () => {
      // Update camera
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 5. --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      // Dispose of Three.js objects to free up memory
      scene.remove(tube);
      tubeGeometry.dispose();
      tubeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />
      <div ref={contentRef} style={{ height: '100vh', overflowY: 'scroll' }}>
        <div className="content-inner" style={{ height: '300vh', color: 'white', textAlign: 'center' }}>
          <h1 style={{ paddingTop: '45vh' }}>Arise Enterprises CRM</h1>
          <p>Scroll down to move through the 3D scene.</p>
        </div>
      </div>
    </div>
  );
};

export default ThreeDLandingPage;