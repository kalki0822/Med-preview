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

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x58c7c0, 2.4);
    rimLight.position.set(-10, -3, -5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xe8f4f8, 1.0);
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
    monitor.scale.set(0.96, 0.96, 0.96);
    monitorGroup.add(monitor);
    monitorGroup.position.set(0, -0.2, 0);
    scene.add(monitorGroup);

    // Model 2: Diagnostic Ultrasound Machine with Console, Sonogram Screen, and Probe
    const ultrasoundGroup = new THREE.Group();
    const ultrasound = createUltrasoundMachine();
    ultrasound.scale.set(0.85, 0.85, 0.85);
    ultrasoundGroup.add(ultrasound);
    ultrasoundGroup.position.set(0, 0, -25); // initially placed in depth
    scene.add(ultrasoundGroup);

    // Model 3: Professional Surgical Instrument Set on Sterile Tray
    const surgicalGroup = new THREE.Group();
    const surgicalSet = createSurgicalInstrumentSet();
    surgicalSet.scale.set(0.92, 0.92, 0.92);
    surgicalGroup.add(surgicalSet);
    surgicalGroup.position.set(0, -0.3, -25); // initially placed in depth
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
      const x = (e.clientX - rect.left) / rect.width * 2 - 1;
      const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
      mouse.targetX = x * 0.35;
      mouse.targetY = y * 0.25;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // GSAP ScrollTrigger scrubbing across the section
    let scrollProgress = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 30%',
      end: 'bottom 85%',
      scrub: 1.0,
      onUpdate: (self) => {
        scrollProgress.val = self.progress;
        if (self.progress < 0.38) {
          setDevicePhase(0);
        } else if (self.progress < 0.72) {
          setDevicePhase(1);
        } else {
          setDevicePhase(2);
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

      // Update ECG telemetry waveform if Model 1 is active/near
      if (scrollProgress.val < 0.5) {
        monitorScreen.update(delta);
      }

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      const p = scrollProgress.val;

      // -----------------------------------------------------------------
      // SMOOTH TRANSITIONS BETWEEN THE THREE DISTINCT INSTRUMENT MODELS
      // -----------------------------------------------------------------

      // Phase 1: Patient Monitor (Active at p: 0.0 -> 0.38)
      if (p <= 0.44) {
        const localP = p / 0.44; // 0 to 1 as it exits
        monitorGroup.position.z = -localP * 10;
        monitorGroup.position.x = -localP * 4 + mouse.x;
        monitorGroup.position.y = -0.2 + mouse.y * 0.3;
        monitorGroup.rotation.y = 0.25 + (prefersReducedMotion ? 0 : Math.sin(time * 0.6) * 0.06) + mouse.x * 0.4 + localP * 0.5;
        monitorGroup.rotation.x = -0.05 + mouse.y * 0.2;
        monitorGroup.scale.setScalar(Math.max(0.001, 1 - localP * 0.45));
        monitorGroup.visible = true;
      } else {
        monitorGroup.visible = false;
        monitorGroup.position.z = -50;
      }

      // Phase 2: Diagnostic Ultrasound Machine (Active at p: 0.30 -> 0.76, centered at 0.52)
      if (p >= 0.20 && p <= 0.82) {
        const distFromCenter = Math.abs(p - 0.52);
        ultrasoundGroup.visible = true;
        // Position smoothly reaches center (z = 0, x = 0, y = 0.1) at p = 0.52
        ultrasoundGroup.position.z = 0.5 - distFromCenter * 16;
        ultrasoundGroup.position.x = (0.52 - p) * 3 + mouse.x * 0.8;
        ultrasoundGroup.position.y = 0.1 + (0.52 - p) * 1.2 + mouse.y * 0.3;
        ultrasoundGroup.rotation.y = -0.22 + (p - 0.52) * 1.6 + mouse.x * 0.4 + (prefersReducedMotion ? 0 : Math.sin(time * 0.7) * 0.05);
        ultrasoundGroup.rotation.x = 0.08 + mouse.y * 0.2;
        ultrasoundGroup.scale.setScalar(Math.max(0.001, 0.9 - distFromCenter * 0.7));
      } else {
        ultrasoundGroup.visible = false;
        ultrasoundGroup.position.z = -50;
      }

      // Phase 3: Surgical Instrument Set on Sterile Tray (Active at p: 0.60 -> 1.0, centered at 0.88)
      if (p >= 0.55) {
        const norm = Math.min(1, (p - 0.55) / 0.38); // 0 at entry, 1 at destination
        surgicalGroup.visible = true;
        surgicalGroup.position.z = -12 + norm * 12.8;
        surgicalGroup.position.x = mouse.x * 0.8;
        surgicalGroup.position.y = -0.5 + norm * 0.3 + mouse.y * 0.3;
        // Tilted forward so tray surface and all 3 surgical tools are clearly visible
        surgicalGroup.rotation.x = 0.62 + mouse.y * 0.3;
        surgicalGroup.rotation.y = -0.18 + norm * 0.25 + mouse.x * 0.4 + (prefersReducedMotion ? 0 : Math.sin(time * 0.5) * 0.04);
        surgicalGroup.rotation.z = Math.sin(norm * Math.PI * 0.5) * 0.08;
        surgicalGroup.scale.setScalar(0.72 + norm * 0.26);
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
      trigger.kill();
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
