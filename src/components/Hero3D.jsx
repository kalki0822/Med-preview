import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createMedicineBottle, createBlisterPack, createCapsule } from '../utils/models';

gsap.registerPlugin(ScrollTrigger);

export default function Hero3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x102b3b, 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 14);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xd6e8eb, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x58c7c0, 3.2);
    rimLight.position.set(-10, -4, -6);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x73d7d0, 1.2, 20);
    fillLight.position.set(2, 4, 6);
    scene.add(fillLight);

    // Main 3D Composition Group
    const rootGroup = new THREE.Group();
    // Default position slightly offset to right to complement hero text on left
    rootGroup.position.set(2.4, -0.4, 0);
    scene.add(rootGroup);

    // 1. Medicine Bottle
    const bottle = createMedicineBottle();
    bottle.scale.set(0.9, 0.9, 0.9);
    bottle.position.set(-0.8, -1.8, -0.6);
    bottle.rotation.set(0.08, 0.45, -0.05);
    rootGroup.add(bottle);

    // 2. Blister Pack
    const blister = createBlisterPack();
    blister.scale.set(0.78, 0.78, 0.78);
    blister.position.set(2.0, -0.8, 1.2);
    blister.rotation.set(0.25, -0.55, 0.15);
    rootGroup.add(blister);

    // 3. Floating 3D Capsules (Separated in 3D space)
    const capsules = [];

    // Capsule 1 (Teal & White)
    const cap1 = createCapsule(0x18a99f, 0xffffff, 0.35, 0.7);
    cap1.position.set(0.6, 2.0, 2.0);
    cap1.rotation.set(0.6, 0.4, 0.8);
    rootGroup.add(cap1);
    capsules.push({ mesh: cap1, speedX: 0.7, speedY: 0.9, rotZ: 0.6 });

    // Capsule 2 (White & Navy)
    const cap2 = createCapsule(0xf0f7f7, 0x123647, 0.3, 0.6);
    cap2.position.set(-2.4, 1.2, 1.4);
    cap2.rotation.set(-0.4, -0.7, 0.3);
    rootGroup.add(cap2);
    capsules.push({ mesh: cap2, speedX: -0.6, speedY: 0.8, rotZ: -0.5 });

    // Capsule 3 (Gold & Teal)
    const cap3 = createCapsule(0x1fb5aa, 0xf6ad55, 0.28, 0.55);
    cap3.position.set(3.4, 1.6, -0.5);
    cap3.rotation.set(0.8, -0.3, -0.4);
    rootGroup.add(cap3);
    capsules.push({ mesh: cap3, speedX: 0.5, speedY: -0.7, rotZ: 0.4 });

    // Capsule 4 (Small background capsule)
    const cap4 = createCapsule(0xffffff, 0x58c7c0, 0.24, 0.48);
    cap4.position.set(-1.8, -1.2, -1.8);
    cap4.rotation.set(0.2, 0.9, 0.1);
    rootGroup.add(cap4);
    capsules.push({ mesh: cap4, speedX: -0.4, speedY: -0.5, rotZ: 0.3 });

    // Floor Contact Shadow plane
    const shadowGeo = new THREE.PlaneGeometry(16, 16);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.8;
    shadowPlane.receiveShadow = true;
    rootGroup.add(shadowPlane);

    // Responsive positioning adjustment for mobile/desktop
    const updateLayout = () => {
      const isMobile = window.innerWidth <= 768;
      const isNarrowMobile = window.innerWidth <= 480;
      if (isNarrowMobile) {
        rootGroup.position.set(0, -1.3, -2.8);
        rootGroup.scale.set(0.62, 0.62, 0.62);
        camera.fov = 44;
      } else if (isMobile) {
        rootGroup.position.set(0, -1.2, -2.5);
        rootGroup.scale.set(0.70, 0.70, 0.70);
        camera.fov = 42;
      } else if (window.innerWidth <= 1024) {
        rootGroup.position.set(1.4, -0.6, -0.5);
        rootGroup.scale.set(0.85, 0.85, 0.85);
        camera.fov = 40;
      } else {
        rootGroup.position.set(2.5, -0.4, 0);
        rootGroup.scale.set(1, 1, 1);
        camera.fov = 40;
      }
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    updateLayout();

    // Mouse pointer parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
      mouse.targetX = x * 0.35;
      mouse.targetY = y * 0.25;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // GSAP ScrollTrigger - Smooth Continuous Scrubbing
    let scrollProgress = { val: 0 };
    const heroEl = document.querySelector('.hero');

    const trigger = ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgress.val = self.progress;
      }
    });

    // Animation & Render Loop with visibility checking
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth pointer interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Base idle breathing (only if not prefers-reduced-motion)
      const floatY = prefersReducedMotion ? 0 : Math.sin(time * 1.4) * 0.12;
      const floatRotY = prefersReducedMotion ? 0 : Math.sin(time * 0.8) * 0.06;

      const p = scrollProgress.val;

      // 1. Overall Root Group continuous 3D rotation & depth translation
      rootGroup.rotation.y = floatRotY + mouse.x + p * 0.85;
      rootGroup.rotation.x = mouse.y - p * 0.35;
      rootGroup.rotation.z = Math.sin(p * Math.PI) * 0.12;

      // 2. Exploded layer separation on scroll
      // Blister pack moves forward into view and rotates
      blister.position.z = 1.2 + p * 2.8;
      blister.position.x = 2.0 + p * 1.2;
      blister.position.y = -0.8 + floatY * 0.5 + p * 0.6;
      blister.rotation.y = -0.55 + p * 0.6;
      blister.rotation.x = 0.25 - p * 0.3;

      // Bottle moves back and rotates to present Swiss label
      bottle.position.z = -0.6 - p * 2.0;
      bottle.position.x = -0.8 - p * 1.0;
      bottle.position.y = -1.8 + floatY * 0.8;
      bottle.rotation.y = 0.45 + p * 1.2;

      // Orbiting capsules separate and drift outward in 3D parallax
      capsules.forEach((cap, i) => {
        const factor = (i + 1) * 0.8;
        cap.mesh.position.y += Math.sin(time * cap.speedY) * 0.003;
        cap.mesh.rotation.x += cap.rotZ * 0.008;
        cap.mesh.rotation.y += cap.rotZ * 0.01;

        // Scroll separation expansion
        cap.mesh.position.z += (p * factor * 1.5 - (cap.mesh.userData.prevScrollZ || 0));
        cap.mesh.userData.prevScrollZ = p * factor * 1.5;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Window resize handler
    const onResize = () => {
      updateLayout();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      trigger.kill();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div className="hero-3d-container" ref={containerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="hero-3d-canvas" />
    </div>
  );
}
