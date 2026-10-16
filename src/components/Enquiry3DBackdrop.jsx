import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Enquiry3DBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Particle Wave Grid (Subtle medical telemetry matrix)
    const count = 40;
    const spacing = 1.2;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * count * 3);
    const originalY = new Float32Array(count * count);

    let idx = 0;
    for (let x = 0; x < count; x++) {
      for (let z = 0; z < count; z++) {
        const px = (x - count / 2) * spacing;
        const pz = (z - count / 2) * spacing;
        const py = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 1.5;
        positions[idx * 3] = px;
        positions[idx * 3 + 1] = py;
        positions[idx * 3 + 2] = pz;
        originalY[idx] = py;
        idx++;
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x58c7c0,
      size: 0.14,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.rotation.x = Math.PI / 4;
    particles.position.set(0, -6, -2);
    scene.add(particles);

    let isVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible || prefersReducedMotion) return;

      const time = clock.getElapsedTime() * 0.8;
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < count * count; i++) {
        const x = i % count;
        const z = Math.floor(i / count);
        pos[i * 3 + 1] = originalY[i] + Math.sin(x * 0.25 + time) * 0.8 + Math.cos(z * 0.25 + time) * 0.8;
      }
      geometry.attributes.position.needsUpdate = true;
      particles.rotation.z = Math.sin(time * 0.2) * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="enquiry-3d-backdrop" aria-hidden="true">
      <canvas ref={canvasRef} className="enquiry-3d-canvas" />
    </div>
  );
}
