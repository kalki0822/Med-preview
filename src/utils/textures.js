import * as THREE from 'three';

/**
 * Generates a high-resolution, photorealistic pharmaceutical bottle label texture
 */
export function createBottleLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Background - Clean clinical white with subtle medical teal header
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top header band (Medical Teal)
  const headerGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
  headerGrad.addColorStop(0, '#103949');
  headerGrad.addColorStop(0.5, '#1e556b');
  headerGrad.addColorStop(1, '#103949');
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, canvas.width, 90);

  // Teal accent line
  ctx.fillStyle = '#58c7c0';
  ctx.fillRect(0, 90, canvas.width, 10);

  // Brand on header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "DM Sans", sans-serif';
  ctx.fillText('MEDSOURCE', 40, 58);

  ctx.fillStyle = '#65d3cb';
  ctx.font = '600 20px "DM Sans", sans-serif';
  ctx.fillText('PHARMACEUTICALS', 280, 58);

  // Rx Only badge
  ctx.fillStyle = '#e8f6f5';
  ctx.fillRect(860, 25, 120, 42);
  ctx.strokeStyle = '#58c7c0';
  ctx.lineWidth = 2;
  ctx.strokeRect(860, 25, 120, 42);
  ctx.fillStyle = '#103949';
  ctx.font = 'bold 22px "DM Sans", sans-serif';
  ctx.fillText('Rx ONLY', 875, 54);

  // Product Name (Hero typography)
  ctx.fillStyle = '#0f2c3d';
  ctx.font = 'bold 54px "DM Sans", sans-serif';
  ctx.fillText('AMIDOPYRINE USP', 40, 185);

  ctx.fillStyle = '#2d6a7d';
  ctx.font = '600 26px "DM Sans", sans-serif';
  ctx.fillText('Extended Release Tablets • 500 mg', 40, 225);

  // Clinical specs divider
  ctx.fillStyle = '#e1ebeb';
  ctx.fillRect(40, 250, 944, 2);

  // Specs Columns
  ctx.fillStyle = '#4f6c7a';
  ctx.font = '500 18px "DM Sans", sans-serif';
  ctx.fillText('DOSAGE & ADMINISTRATION: Refer to prescribing info', 40, 290);
  ctx.fillText('STORAGE: 20°C to 25°C (68°F to 77°F); excursions permitted to 15-30°C', 40, 320);
  ctx.fillText('NDC 70412-402-90  |  100 TABLETS  |  TAMPER-EVIDENT SEAL', 40, 350);

  // Barcode simulation
  ctx.fillStyle = '#102d3c';
  const startX = 40;
  const barcodeY = 385;
  const barcodeHeight = 70;
  for (let x = startX; x < startX + 320; x += 4) {
    if (Math.random() > 0.3) {
      const barWidth = Math.random() > 0.7 ? 3 : 1.5;
      ctx.fillRect(x, barcodeY, barWidth, barcodeHeight);
    }
  }
  ctx.font = '14px monospace';
  ctx.fillText('(01) 00370412402909 (17) 291031 (10) MS894', 40, 480);

  // Batch / Security hologram simulation on right side
  const holoGrad = ctx.createLinearGradient(780, 375, 980, 480);
  holoGrad.addColorStop(0, '#d1f2ee');
  holoGrad.addColorStop(0.25, '#c3e8e4');
  holoGrad.addColorStop(0.5, '#e4f7f5');
  holoGrad.addColorStop(0.75, '#bfe3df');
  holoGrad.addColorStop(1, '#d5f5f1');
  ctx.fillStyle = holoGrad;
  ctx.fillRect(780, 375, 204, 85);
  ctx.strokeStyle = '#58c7c0';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(780, 375, 204, 85);

  ctx.fillStyle = '#144654';
  ctx.font = 'bold 15px "DM Sans", sans-serif';
  ctx.fillText('AUTHENTIC PHARMA', 805, 410);
  ctx.font = '12px "DM Sans", sans-serif';
  ctx.fillText('SECURITY LOT: #MS-94022', 805, 435);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

/**
 * Generates an aluminum blister pack foil texture with printed lot codes and metallic crosshatch
 */
export function createBlisterFoilTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Brushed aluminum base
  ctx.fillStyle = '#dce3e6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Crosshatch texture
  ctx.strokeStyle = '#cdd6da';
  ctx.lineWidth = 1;
  for (let i = -1024; i < 2048; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 1024, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 1024);
    ctx.lineTo(i + 1024, 0);
    ctx.stroke();
  }

  // Medical branding repeated across the foil
  ctx.save();
  ctx.rotate(-0.15);
  ctx.fillStyle = 'rgba(16, 57, 73, 0.45)';
  ctx.font = 'bold 22px "DM Sans", sans-serif';
  for (let y = -200; y < 1400; y += 140) {
    for (let x = -200; x < 1400; x += 320) {
      ctx.fillText('MEDSOURCE • 500mg', x, y);
      ctx.font = '14px monospace';
      ctx.fillText('LOT MS-90422 EXP 2029-11', x, y + 25);
      ctx.font = 'bold 22px "DM Sans", sans-serif';
    }
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates dynamic, real-time medical patient monitor telemetry screen
 */
export class PatientMonitorScreen {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 768;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.anisotropy = 4;

    this.scanX = 0;
    this.points = [];
    this.time = 0;
    this.hr = 72;
    this.spo2 = 99;
    this.bp = '120/80';
    this.resp = 16;
  }

  update(delta) {
    this.time += delta;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark clinical display background
    ctx.fillStyle = '#06121a';
    ctx.fillRect(0, 0, w, h);

    // Subtle medical telemetry grid
    ctx.strokeStyle = '#0e2633';
    ctx.lineWidth = 1;
    const gridSize = 32;
    ctx.beginPath();
    for (let x = 0; x < w; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Top status header
    ctx.fillStyle = '#0a212f';
    ctx.fillRect(0, 0, w, 56);
    ctx.fillStyle = '#58c7c0';
    ctx.font = 'bold 22px "DM Sans", sans-serif';
    ctx.fillText('MEDSOURCE PATIENT MONITOR • SERIES 7', 24, 37);

    ctx.fillStyle = '#789ba8';
    ctx.font = '18px "DM Sans", sans-serif';
    ctx.fillText('BED 04 • ICU CARDIAC UNIT', 620, 37);

    // Green ECG Waveform (Lead II)
    const ecgBaseY = 220;
    const ecgSpeed = 160; // px per second
    this.scanX = (this.scanX + ecgSpeed * delta) % (w - 320);

    // Heartbeat waveform calculation
    const cycle = (this.time * 1.2) % 1;
    let waveVal = 0;
    if (cycle > 0.15 && cycle < 0.2) {
      // P wave
      waveVal = Math.sin((cycle - 0.15) / 0.05 * Math.PI) * 16;
    } else if (cycle >= 0.22 && cycle < 0.24) {
      // Q dip
      waveVal = -18;
    } else if (cycle >= 0.24 && cycle < 0.29) {
      // R spike
      waveVal = 110;
    } else if (cycle >= 0.29 && cycle < 0.32) {
      // S dip
      waveVal = -35;
    } else if (cycle >= 0.4 && cycle < 0.52) {
      // T wave
      waveVal = Math.sin((cycle - 0.4) / 0.12 * Math.PI) * 28;
    }

    this.points.push({ x: this.scanX, y: ecgBaseY - waveVal });
    if (this.points.length > 360) this.points.shift();

    // Draw ECG Lead label
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('ECG LEAD II (mV)', 24, 110);

    // Draw active ECG glow line
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      if (Math.abs(p.x - this.scanX) < 15 && i > 0) {
        started = false;
        continue;
      }
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Cyan Pleth / SpO2 pulse wave (bottom wave)
    const plethBaseY = 460;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('PLETH / SpO2 PULSE WAVE', 24, 350);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    for (let x = 24; x < w - 340; x += 6) {
      const plethCycle = ((x / 140) - this.time * 1.4) % (Math.PI * 2);
      const wave = Math.sin(plethCycle) * 35 * Math.max(0, Math.sin(plethCycle * 0.5));
      const py = plethBaseY - wave;
      if (x === 24) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Right Side Telemetry Readout Panel
    ctx.fillStyle = '#0a1d29';
    ctx.fillRect(w - 300, 56, 300, h - 56);
    ctx.strokeStyle = '#18384b';
    ctx.lineWidth = 2;
    ctx.strokeRect(w - 300, 56, 300, h - 56);

    // HR Card
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 18px "DM Sans", sans-serif';
    ctx.fillText('PULSE RATE (BPM)', w - 280, 110);
    ctx.font = 'bold 78px monospace';
    ctx.fillText(String(this.hr), w - 280, 185);

    // SpO2 Card
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px "DM Sans", sans-serif';
    ctx.fillText('SpO2 (%)', w - 280, 270);
    ctx.font = 'bold 78px monospace';
    ctx.fillText(String(this.spo2), w - 280, 345);

    // NIBP Card
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px "DM Sans", sans-serif';
    ctx.fillText('NIBP (mmHg)', w - 280, 430);
    ctx.font = 'bold 52px monospace';
    ctx.fillText(this.bp, w - 280, 495);

    // RESP Card
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 18px "DM Sans", sans-serif';
    ctx.fillText('RESP RATE (/min)', w - 280, 575);
    ctx.font = 'bold 52px monospace';
    ctx.fillText(String(this.resp), w - 280, 640);

    // Bottom telemetry status bar
    ctx.fillStyle = '#0f2939';
    ctx.fillRect(0, h - 60, w - 300, 60);
    ctx.fillStyle = '#65d3cb';
    ctx.font = 'bold 18px "DM Sans", sans-serif';
    ctx.fillText('SYSTEM OK • CONTINUOUS MONITORING ACTIVE • STABLE SINUS RHYTHM', 24, h - 24);

    this.texture.needsUpdate = true;
  }
}

/**
 * Generates cold-chain logistics telemetry crate/pallet label
 */
export function createCargoLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = '#103949';
  ctx.fillRect(0, 0, 512, 70);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "DM Sans", sans-serif';
  ctx.fillText('MEDSOURCE COLD-CHAIN LOGISTICS', 24, 45);

  // Temp alert box
  ctx.fillStyle = '#e6f8f6';
  ctx.fillRect(24, 95, 464, 110);
  ctx.strokeStyle = '#58c7c0';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 95, 464, 110);

  ctx.fillStyle = '#0f3844';
  ctx.font = 'bold 20px "DM Sans", sans-serif';
  ctx.fillText('VALIDATED TEMPERATURE REGIME', 45, 135);
  ctx.fillStyle = '#1ca39b';
  ctx.font = 'bold 44px monospace';
  ctx.fillText('+4.2°C  (2°C – 8°C)', 45, 185);

  // Barcode
  ctx.fillStyle = '#102d3c';
  for (let x = 45; x < 460; x += 5) {
    if (Math.random() > 0.25) {
      ctx.fillRect(x, 240, Math.random() > 0.6 ? 4 : 2, 80);
    }
  }
  ctx.font = '16px monospace';
  ctx.fillText('SSCC: 370412000984128941', 45, 350);

  ctx.fillStyle = '#4f6c7a';
  ctx.font = '600 16px "DM Sans", sans-serif';
  ctx.fillText('ORIGIN: DUBLIN PHARMA HUB', 45, 395);
  ctx.fillText('DESTINATION: GLOBAL DIRECT DISTRIBUTION', 45, 425);
  ctx.fillText('AIR WAYBILL: #AWB-902-8411', 45, 455);
  ctx.fillText('STATUS: CLEARED FOR DISPATCH', 45, 485);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Generates an authentic B-mode diagnostic ultrasound screen texture
 */
export function createUltrasoundScreenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Deep clinical dark background
  ctx.fillStyle = '#03080e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top header status bar
  ctx.fillStyle = '#081722';
  ctx.fillRect(0, 0, canvas.width, 56);
  ctx.fillStyle = '#58c7c0';
  ctx.font = 'bold 20px "DM Sans", sans-serif';
  ctx.fillText('MEDSOURCE ULTRASOUND • SONO-VIEW 9000', 24, 36);

  ctx.fillStyle = '#89aab8';
  ctx.font = '16px "DM Sans", sans-serif';
  ctx.fillText('PROBE: C5-2 (3.5 MHz) • ABDOMEN PRESET', 580, 36);

  // Sector Sonogram Fan (Convex Array Beam)
  const originX = canvas.width / 2 - 30;
  const originY = 80;
  const beamRadius = 560;
  const startAngle = Math.PI / 2 - 0.44;
  const endAngle = Math.PI / 2 + 0.44;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.arc(originX, originY, beamRadius, startAngle, endAngle);
  ctx.closePath();
  ctx.clip();

  // Acoustic dark base with depth attenuation
  const beamGrad = ctx.createRadialGradient(originX, originY, 40, originX, originY, beamRadius);
  beamGrad.addColorStop(0, '#102838');
  beamGrad.addColorStop(0.3, '#0b1d28');
  beamGrad.addColorStop(0.7, '#07141d');
  beamGrad.addColorStop(1, '#02070c');
  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Synthetic echogenic tissue speckle pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 4000; i++) {
    const r = Math.random() * (beamRadius - 60) + 60;
    const a = startAngle + Math.random() * (endAngle - startAngle);
    const sx = originX + Math.cos(a) * r;
    const sy = originY + Math.sin(a) * r;
    const size = Math.random() * 2 + 0.5;
    ctx.fillRect(sx, sy, size, size);
  }

  // Echogenic anatomical tissue contours (e.g. liver parenchyma / renal cortex)
  ctx.strokeStyle = 'rgba(200, 235, 240, 0.45)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(originX - 40, originY + 280, 160, 90, 0.2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(180, 220, 230, 0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(originX + 80, originY + 340, 110, 70, -0.3, 0, Math.PI * 2);
  ctx.stroke();

  // Hypoechoic vascular lumen (fluid filled cyst/vessel - darker center)
  ctx.fillStyle = '#01050a';
  ctx.beginPath();
  ctx.ellipse(originX - 30, originY + 280, 60, 35, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Distal acoustic enhancement beneath fluid pocket
  const enhGrad = ctx.createLinearGradient(originX - 30, originY + 315, originX - 30, originY + 440);
  enhGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
  enhGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = enhGrad;
  ctx.fillRect(originX - 90, originY + 315, 120, 130);

  ctx.restore();

  // Draw sector fan border lines
  ctx.strokeStyle = '#2d5b6e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + Math.cos(startAngle) * beamRadius, originY + Math.sin(startAngle) * beamRadius);
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX + Math.cos(endAngle) * beamRadius, originY + Math.sin(endAngle) * beamRadius);
  ctx.arc(originX, originY, beamRadius, startAngle, endAngle);
  ctx.stroke();

  // Clinical measurements: Cross caliper measurement line (Yellow)
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(originX - 90, originY + 280);
  ctx.lineTo(originX + 30, originY + 280);
  ctx.stroke();

  // Caliper crosses '+'
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('+', originX - 96, originY + 286);
  ctx.fillText('+', originX + 24, originY + 286);
  ctx.font = '15px "DM Sans", sans-serif';
  ctx.fillText('D1: 4.82 cm', originX - 45, originY + 265);

  // Depth scale ticks along right side of sector beam
  ctx.fillStyle = '#89aab8';
  ctx.font = '12px monospace';
  for (let d = 2; d <= 16; d += 2) {
    const dy = originY + (d / 16) * beamRadius;
    ctx.fillText(`${d}cm -`, originX + 265, dy + 4);
  }

  // Left side telemetry parameters
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('THI  HARMONIC', 24, 110);
  ctx.fillStyle = '#89aab8';
  ctx.font = '14px monospace';
  ctx.fillText('GAIN: 58 dB', 24, 140);
  ctx.fillText('DR:   65 dB', 24, 168);
  ctx.fillText('FR:   34 Hz', 24, 196);
  ctx.fillText('DEPTH:16 cm', 24, 224);
  ctx.fillText('MI:   0.9', 24, 252);
  ctx.fillText('TIS:  0.3', 24, 280);

  // Color Doppler flow indicator scale box on upper right
  ctx.fillStyle = '#0a1d29';
  ctx.fillRect(canvas.width - 150, 70, 126, 170);
  ctx.strokeStyle = '#18384b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(canvas.width - 150, 70, 126, 170);

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('+32.4 cm/s', canvas.width - 142, 92);

  const dopGrad = ctx.createLinearGradient(0, 102, 0, 205);
  dopGrad.addColorStop(0, '#ef4444');
  dopGrad.addColorStop(0.48, '#781515');
  dopGrad.addColorStop(0.5, '#000000');
  dopGrad.addColorStop(0.52, '#0c356b');
  dopGrad.addColorStop(1, '#3b82f6');
  ctx.fillStyle = dopGrad;
  ctx.fillRect(canvas.width - 90, 102, 22, 103);

  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('-32.4 cm/s', canvas.width - 142, 225);

  // Bottom telemetry bar
  ctx.fillStyle = '#081722';
  ctx.fillRect(0, canvas.height - 48, canvas.width, 48);
  ctx.fillStyle = '#58c7c0';
  ctx.font = 'bold 15px "DM Sans", sans-serif';
  ctx.fillText('DIAGNOSTIC B-MODE ACTIVE • REAL-TIME ACOUSTIC BEAMFORMING', 24, canvas.height - 18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

/**
 * Generates an ultrasound console control panel texture with trackball and sliders
 */
export function createUltrasoundControlTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#e5ecee';
  ctx.fillRect(0, 0, 512, 512);

  // Upper section: TGC slider bank (Time Gain Compensation)
  ctx.fillStyle = '#cedadc';
  ctx.fillRect(40, 30, 240, 160);
  ctx.strokeStyle = '#a6b8bc';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 30, 240, 160);

  ctx.fillStyle = '#2d5b6e';
  ctx.font = 'bold 14px "DM Sans", sans-serif';
  ctx.fillText('TGC SLIDER BANK', 50, 52);

  // 6 slider slots with thumb buttons
  for (let s = 0; s < 6; s++) {
    const sy = 75 + s * 18;
    ctx.strokeStyle = '#859ea3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, sy);
    ctx.lineTo(260, sy);
    ctx.stroke();

    // Slider thumb
    const thumbX = 110 + Math.sin(s * 0.8) * 45;
    ctx.fillStyle = '#1e4857';
    ctx.fillRect(thumbX - 6, sy - 6, 12, 12);
  }

  // Keyboard preset keys
  ctx.fillStyle = '#ffffff';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 10; c++) {
      ctx.fillRect(40 + c * 24, 220 + r * 22, 18, 16);
    }
  }

  // Trackball well on right side
  ctx.fillStyle = '#0f2937';
  ctx.beginPath();
  ctx.arc(390, 280, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#58c7c0';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Rotary dials
  const dials = [
    [330, 90, 'GAIN'],
    [410, 90, 'ZOOM'],
    [450, 160, 'FREEZE']
  ];
  dials.forEach(([dx, dy, label]) => {
    ctx.fillStyle = '#163847';
    ctx.beginPath();
    ctx.arc(dx, dy, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "DM Sans", sans-serif';
    ctx.fillText(label, dx - 18, dy + 42);
  });

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
