import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Pill, CheckCircle2 } from 'lucide-react';
import { createMedicineBottle, createBlisterPack, createCapsule } from '../utils/models';

gsap.registerPlugin(ScrollTrigger);

export default function Pharma3DShowcase() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      step: '01',
      title: 'Tablets & Capsules',
      subtitle: 'Oral solid dosage formulations',
      desc: 'Bioequivalent capsules, modified-release tablets, and pharmaceutical raw materials produced to international pharmacopeia standards.',
      tags: ['Capsules & coated tablets', 'Modified release', 'Controlled bioavailability']
    },
    {
      step: '02',
      title: 'Packaged Medicines',
      subtitle: 'Thermoformed barrier packaging',
      desc: 'Commercial blister packaging with aluminum barrier lidding, unit-dose lot serialization, and multi-climate stability protection.',
      tags: ['Alu-Alu & PVC/PVDC blisters', 'Unit-dose serialization', 'Tamper-evident sealing']
    },
    {
      step: '03',
      title: 'Pharmaceutical Wholesale Supply',
      subtitle: 'Standardized bottles & clinical containers',
      desc: 'Light-protective amber containers and clinical bottles engineered for active ingredient stability and commercial wholesale distribution.',
      tags: ['Light-barrier PET & glass', 'Child-resistant closures', 'Wholesale batch quantities']
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xeaf1f1, 0.025);

    const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 11);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x58c7c0, 2.6);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xdcf0ee, 1.2);
    fillLight.position.set(0, -6, 6);
    scene.add(fillLight);

    // -------------------------------------------------------------
    // 3D MODELS FOR THE THREE PHARMACEUTICAL STAGES
    // -------------------------------------------------------------

    // Stage 1: Featured 3D Capsule with Explodable Shell & Internal Pellets
    const capsuleGroup = new THREE.Group();
    // Featured primary capsule
    const cap1 = createCapsule(0x18a99f, 0xffffff, 0.58, 1.25, true);
    cap1.position.set(0, 0.1, 0);
    cap1.rotation.set(0.2, 0.2, 0.45);

    // Companion capsule for aesthetic depth
    const cap2 = createCapsule(0xffffff, 0x103444, 0.44, 0.95, false);
    cap2.position.set(1.4, -0.7, -0.6);
    cap2.rotation.set(-0.35, 0.6, -0.4);

    capsuleGroup.add(cap1, cap2);
    capsuleGroup.position.set(0, 0, 0);
    scene.add(capsuleGroup);

    // Stage 2: 3D Blister Pack (with separable foil, PVC tray, and tablets)
    const blister = createBlisterPack();
    blister.scale.set(0.92, 0.92, 0.92);
    blister.position.set(0, 0, -20);
    blister.rotation.set(0.2, -0.3, 0.1);
    scene.add(blister);

    // Stage 3: 3D Medicine Wholesale Bottle
    const bottle = createMedicineBottle();
    bottle.scale.set(1.05, 1.05, 1.05);
    bottle.position.set(0, -1.8, -25);
    bottle.rotation.set(0.08, 0.2, 0);
    scene.add(bottle);

    // Dynamic pointer interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
      mouse.targetX = Math.max(-1, Math.min(1, x)) * 0.25;
      mouse.targetY = Math.max(-1, Math.min(1, y)) * 0.18;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Scroll progress container
    const scrollProgress = { val: 0 };

    // GSAP MatchMedia for responsive scroll synchronization
    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {
      // Desktop ScrollTrigger
      return ScrollTrigger.create({
        trigger: section,
        start: 'top 20%',
        end: 'bottom 85%',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgress.val = self.progress;
          if (self.progress < 0.33) {
            setActiveStage(0);
          } else if (self.progress < 0.67) {
            setActiveStage(1);
          } else {
            setActiveStage(2);
          }
        }
      });
    });

    mm.add('(max-width: 768px)', () => {
      // Mobile ScrollTrigger - calibrated to when cards scroll through viewport
      return ScrollTrigger.create({
        trigger: section,
        start: 'top 70px',
        end: 'bottom bottom',
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgress.val = self.progress;
          if (self.progress < 0.33) {
            setActiveStage(0);
          } else if (self.progress < 0.67) {
            setActiveStage(1);
          } else {
            setActiveStage(2);
          }
        }
      });
    });

    // Visibility observer to pause render loop when offscreen
    let isVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.02 });
    observer.observe(section);

    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();
      const isMobile = window.innerWidth <= 768;

      // Smooth pointer interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const p = Math.max(0, Math.min(1, scrollProgress.val));

      // Responsive base scaling & positioning to ensure 100% visibility without clipping
      const baseScale = isMobile ? 0.78 : 1.0;
      camera.fov = isMobile ? 42 : 40;
      camera.position.z = isMobile ? 12.2 : 11.0;
      camera.updateProjectionMatrix();

      // Idle float (suppressed if prefers-reduced-motion)
      const idleFloat = prefersReducedMotion ? 0 : Math.sin(time * 1.2) * 0.05;

      // -------------------------------------------------------------
      // STAGE 1: FEATURED CAPSULE (p: 0.00 -> 0.38, in focus: 0.00 -> 0.33)
      // -------------------------------------------------------------
      if (p <= 0.40) {
        capsuleGroup.visible = true;
        const t0 = Math.min(1, p / 0.33);

        // 1. EXACT 360° ROTATION around vertical axis
        const rotY = t0 * Math.PI * 2 + (prefersReducedMotion ? 0 : Math.sin(time * 0.5) * 0.04);
        capsuleGroup.rotation.y = rotY + mouse.x * 0.4;
        capsuleGroup.rotation.x = 0.15 + mouse.y * 0.3;
        capsuleGroup.rotation.z = Math.sin(t0 * Math.PI) * 0.12;

        // 2. EXPLODED COMPONENT ANIMATION: Shell halves separate to reveal internal pellets
        if (cap1.userData && cap1.userData.topHalf && cap1.userData.bottomHalf) {
          // Explode peaks at middle of Stage 1 (t0 ~ 0.5) and reassembles smoothly
          const explodeFactor = Math.sin(t0 * Math.PI);
          cap1.userData.topHalf.position.y = explodeFactor * 0.55;
          cap1.userData.bottomHalf.position.y = -explodeFactor * 0.55;
          if (cap1.userData.band) {
            cap1.userData.band.scale.setScalar(Math.max(0.01, 1 - explodeFactor * 1.4));
          }
          if (cap1.userData.pellets) {
            cap1.userData.pellets.scale.setScalar(1 + explodeFactor * 0.35);
          }
        }

        // Companion capsule movement
        cap2.position.x = 1.3 + Math.sin(t0 * Math.PI) * 0.3;
        cap2.position.y = -0.65 + idleFloat;

        // Exit transition towards Stage 2
        if (p > 0.30) {
          const exitNorm = (p - 0.30) / 0.10;
          capsuleGroup.position.z = -exitNorm * 12;
          capsuleGroup.scale.setScalar(Math.max(0.001, (1 - exitNorm * 0.6) * baseScale));
        } else {
          capsuleGroup.position.set(0, idleFloat, 0);
          capsuleGroup.scale.setScalar(baseScale);
        }
      } else {
        capsuleGroup.visible = false;
        capsuleGroup.position.z = -50;
      }

      // -------------------------------------------------------------
      // STAGE 2: 3D BLISTER PACK (p: 0.28 -> 0.72, in focus: 0.33 -> 0.67)
      // -------------------------------------------------------------
      if (p >= 0.26 && p <= 0.74) {
        blister.visible = true;
        const t1 = Math.min(1, Math.max(0, (p - 0.33) / 0.34));

        // 1. EXACT 360° ROTATION around vertical axis
        const rotY = -0.3 + t1 * Math.PI * 2 + mouse.x * 0.4;
        blister.rotation.y = rotY;
        blister.rotation.x = 0.2 + mouse.y * 0.3;
        blister.rotation.z = Math.sin(t1 * Math.PI) * 0.08;

        // 2. EXPLODED COMPONENT ANIMATION: Foil, PVC tray, and tablets separate in depth
        if (blister.userData && blister.userData.foil && blister.userData.pvc && blister.userData.tablets) {
          const blisterExplode = Math.sin(t1 * Math.PI) * 0.75;
          blister.userData.foil.position.z = -blisterExplode * 0.85;
          blister.userData.pvc.position.z = blisterExplode * 0.85;
          blister.userData.tablets.position.z = 0;
        }

        // Position: glides in from z = -14, stays centered, glides out to z = -14
        const distFromCenter = Math.abs(p - 0.50);
        blister.position.z = 0.2 - distFromCenter * 16;
        blister.position.y = idleFloat * 0.7;
        blister.position.x = mouse.x * 0.5;
        blister.scale.setScalar(Math.max(0.001, (0.92 - distFromCenter * 0.8) * baseScale));
      } else {
        blister.visible = false;
        blister.position.z = -50;
      }

      // -------------------------------------------------------------
      // STAGE 3: MEDICINE WHOLESALE BOTTLE (p: 0.62 -> 1.00, in focus: 0.67 -> 1.00)
      // -------------------------------------------------------------
      if (p >= 0.60) {
        bottle.visible = true;
        const t2 = Math.min(1, Math.max(0, (p - 0.67) / 0.33));

        // 1. EXACT 360° ROTATION revealing full label wrap & specifications
        const rotY = 0.15 + t2 * Math.PI * 2 + mouse.x * 0.4;
        bottle.rotation.y = rotY;
        bottle.rotation.x = mouse.y * 0.25;

        // Entry transition from depth
        const normEntry = Math.min(1, (p - 0.60) / 0.10);
        bottle.position.z = -14 + normEntry * 14;
        bottle.position.x = mouse.x * 0.5;
        bottle.position.y = -1.6 * baseScale + idleFloat;
        bottle.scale.setScalar((0.75 + normEntry * 0.3) * baseScale);
      } else {
        bottle.visible = false;
        bottle.position.z = -50;
      }

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
      mm.revert();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return (
    <section className="pharma-showcase-section" ref={sectionRef} id="pharma">
      <div className="wrap pharma-showcase-layout">
        {/* Sticky Visual Column */}
        <div className="pharma-visual-column">
          <div className="pharma-sticky-canvas-box">
            <canvas ref={canvasRef} className="pharma-3d-canvas" />
            <div className="pharma-canvas-badge">
              <Pill size={15} />
              <span>PHARMACEUTICAL PRODUCTS</span>
            </div>
          </div>
        </div>

        {/* Content Column with natural document flow */}
        <div className="pharma-content-column">
          <div className="eyebrow">
            01 / PHARMACEUTICALS <span className="line" />
          </div>
          <h2>
            Product discovery
            <br />
            with <em>clarity.</em>
          </h2>
          <p className="pharma-intro-lead">
            Browse pharmaceutical formulations, blister packaging, and wholesale supply specifications across primary therapeutic categories.
          </p>

          <div className="pharma-stages-container">
            {stages.map((stage, i) => (
              <div
                key={stage.step}
                className={`pharma-stage-card ${activeStage === i ? 'active' : ''}`}
              >
                <div className="stage-header">
                  <span className="stage-num">{stage.step} / 03</span>
                  <div>
                    <h4>{stage.title}</h4>
                    <small>{stage.subtitle}</small>
                  </div>
                </div>
                <p>{stage.desc}</p>
                <div className="stage-tags">
                  {stage.tags.map(tag => (
                    <span key={tag}>
                      <CheckCircle2 size={12} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pharma-actions">
            <a className="btn dark" href="#enquiry">
              Enquire about products <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
