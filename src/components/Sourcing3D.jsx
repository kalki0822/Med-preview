import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, PackageCheck, ArrowUpRight, Truck, Thermometer, ShieldCheck, Globe2 } from 'lucide-react';
import { createColdChainCrate } from '../utils/models';

gsap.registerPlugin(ScrollTrigger);

export default function Sourcing3D({ sourcingImage }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const bg = bgRef.current;
    if (!section || !canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x102d3c, 0.03);

    const camera = new THREE.PerspectiveCamera(38, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xd5e6ea, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(8, 10, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x58c7c0, 2.4);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);

    // 3D Cold-chain Crate Group
    const crateGroup = new THREE.Group();
    const crate = createColdChainCrate();
    crate.scale.set(0.95, 0.95, 0.95);
    crate.rotation.set(0.2, -0.45, 0.08);
    crateGroup.add(crate);
    scene.add(crateGroup);

    // Mouse pointer interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
      mouse.targetX = x * 0.3;
      mouse.targetY = y * 0.2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // GSAP ScrollTrigger
    let scrollProgress = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgress.val = self.progress;

        // Background Parallax
        if (bg) {
          const yPos = (self.progress - 0.5) * 80;
          bg.style.transform = `translateY(${yPos}px) scale(1.08)`;
        }
      }
    });

    // Visibility observer
    let isVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(section);

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const p = scrollProgress.val;

      // Continuous 3D rotation and depth translation responding to scroll
      crate.rotation.y = -0.45 + (p - 0.5) * 1.4 + mouse.x + (prefersReducedMotion ? 0 : Math.sin(time * 0.8) * 0.05);
      crate.rotation.x = 0.2 + (p - 0.5) * 0.6 + mouse.y;
      crate.rotation.z = Math.sin((p - 0.5) * Math.PI) * 0.1;

      // Moves forward in depth as user scrolls
      crateGroup.position.z = (p - 0.5) * 3.5;
      crateGroup.position.x = mouse.x * 0.8;
      crateGroup.position.y = (p - 0.5) * -0.8 + mouse.y * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!canvas) return;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
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
    <section className="sourcing-3d-section" ref={sectionRef} id="sourcing">
      <div className="wrap sourcing-3d-layout">
        {/* Visual Composite Box */}
        <div className="sourcing-visual-stage">
          {/* Layer 1: Real Warehouse Distribution Image with Parallax */}
          <div className="sourcing-bg-layer" ref={bgRef}>
            <img
              src={sourcingImage}
              alt="Pharmaceutical warehouse logistics and supply distribution"
              loading="lazy"
            />
            <div className="sourcing-backdrop-shade" />
          </div>

          {/* Layer 2: 3D Cold-Chain Crate Canvas */}
          <div className="sourcing-canvas-wrapper">
            <canvas ref={canvasRef} className="sourcing-3d-canvas" />
          </div>

          {/* Layer 3: Logistics Telemetry Badges */}
          <div className="sourcing-hud-overlay">
            <div className="sourcing-hud-badge top">
              <Thermometer size={16} />
              <div>
                <strong>TEMPERATURE-CONTROLLED STORAGE</strong>
                <small>2°C – 8°C Monitored Logistics</small>
              </div>
            </div>

            <div className="sourcing-hud-badge bottom">
              <Truck size={18} />
              <div>
                <strong>Qualified Distribution Network</strong>
                <small>Wholesale supply & procurement</small>
              </div>
            </div>
          </div>
        </div>

        {/* Copy & Sourcing Actions */}
        <div className="sourcing-copy-col">
          <div className="eyebrow">
            03 / PRODUCT SOURCING <span className="line" />
          </div>
          <h2>
            Buy. Sell.
            <br />
            <em>Source smarter.</em>
          </h2>
          <p className="sourcing-lead-text">
            Connect pharmaceutical product requirements with verified manufacturers and distributors. We assist healthcare buyers and suppliers with compliant procurement, product availability, and commercial distribution.
          </p>

          <div className="sourcing-actions-list">
            <a href="#enquiry" className="sourcing-action-item">
              <span className="action-icon">
                <Search size={18} />
              </span>
              <div className="action-text">
                <strong>Find a product</strong>
                <small>Submit a targeted buyer requirement or request for quotation</small>
              </div>
              <ArrowUpRight size={18} />
            </a>

            <a href="#enquiry" className="sourcing-action-item">
              <span className="action-icon">
                <PackageCheck size={18} />
              </span>
              <div className="action-text">
                <strong>Offer a product</strong>
                <small>Register product inventory for wholesale distribution</small>
              </div>
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="sourcing-cert-tags">
            <span>
              <ShieldCheck size={14} /> Controlled Warehousing
            </span>
            <span>
              <Globe2 size={14} /> International Distribution
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
