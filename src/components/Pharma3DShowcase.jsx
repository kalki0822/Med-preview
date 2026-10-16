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

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x58c7c0, 2.8);
    rimLight.position.set(-8, -4, -6);
    scene.add(rimLight);

    // 3D Objects for the 3 stages:
    // Stage 1: Big Showcase Capsule pair
    const capsuleGroup = new THREE.Group();
    const cap1 = createCapsule(0x18a99f, 0xffffff, 0.58, 1.2);
    cap1.position.set(-0.4, 0.3, 0);
    cap1.rotation.set(0.4, 0.3, 0.7);

    const cap2 = createCapsule(0xffffff, 0x103444, 0.5, 1.0);
    cap2.position.set(1.1, -0.6, 0.8);
    cap2.rotation.set(-0.3, 0.6, -0.4);

    capsuleGroup.add(cap1, cap2);
    capsuleGroup.position.set(0, 0, 0);
    scene.add(capsuleGroup);

    // Stage 2: 3D Blister Pack
    const blister = createBlisterPack();
    blister.scale.set(0.95, 0.95, 0.95);
    blister.position.set(0, 0, -8);
    blister.rotation.set(0.3, -0.4, 0.1);
    scene.add(blister);

    // Stage 3: 3D Medicine Bottle
    const bottle = createMedicineBottle();
    bottle.scale.set(1.1, 1.1, 1.1);
    bottle.position.set(0, -1.8, -12);
    bottle.rotation.set(0.08, 0.2, 0);
    scene.add(bottle);

    // Dynamic pointer interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
      mouse.targetX = x * 0.3;
      mouse.targetY = y * 0.2;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // GSAP ScrollTrigger scrubbing through 0.0 to 1.0 across the section
    let scrollProgress = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 30%',
      end: 'bottom 85%',
      scrub: 1.0,
      onUpdate: (self) => {
        scrollProgress.val = self.progress;

        if (self.progress < 0.35) {
          setActiveStage(0);
        } else if (self.progress < 0.72) {
          setActiveStage(1);
        } else {
          setActiveStage(2);
        }
      }
    });

    // Visibility observer to pause render loop
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

      // Stage transitions based on scroll progress:
      // Stage 1: Capsules
      if (p <= 0.45) {
        const localP = p / 0.45;
        capsuleGroup.position.z = -localP * 6;
        capsuleGroup.position.x = -localP * 3;
        capsuleGroup.rotation.y = localP * 1.8 + mouse.x + (prefersReducedMotion ? 0 : Math.sin(time * 0.6) * 0.08);
        capsuleGroup.rotation.x = localP * 0.6 + mouse.y;
        capsuleGroup.scale.setScalar(Math.max(0.001, 1 - localP * 0.5));
      } else {
        capsuleGroup.position.z = -100;
      }

      // Stage 2: Blister pack
      if (p >= 0.15 && p <= 0.82) {
        const distFromCenter = Math.abs(p - 0.52);
        blister.position.z = 2.0 - distFromCenter * 14;
        blister.position.y = -0.2 + (0.52 - p) * 1.5;
        blister.position.x = mouse.x * 1.2;
        blister.rotation.y = -0.4 + (p - 0.52) * 2.2 + mouse.x;
        blister.rotation.x = 0.2 + (p - 0.52) * 0.8 + mouse.y;
        blister.rotation.z = Math.sin((p - 0.2) * Math.PI) * 0.15;
        blister.scale.setScalar(Math.max(0.001, 1.1 - distFromCenter * 0.9));
      } else {
        blister.position.z = -100;
      }

      // Stage 3: Bottle
      if (p >= 0.5) {
        const norm = Math.min(1, (p - 0.5) / 0.42);
        bottle.position.z = -8 + norm * 8.5;
        bottle.position.x = mouse.x * 1.2;
        bottle.position.y = -1.8 + mouse.y;
        bottle.rotation.y = 0.2 + norm * 2.4 + mouse.x;
        bottle.rotation.x = mouse.y * 0.4;
        bottle.scale.setScalar(0.7 + norm * 0.35);
      } else {
        bottle.position.z = -100;
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
      trigger.kill();
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
