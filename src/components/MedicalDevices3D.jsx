import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Stethoscope, HeartPulse, Activity, CheckCircle2 } from 'lucide-react';
import { createPatientMonitor, createUltrasoundMachine, createSurgicalInstrumentSet } from '../utils/models';
import { PatientMonitorScreen } from '../utils/textures';

gsap.registerPlugin(ScrollTrigger);

export default function MedicalDevices3D() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [devicePhase, setDevicePhase] = useState(0);

  const deviceTypes = [
    {
      id: '01',
      title: 'Patient Monitoring Systems',
      subtitle: 'Multiparameter ICU & bedside vital signs monitoring',
      icon: HeartPulse,
      spec: 'Continuous cardiac telemetry with multi-lead waveform analysis, automated arrhythmia detection, and modular bedside parameter integration.',
      metrics: ['ECG Lead II Monitoring', 'SpO2 Pulse Oximetry', 'Non-Invasive Blood Pressure', 'Respiration Tracking'],
      telemetryTitle: 'MULTIPARAMETER PATIENT MONITOR • SERIES 7',
      telemetryStats: ['HR: 72 BPM', 'SpO2: 99%', 'NIBP: 120/80']
    },
    {
      id: '02',
      title: 'Diagnostic Imaging Devices',
      subtitle: 'Diagnostic ultrasound console & transducer probe',
      icon: Activity,
      spec: 'Mobile diagnostic ultrasound console equipped with high-resolution B-mode acoustic imaging, ergonomic control deck, and broadband convex probe.',
      metrics: ['Broadband Frequency Array', 'Ergonomic Control Deck', 'Acoustic Matching Lens', 'Real-Time Sonogram Display'],
      telemetryTitle: 'DIAGNOSTIC ULTRASOUND CONSOLE • B-MODE',
      telemetryStats: ['PROBE: C5-2 (3.5 MHz)', 'DEPTH: 16 cm', 'GAIN: 58 dB']
    },
    {
      id: '03',
      title: 'Clinical & Surgical Instruments',
      subtitle: 'Sterile surgical set: forceps, clamp & scalpel',
      icon: Stethoscope,
      spec: 'Precision surgical stainless steel instrument set including tissue forceps, hemostatic clamp, and medical scalpel arranged on a sterile clinical tray.',
      metrics: ['Medical Grade 316L Steel', 'Autoclavable Construction', 'Precision Serrations', 'Traceable Batch Control'],
      telemetryTitle: 'STERILE SURGICAL INSTRUMENT SET',
      telemetryStats: ['GRADE: 316L STEEL', 'AUTOCLAVABLE', 'SET: 3-PIECE']
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf7f9f8, 0.022);

    const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 13);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x58c7c0, 2.4);
    rimLight.position.set(-10, -3, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xe8f4f8, 1.1);
    fillLight.position.set(0, -6, 6);
    scene.add(fillLight);

    // Dynamic Patient Monitor Screen Controller (renders live ECG sinus rhythm)
    const monitorScreen = new PatientMonitorScreen();

    // -------------------------------------------------------------
    // THREE DISTINCT 3D MEDICAL MODELS FOR THE THREE CATEGORIES
    // -------------------------------------------------------------

    // Model 1: Multiparameter Patient Monitor
    const monitorGroup = new THREE.Group();
    const monitor = createPatientMonitor(monitorScreen);
    monitor.scale.set(0.95, 0.95, 0.95);
    monitorGroup.add(monitor);
    monitorGroup.position.set(0, -0.2, 0);
    scene.add(monitorGroup);

    // Model 2: Diagnostic Ultrasound Machine with Console, Sonogram Screen, and Probe
    const ultrasoundGroup = new THREE.Group();
    const ultrasound = createUltrasoundMachine();
    ultrasound.scale.set(0.85, 0.85, 0.85);
    ultrasoundGroup.add(ultrasound);
    ultrasoundGroup.position.set(0, 0, -25);
    scene.add(ultrasoundGroup);

    // Model 3: Professional Surgical Instrument Set on Sterile Tray
    const surgicalGroup = new THREE.Group();
    const surgicalSet = createSurgicalInstrumentSet();
    surgicalSet.scale.set(0.92, 0.92, 0.92);
    surgicalGroup.add(surgicalSet);
    surgicalGroup.position.set(0, -0.3, -25);
    scene.add(surgicalGroup);

    // Floor shadow receiver
    const shadowGeo = new THREE.PlaneGeometry(24, 24);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.14 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -3.2;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // Mouse pointer interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
      mouse.targetX = Math.max(-1, Math.min(1, x)) * 0.28;
      mouse.targetY = Math.max(-1, Math.min(1, y)) * 0.20;
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
            setDevicePhase(0);
          } else if (self.progress < 0.67) {
            setDevicePhase(1);
          } else {
            setDevicePhase(2);
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
            setDevicePhase(0);
          } else if (self.progress < 0.67) {
            setDevicePhase(1);
          } else {
            setDevicePhase(2);
          }
        }
      });
    });

    // Visibility observer
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

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const isMobile = window.innerWidth <= 768;

      // Update ECG telemetry waveform if Model 1 is active/near
      if (scrollProgress.val < 0.45) {
        monitorScreen.update(delta);
      }

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const p = Math.max(0, Math.min(1, scrollProgress.val));

      // Responsive base scaling & positioning to guarantee full product visibility without clipping
      const baseScale = isMobile ? 0.72 : 1.0;
      camera.fov = isMobile ? 42 : 40;
      camera.position.z = isMobile ? 13.8 : 13.0;
      camera.updateProjectionMatrix();

      // Idle float (suppressed if prefers-reduced-motion)
      const idleFloat = prefersReducedMotion ? 0 : Math.sin(time * 1.0) * 0.04;

      // -----------------------------------------------------------------
      // PHASE 1: PATIENT MONITOR (p: 0.00 -> 0.40, in focus: 0.00 -> 0.33)
      // -----------------------------------------------------------------
      if (p <= 0.40) {
        monitorGroup.visible = true;
        const t0 = Math.min(1, p / 0.33);

        // 1. EXACT 360° ROTATION around vertical axis
        const rotY = -0.15 + t0 * Math.PI * 2 + mouse.x * 0.35;
        monitorGroup.rotation.y = rotY;
        monitorGroup.rotation.x = -0.05 + mouse.y * 0.25;

        // 2. EXPLODED COMPONENT ANIMATION: Display, motherboard, and housing separate
        if (monitor.userData && monitor.userData.display && monitor.userData.housing && monitor.userData.internalBoard) {
          const exp = Math.sin(t0 * Math.PI) * 0.85;
          monitor.userData.display.position.z = exp * 1.1;
          monitor.userData.internalBoard.position.z = 0;
          monitor.userData.housing.position.z = -exp * 1.1;
          if (monitor.userData.stand) {
            monitor.userData.stand.position.y = -4.0 / 2 - 0.12 - exp * 0.45;
          }
        }

        // Exit transition towards Phase 2
        if (p > 0.30) {
          const exitNorm = (p - 0.30) / 0.10;
          monitorGroup.position.z = -exitNorm * 14;
          monitorGroup.scale.setScalar(Math.max(0.001, (1 - exitNorm * 0.6) * baseScale));
        } else {
          monitorGroup.position.set(0, -0.2 * baseScale + idleFloat, 0);
          monitorGroup.scale.setScalar(baseScale);
        }
      } else {
        monitorGroup.visible = false;
        monitorGroup.position.z = -50;
      }

      // -----------------------------------------------------------------
      // PHASE 2: DIAGNOSTIC ULTRASOUND MACHINE (p: 0.28 -> 0.72, in focus: 0.33 -> 0.67)
      // -----------------------------------------------------------------
      if (p >= 0.26 && p <= 0.74) {
        ultrasoundGroup.visible = true;
        const t1 = Math.min(1, Math.max(0, (p - 0.33) / 0.34));

        // 1. EXACT 360° ROTATION around vertical axis
        const rotY = -0.25 + t1 * Math.PI * 2 + mouse.x * 0.35;
        ultrasoundGroup.rotation.y = rotY;
        ultrasoundGroup.rotation.x = 0.06 + mouse.y * 0.2;

        // 2. ARTICULATED PROBE & MONITOR ANIMATION
        if (ultrasound.userData && ultrasound.userData.probe) {
          const lift = Math.sin(t1 * Math.PI);
          ultrasound.userData.probe.position.y = 0.5 + lift * 0.65;
          ultrasound.userData.probe.position.z = 0.7 + lift * 0.5;
          ultrasound.userData.probe.position.x = 2.4 - lift * 0.4;
          if (ultrasound.userData.monitor) {
            ultrasound.userData.monitor.rotation.y = Math.sin(t1 * Math.PI * 2) * 0.12;
          }
        }

        // Position: glides in from depth, stays centered, glides back out
        const distFromCenter = Math.abs(p - 0.50);
        ultrasoundGroup.position.z = 0.2 - distFromCenter * 16;
        ultrasoundGroup.position.x = mouse.x * 0.5;
        ultrasoundGroup.position.y = (isMobile ? -0.3 : 0) * baseScale + idleFloat;
        ultrasoundGroup.scale.setScalar(Math.max(0.001, (0.85 - distFromCenter * 0.7) * baseScale));
      } else {
        ultrasoundGroup.visible = false;
        ultrasoundGroup.position.z = -50;
      }

      // -----------------------------------------------------------------
      // PHASE 3: SURGICAL INSTRUMENT SET ON STERILE TRAY (p: 0.60 -> 1.00, in focus: 0.67 -> 1.00)
      // -----------------------------------------------------------------
      if (p >= 0.60) {
        surgicalGroup.visible = true;
        const t2 = Math.min(1, Math.max(0, (p - 0.67) / 0.33));

        // 1. EXACT 360° ROTATION around vertical axis
        // Tilted forward so surgical tray surface and all three tools are clearly visible
        surgicalGroup.rotation.x = 0.58 + mouse.y * 0.25;
        surgicalGroup.rotation.y = -0.2 + t2 * Math.PI * 2 + mouse.x * 0.35;
        surgicalGroup.rotation.z = Math.sin(t2 * Math.PI) * 0.06;

        // 2. INSTRUMENT ELEVATION ANIMATION: Scalpel, forceps & clamp lift and gleam
        if (surgicalSet.userData) {
          const elev = Math.sin(t2 * Math.PI) * 0.45;
          if (surgicalSet.userData.scalpel) surgicalSet.userData.scalpel.position.y = 0.12 + elev * 0.55;
          if (surgicalSet.userData.forceps) surgicalSet.userData.forceps.position.y = 0.12 + elev * 0.75;
          if (surgicalSet.userData.clamp) surgicalSet.userData.clamp.position.y = 0.14 + elev * 0.65;
        }

        // Entry transition from depth
        const normEntry = Math.min(1, (p - 0.60) / 0.10);
        surgicalGroup.position.z = -14 + normEntry * 14;
        surgicalGroup.position.x = mouse.x * 0.5;
        surgicalGroup.position.y = (-0.35 * baseScale) + idleFloat;
        surgicalGroup.scale.setScalar((0.72 + normEntry * 0.22) * baseScale);
      } else {
        surgicalGroup.visible = false;
        surgicalGroup.position.z = -50;
      }

      camera.lookAt(0, 0, 0);
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

  const currentDev = deviceTypes[devicePhase] || deviceTypes[0];

  return (
    <section className="devices-showcase-section" ref={sectionRef} id="devices">
      <div className="wrap devices-showcase-layout">
        {/* Information & Specifications Column with natural document flow */}
        <div className="devices-content-column">
          <div className="eyebrow">
            02 / MEDICAL DEVICES <span className="line" />
          </div>
          <h2>
            Medical technology
            <br />
            for <em>everyday care.</em>
          </h2>
          <p className="devices-intro-lead">
            Hospital-grade patient telemetry systems, diagnostic ultrasound equipment, and clinical instruments for healthcare providers and procurement teams.
          </p>

          <div className="device-cards-list">
            {deviceTypes.map((dev, i) => {
              const Icon = dev.icon;
              return (
                <div
                  key={dev.id}
                  className={`device-feature-card ${devicePhase === i ? 'active' : ''}`}
                >
                  <div className="card-top">
                    <span className="device-icon-box">
                      <Icon size={18} />
                    </span>
                    <div className="card-titles">
                      <span className="device-step-num">{dev.id} / 03</span>
                      <h4>{dev.title}</h4>
                      <small className="device-subtitle-text">{dev.subtitle}</small>
                    </div>
                  </div>
                  <p>{dev.spec}</p>
                  <div className="device-metrics-grid">
                    {dev.metrics.map(m => (
                      <span key={m} className="metric-pill">
                        <CheckCircle2 size={11} /> {m}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="devices-actions">
            <a className="btn dark" href="#enquiry">
              Explore medical devices <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Sticky 3D Medical Equipment Canvas Column */}
        <div className="devices-visual-column">
          <div className="devices-sticky-canvas-box">
            <canvas ref={canvasRef} className="devices-3d-canvas" />
            <div className="devices-telemetry-overlay">
              <div className="telemetry-chip">
                <span className="pulse-indicator" />
                <span>{currentDev.telemetryTitle}</span>
              </div>
              <div className="telemetry-stats">
                {currentDev.telemetryStats.map(s => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
