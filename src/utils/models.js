import * as THREE from 'three';
import {
  createBottleLabelTexture,
  createBlisterFoilTexture,
  createCargoLabelTexture,
  createUltrasoundScreenTexture,
  createUltrasoundControlTexture
} from './textures';

/**
 * Creates a photorealistic pharmaceutical medicine bottle with label, ribbed cap and amber glass/PET body
 */
export function createMedicineBottle() {
  const group = new THREE.Group();

  // Bottle Body (Lathe / Cylinder with rounded bevels)
  const bottleRadius = 1.35;
  const bottleHeight = 3.2;

  // Smoked amber clinical bottle material
  const bottleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x3d200e,
    metalness: 0.08,
    roughness: 0.15,
    transmission: 0.72,
    thickness: 1.1,
    ior: 1.54,
    specularIntensity: 1.0,
    specularColor: 0xffffff,
    transparent: true,
    opacity: 0.95
  });

  const bodyGeo = new THREE.CylinderGeometry(bottleRadius, bottleRadius * 0.98, bottleHeight, 48, 1, false);
  const bodyMesh = new THREE.Mesh(bodyGeo, bottleMaterial);
  bodyMesh.position.y = bottleHeight / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // Rounded bottle shoulder
  const shoulderGeo = new THREE.CylinderGeometry(bottleRadius * 0.65, bottleRadius, 0.6, 48);
  const shoulderMesh = new THREE.Mesh(shoulderGeo, bottleMaterial);
  shoulderMesh.position.y = bottleHeight + 0.3;
  group.add(shoulderMesh);

  // Bottle Neck
  const neckGeo = new THREE.CylinderGeometry(bottleRadius * 0.62, bottleRadius * 0.65, 0.7, 48);
  const neckMesh = new THREE.Mesh(neckGeo, bottleMaterial);
  neckMesh.position.y = bottleHeight + 0.6 + 0.35;
  group.add(neckMesh);

  // Bottle Label (Thin cylindrical layer wrapped around body)
  const labelGeo = new THREE.CylinderGeometry(bottleRadius + 0.015, bottleRadius + 0.015, bottleHeight * 0.75, 48, 1, true, 0, Math.PI * 1.85);
  const labelTexture = createBottleLabelTexture();
  const labelMaterial = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.45,
    metalness: 0.05,
    side: THREE.DoubleSide
  });
  const labelMesh = new THREE.Mesh(labelGeo, labelMaterial);
  labelMesh.position.y = bottleHeight * 0.48;
  labelMesh.rotation.y = -Math.PI * 0.35;
  group.add(labelMesh);

  // Pharmaceutical Ribbed White Cap
  const capRadius = bottleRadius * 0.72;
  const capHeight = 0.85;
  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0xf4f7f6,
    roughness: 0.3,
    metalness: 0.05
  });
  const capGeo = new THREE.CylinderGeometry(capRadius, capRadius, capHeight, 48);
  const capMesh = new THREE.Mesh(capGeo, capMaterial);
  capMesh.position.y = bottleHeight + 0.6 + 0.45 + capHeight / 2;
  capMesh.castShadow = true;
  group.add(capMesh);

  // Safety seal ring underneath cap
  const sealGeo = new THREE.TorusGeometry(capRadius * 0.98, 0.04, 16, 48);
  const sealMat = new THREE.MeshStandardMaterial({ color: 0x58c7c0, roughness: 0.2 });
  const sealMesh = new THREE.Mesh(sealGeo, sealMat);
  sealMesh.rotation.x = Math.PI / 2;
  sealMesh.position.y = bottleHeight + 0.6 + 0.42;
  group.add(sealMesh);

  // Internal medicine tablets / fluid shadow inside bottle
  const contentsGeo = new THREE.CylinderGeometry(bottleRadius * 0.88, bottleRadius * 0.86, bottleHeight * 0.7, 32);
  const contentsMat = new THREE.MeshStandardMaterial({ color: 0xd9e6e8, roughness: 0.6 });
  const contentsMesh = new THREE.Mesh(contentsGeo, contentsMat);
  contentsMesh.position.y = bottleHeight * 0.4;
  group.add(contentsMesh);

  return group;
}

/**
 * Creates a photorealistic 3D medicine blister pack with aluminum foil backing and thermoformed pill pockets
 */
export function createBlisterPack() {
  const group = new THREE.Group();

  const width = 3.6;
  const height = 5.2;
  const thickness = 0.04;

  // Aluminum foil backplate
  const foilTexture = createBlisterFoilTexture();
  const foilMaterial = new THREE.MeshStandardMaterial({
    color: 0xdde4e8,
    map: foilTexture,
    metalness: 0.88,
    roughness: 0.28,
    side: THREE.DoubleSide
  });

  const baseGeo = new THREE.BoxGeometry(width, height, thickness);
  const baseMesh = new THREE.Mesh(baseGeo, foilMaterial);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // Clear Thermoformed PVC blister pockets material
  const blisterPvcMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.05,
    roughness: 0.06,
    transmission: 0.92,
    thickness: 0.4,
    transparent: true,
    opacity: 0.65,
    ior: 1.49,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  });

  // Pill tablets inside pockets
  const tabletMaterialTeal = new THREE.MeshPhysicalMaterial({
    color: 0x18a99f,
    roughness: 0.2,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1
  });
  const tabletMaterialWhite = new THREE.MeshPhysicalMaterial({
    color: 0xfafcfa,
    roughness: 0.25,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1
  });

  // Grid of 2 columns x 5 rows = 10 blisters
  const cols = 2;
  const rows = 5;
  const colSpacing = 1.6;
  const rowSpacing = 0.92;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = (c - (cols - 1) / 2) * colSpacing;
      const y = (r - (rows - 1) / 2) * rowSpacing;

      // Thermoformed blister dome (elongated capsule pocket)
      const domeGeo = new THREE.CapsuleGeometry(0.32, 0.44, 16, 24);
      const domeMesh = new THREE.Mesh(domeGeo, blisterPvcMaterial);
      domeMesh.rotation.z = Math.PI / 2;
      domeMesh.position.set(x, y, 0.22);
      group.add(domeMesh);

      // Capsule inside pocket (composed of two halves)
      const pillHalf1 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.24, 20), tabletMaterialTeal);
      pillHalf1.rotation.z = Math.PI / 2;
      pillHalf1.position.set(x - 0.12, y, 0.15);

      const capSphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), tabletMaterialTeal);
      capSphere1.rotation.z = -Math.PI / 2;
      capSphere1.position.set(x - 0.24, y, 0.15);

      const pillHalf2 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.24, 20), tabletMaterialWhite);
      pillHalf2.rotation.z = Math.PI / 2;
      pillHalf2.position.set(x + 0.12, y, 0.15);

      const capSphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2), tabletMaterialWhite);
      capSphere2.rotation.z = Math.PI / 2;
      capSphere2.position.set(x + 0.24, y, 0.15);

      group.add(pillHalf1, capSphere1, pillHalf2, capSphere2);
    }
  }

  return group;
}

/**
 * Creates a photorealistic 3D pharmaceutical capsule with two-tone gelatin gloss
 */
export function createCapsule(color1 = 0x1db9b1, color2 = 0xffffff, radius = 0.45, length = 0.8) {
  const group = new THREE.Group();

  const mat1 = new THREE.MeshPhysicalMaterial({
    color: color1,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    metalness: 0.02
  });

  const mat2 = new THREE.MeshPhysicalMaterial({
    color: color2,
    roughness: 0.12,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    metalness: 0.02
  });

  // Top half: cylinder + hemisphere
  const cylGeo1 = new THREE.CylinderGeometry(radius, radius, length / 2, 32);
  const cyl1 = new THREE.Mesh(cylGeo1, mat1);
  cyl1.position.y = length / 4;
  cyl1.castShadow = true;
  group.add(cyl1);

  const sphereGeo1 = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const cap1 = new THREE.Mesh(sphereGeo1, mat1);
  cap1.position.y = length / 2;
  cap1.castShadow = true;
  group.add(cap1);

  // Bottom half: cylinder + hemisphere
  const cylGeo2 = new THREE.CylinderGeometry(radius * 0.99, radius * 0.99, length / 2, 32);
  const cyl2 = new THREE.Mesh(cylGeo2, mat2);
  cyl2.position.y = -length / 4;
  cyl2.castShadow = true;
  group.add(cyl2);

  const sphereGeo2 = new THREE.SphereGeometry(radius * 0.99, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const cap2 = new THREE.Mesh(sphereGeo2, mat2);
  cap2.position.y = -length / 2;
  cap2.castShadow = true;
  group.add(cap2);

  // Medical center band
  const bandGeo = new THREE.TorusGeometry(radius * 1.015, 0.02, 16, 32);
  const bandMat = new THREE.MeshStandardMaterial({ color: 0x0f2f3d, roughness: 0.3 });
  const bandMesh = new THREE.Mesh(bandGeo, bandMat);
  bandMesh.rotation.x = Math.PI / 2;
  group.add(bandMesh);

  return group;
}

/**
 * Creates a photorealistic 3D medical patient monitor with active telemetry LCD screen
 */
export function createPatientMonitor(screenController) {
  const group = new THREE.Group();

  const width = 5.4;
  const height = 4.0;
  const depth = 1.3;

  // Medical white ABS casing
  const casingMaterial = new THREE.MeshStandardMaterial({
    color: 0xedf2f2,
    roughness: 0.35,
    metalness: 0.08
  });

  const casingGeo = new THREE.BoxGeometry(width, height, depth);
  const casingMesh = new THREE.Mesh(casingGeo, casingMaterial);
  casingMesh.castShadow = true;
  casingMesh.receiveShadow = true;
  group.add(casingMesh);

  // Top ergonomic carry handle
  const handleGeo = new THREE.BoxGeometry(2.4, 0.28, 0.35);
  const handleMesh = new THREE.Mesh(handleGeo, casingMaterial);
  handleMesh.position.set(0, height / 2 + 0.25, 0);
  group.add(handleMesh);

  const handleLeg1 = new THREE.BoxGeometry(0.24, 0.35, 0.35);
  const handleLeg2 = handleLeg1.clone();
  const legMesh1 = new THREE.Mesh(handleLeg1, casingMaterial);
  legMesh1.position.set(-1.08, height / 2 + 0.1, 0);
  const legMesh2 = new THREE.Mesh(handleLeg2, casingMaterial);
  legMesh2.position.set(1.08, height / 2 + 0.1, 0);
  group.add(legMesh1, legMesh2);

  // Dark screen bezel
  const bezelWidth = width * 0.92;
  const bezelHeight = height * 0.88;
  const bezelMaterial = new THREE.MeshStandardMaterial({
    color: 0x111c22,
    roughness: 0.25,
    metalness: 0.3
  });
  const bezelGeo = new THREE.BoxGeometry(bezelWidth, bezelHeight, 0.08);
  const bezelMesh = new THREE.Mesh(bezelGeo, bezelMaterial);
  bezelMesh.position.set(0, 0, depth / 2 + 0.04);
  group.add(bezelMesh);

  // Glowing Telemetry LCD Screen (using dynamic canvas texture)
  const screenWidth = bezelWidth * 0.94;
  const screenHeight = bezelHeight * 0.92;
  const screenGeo = new THREE.PlaneGeometry(screenWidth, screenHeight);
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenController.texture
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0, depth / 2 + 0.09);
  group.add(screenMesh);

  // Rotary encoder navigation knob on right bezel
  const knobGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.22, 24);
  const knobMat = new THREE.MeshStandardMaterial({ color: 0x334a56, roughness: 0.3, metalness: 0.5 });
  const knobMesh = new THREE.Mesh(knobGeo, knobMat);
  knobMesh.rotation.x = Math.PI / 2;
  knobMesh.position.set(width / 2 - 0.42, -height / 2 + 0.6, depth / 2 + 0.1);
  group.add(knobMesh);

  // Green operational status LED indicator
  const ledGeo = new THREE.SphereGeometry(0.06, 16, 16);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
  const ledMesh = new THREE.Mesh(ledGeo, ledMat);
  ledMesh.position.set(-width / 2 + 0.45, height / 2 - 0.4, depth / 2 + 0.09);
  group.add(ledMesh);

  // Sturdy angled desktop / clinical trolley stand
  const standGeo = new THREE.BoxGeometry(3.6, 0.25, 2.6);
  const standMesh = new THREE.Mesh(standGeo, casingMaterial);
  standMesh.position.set(0, -height / 2 - 0.12, 0.3);
  standMesh.receiveShadow = true;
  group.add(standMesh);

  return group;
}

/**
 * Creates a photorealistic 3D medical ultrasound transducer probe
 */
export function createDiagnosticProbe() {
  const group = new THREE.Group();

  // Handle body
  const bodyGeo = new THREE.CylinderGeometry(0.38, 0.46, 2.4, 24);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf0f5f5, roughness: 0.35 });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // Silicone ergonomic grip ring
  const gripGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.9, 24);
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x1f4654, roughness: 0.6 });
  const gripMesh = new THREE.Mesh(gripGeo, gripMat);
  gripMesh.position.y = 0.15;
  group.add(gripMesh);

  // Transducer Acoustic Lens head (metallic beveled face)
  const headGeo = new THREE.BoxGeometry(1.2, 0.45, 0.55);
  const headMat = new THREE.MeshStandardMaterial({ color: 0x277a82, roughness: 0.2, metalness: 0.3 });
  const headMesh = new THREE.Mesh(headGeo, headMat);
  headMesh.position.y = 1.35;
  group.add(headMesh);

  const lensGeo = new THREE.BoxGeometry(1.05, 0.08, 0.45);
  const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x0f2b38, roughness: 0.1, clearcoat: 1.0 });
  const lensMesh = new THREE.Mesh(lensGeo, lensMat);
  lensMesh.position.y = 1.58;
  group.add(lensMesh);

  // Strain-relief cable boot at bottom
  const bootGeo = new THREE.CylinderGeometry(0.25, 0.15, 0.6, 16);
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x1a2e38, roughness: 0.5 });
  const bootMesh = new THREE.Mesh(bootGeo, bootMat);
  bootMesh.position.y = -1.4;
  group.add(bootMesh);

  return group;
}

/**
 * Creates a photorealistic 3D cold-chain pharmaceutical cargo shipper box
 */
export function createColdChainCrate() {
  const group = new THREE.Group();

  const width = 3.6;
  const height = 2.8;
  const depth = 3.2;

  // Heavy duty insulated composite crate
  const crateGeo = new THREE.BoxGeometry(width, height, depth);
  const crateMat = new THREE.MeshStandardMaterial({
    color: 0x133748,
    roughness: 0.4,
    metalness: 0.15
  });
  const crateMesh = new THREE.Mesh(crateGeo, crateMat);
  crateMesh.castShadow = true;
  crateMesh.receiveShadow = true;
  group.add(crateMesh);

  // Metallic reinforcement corner brackets
  const cornerMat = new THREE.MeshStandardMaterial({ color: 0x7694a0, metalness: 0.8, roughness: 0.2 });
  const corners = [
    [-width / 2, -height / 2, -depth / 2],
    [width / 2, -height / 2, -depth / 2],
    [-width / 2, height / 2, -depth / 2],
    [width / 2, height / 2, -depth / 2],
    [-width / 2, -height / 2, depth / 2],
    [width / 2, -height / 2, depth / 2],
    [-width / 2, height / 2, depth / 2],
    [width / 2, height / 2, depth / 2]
  ];
  corners.forEach(([cx, cy, cz]) => {
    const cMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), cornerMat);
    cMesh.position.set(cx, cy, cz);
    group.add(cMesh);
  });

  // Front cold-chain logistics label
  const labelTexture = createCargoLabelTexture();
  const labelMat = new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.4 });
  const labelGeo = new THREE.PlaneGeometry(2.1, 2.1);
  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.position.set(0, 0, depth / 2 + 0.02);
  group.add(labelMesh);

  return group;
}

/**
 * Creates a photorealistic 3D diagnostic ultrasound machine with console, screen, and transducer probe
 */
export function createUltrasoundMachine() {
  const group = new THREE.Group();

  const casingMat = new THREE.MeshStandardMaterial({
    color: 0xedf2f2,
    roughness: 0.35,
    metalness: 0.08
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111c22,
    roughness: 0.25,
    metalness: 0.3
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x8fa3ac,
    roughness: 0.25,
    metalness: 0.85
  });

  // 1. Mobile Trolley Base Platform with 4 Caster Wheels
  const baseGeo = new THREE.BoxGeometry(4.2, 0.45, 4.0);
  const baseMesh = new THREE.Mesh(baseGeo, casingMat);
  baseMesh.position.y = -3.2;
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  group.add(baseMesh);

  // 4 Caster Wheels
  const wheelOffsets = [
    [-1.7, -3.6, -1.6],
    [1.7, -3.6, -1.6],
    [-1.7, -3.6, 1.6],
    [1.7, -3.6, 1.6]
  ];
  wheelOffsets.forEach(([wx, wy, wz]) => {
    const wheelFork = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 0.25), metalMat);
    wheelFork.position.set(wx, wy + 0.15, wz);

    const wheelGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.18, 16);
    const wheelMesh = new THREE.Mesh(wheelGeo, darkMat);
    wheelMesh.rotation.z = Math.PI / 2;
    wheelMesh.position.set(wx, wy - 0.05, wz);
    group.add(wheelFork, wheelMesh);
  });

  // 2. Central Equipment Tower / Chassis
  const towerGeo = new THREE.BoxGeometry(3.2, 2.6, 2.8);
  const towerMesh = new THREE.Mesh(towerGeo, casingMat);
  towerMesh.position.set(0, -1.7, 0);
  towerMesh.castShadow = true;
  group.add(towerMesh);

  // Front probe connection receptacle bay (black panel with 2 probe ports)
  const portBayGeo = new THREE.BoxGeometry(2.4, 0.9, 0.15);
  const portBayMesh = new THREE.Mesh(portBayGeo, darkMat);
  portBayMesh.position.set(0, -1.8, 1.42);
  group.add(portBayMesh);

  // 2 Transducer connector ports
  [-0.6, 0.6].forEach(px => {
    const portGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 24);
    const portMesh = new THREE.Mesh(portGeo, metalMat);
    portMesh.rotation.x = Math.PI / 2;
    portMesh.position.set(px, -1.8, 1.48);
    group.add(portMesh);
  });

  // 3. Ergonomic Operator Control Console Deck
  const deckGroup = new THREE.Group();
  deckGroup.position.set(0, -0.3, 0.5);
  deckGroup.rotation.x = 0.2; // angled for operator ergonomicity

  const deckBodyGeo = new THREE.BoxGeometry(4.4, 0.45, 3.2);
  const deckBodyMesh = new THREE.Mesh(deckBodyGeo, casingMat);
  deckBodyMesh.castShadow = true;
  deckGroup.add(deckBodyMesh);

  // Control panel surface with trackball, sliders, and buttons
  const ctrlTex = createUltrasoundControlTexture();
  const ctrlMat = new THREE.MeshStandardMaterial({ map: ctrlTex, roughness: 0.35 });
  const ctrlGeo = new THREE.PlaneGeometry(4.1, 2.9);
  const ctrlMesh = new THREE.Mesh(ctrlGeo, ctrlMat);
  ctrlMesh.rotation.x = -Math.PI / 2;
  ctrlMesh.position.y = 0.23;
  deckGroup.add(ctrlMesh);

  // 3D Illuminated Trackball Sphere
  const ballGeo = new THREE.SphereGeometry(0.32, 24, 24);
  const ballMat = new THREE.MeshPhysicalMaterial({
    color: 0x58c7c0,
    roughness: 0.1,
    clearcoat: 1.0,
    emissive: 0x145a55,
    emissiveIntensity: 0.4
  });
  const ballMesh = new THREE.Mesh(ballGeo, ballMat);
  ballMesh.position.set(1.15, 0.32, 0.5);
  deckGroup.add(ballMesh);

  group.add(deckGroup);

  // 4. Articulated Monitor Support Arm & Display
  const armGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.6, 24);
  const armMesh = new THREE.Mesh(armGeo, metalMat);
  armMesh.position.set(0, 0.6, -0.6);
  group.add(armMesh);

  // Swivel mount
  const swivelGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const swivelMesh = new THREE.Mesh(swivelGeo, metalMat);
  swivelMesh.position.set(0, 1.35, -0.6);
  group.add(swivelMesh);

  // Monitor Group
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(0, 2.0, -0.4);
  monitorGroup.rotation.x = -0.06;

  // Monitor chassis
  const monWidth = 5.2;
  const monHeight = 3.8;
  const monDepth = 0.45;
  const monMesh = new THREE.Mesh(new THREE.BoxGeometry(monWidth, monHeight, monDepth), casingMat);
  monMesh.castShadow = true;
  monitorGroup.add(monMesh);

  // Dark screen bezel
  const monBezel = new THREE.Mesh(new THREE.BoxGeometry(monWidth * 0.94, monHeight * 0.9, 0.08), darkMat);
  monBezel.position.z = monDepth / 2 + 0.04;
  monitorGroup.add(monBezel);

  // Ultrasound B-Mode Sonogram Screen
  const sonoTex = createUltrasoundScreenTexture();
  const sonoMat = new THREE.MeshBasicMaterial({ map: sonoTex });
  const sonoMesh = new THREE.Mesh(new THREE.PlaneGeometry(monWidth * 0.9, monHeight * 0.86), sonoMat);
  sonoMesh.position.z = monDepth / 2 + 0.09;
  monitorGroup.add(sonoMesh);

  group.add(monitorGroup);

  // 5. Side Probe Holster & Connected Ultrasound Transducer Probe
  const holsterGeo = new THREE.CylinderGeometry(0.45, 0.35, 1.2, 16, 1, true);
  const holsterMesh = new THREE.Mesh(holsterGeo, darkMat);
  holsterMesh.position.set(2.4, -0.3, 0.6);
  holsterMesh.rotation.z = -0.15;
  group.add(holsterMesh);

  // Convex Transducer Probe
  const probe = createDiagnosticProbe();
  probe.scale.set(0.78, 0.78, 0.78);
  probe.position.set(2.4, 0.5, 0.7);
  probe.rotation.set(0.3, -0.4, 0.2);
  group.add(probe);

  // Flexible Clinical Cable (connecting probe to console port)
  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.4, -0.5, 0.7),
    new THREE.Vector3(2.8, -1.4, 0.9),
    new THREE.Vector3(2.2, -2.4, 1.2),
    new THREE.Vector3(1.3, -2.2, 1.5),
    new THREE.Vector3(0.6, -1.8, 1.5)
  ]);
  const cableGeo = new THREE.TubeGeometry(cableCurve, 32, 0.07, 12, false);
  const cableMat = new THREE.MeshStandardMaterial({ color: 0x111c22, roughness: 0.6 });
  const cableMesh = new THREE.Mesh(cableGeo, cableMat);
  group.add(cableMesh);

  return group;
}

/**
 * Creates a professional surgical instrument set on a sterile tray:
 * Featuring stainless-steel surgical forceps, a hemostatic surgical clamp, and a medical scalpel
 */
export function createSurgicalInstrumentSet() {
  const group = new THREE.Group();

  // High-grade surgical stainless steel material
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xe8eef0,
    metalness: 0.95,
    roughness: 0.14
  });

  const steelMirrorMat = new THREE.MeshStandardMaterial({
    color: 0xf5f8fa,
    metalness: 0.98,
    roughness: 0.06
  });

  const steelDarkMat = new THREE.MeshStandardMaterial({
    color: 0x8a9da6,
    metalness: 0.88,
    roughness: 0.28
  });

  // 1. Sterile Stainless Steel Surgical Instrument Tray
  const trayWidth = 6.4;
  const trayDepth = 4.6;
  const trayHeight = 0.35;

  // Base dish
  const trayBase = new THREE.Mesh(new THREE.BoxGeometry(trayWidth, 0.08, trayDepth), steelMat);
  trayBase.castShadow = true;
  trayBase.receiveShadow = true;
  group.add(trayBase);

  // Tray raised beveled rim borders
  const rimThick = 0.12;
  const rimH = trayHeight;

  // Top & bottom rims
  const rimHGeo = new THREE.BoxGeometry(trayWidth, rimH, rimThick);
  const rimTop = new THREE.Mesh(rimHGeo, steelMat);
  rimTop.position.set(0, rimH / 2, -trayDepth / 2 + rimThick / 2);
  const rimBottom = new THREE.Mesh(rimHGeo, steelMat);
  rimBottom.position.set(0, rimH / 2, trayDepth / 2 - rimThick / 2);
  group.add(rimTop, rimBottom);

  // Left & right rims
  const rimVGeo = new THREE.BoxGeometry(rimThick, rimH, trayDepth);
  const rimLeft = new THREE.Mesh(rimVGeo, steelMat);
  rimLeft.position.set(-trayWidth / 2 + rimThick / 2, rimH / 2, 0);
  const rimRight = new THREE.Mesh(rimVGeo, steelMat);
  rimRight.position.set(trayWidth / 2 - rimThick / 2, rimH / 2, 0);
  group.add(rimLeft, rimRight);

  // Sterile blue surgical drape inlay cloth inside tray
  const drapeMat = new THREE.MeshStandardMaterial({
    color: 0x245a68,
    roughness: 0.88,
    metalness: 0.05
  });
  const drapeMesh = new THREE.Mesh(new THREE.PlaneGeometry(trayWidth - 0.3, trayDepth - 0.3), drapeMat);
  drapeMesh.rotation.x = -Math.PI / 2;
  drapeMesh.position.y = 0.05;
  drapeMesh.receiveShadow = true;
  group.add(drapeMesh);

  // 2. Instrument A: Surgical Scalpel (#3 handle with #10 blade)
  const scalpelGroup = new THREE.Group();
  scalpelGroup.position.set(1.8, 0.12, 0);
  scalpelGroup.rotation.y = 0.06;

  // Scalpel handle
  const handleLen = 3.4;
  const handleW = 0.32;
  const handleT = 0.07;
  const scHandle = new THREE.Mesh(new THREE.BoxGeometry(handleW, handleT, handleLen), steelMat);
  scHandle.position.z = 0.6;
  scHandle.castShadow = true;
  scalpelGroup.add(scHandle);

  // Knurled grip grooves on scalpel handle
  for (let g = -0.5; g <= 0.8; g += 0.15) {
    const groove = new THREE.Mesh(new THREE.BoxGeometry(handleW * 1.02, handleT * 1.05, 0.04), steelDarkMat);
    groove.position.set(0, 0, g);
    scalpelGroup.add(groove);
  }

  // Tapered neck to blade bayonet
  const neckMesh = new THREE.Mesh(new THREE.BoxGeometry(handleW * 0.7, handleT * 0.9, 0.6), steelMat);
  neckMesh.position.set(0, 0, -1.3);
  scalpelGroup.add(neckMesh);

  // #10 Surgical Blade (Curved cutting belly with mirror finish)
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.lineTo(0.18, 0);
  bladeShape.quadraticCurveTo(0.24, -0.6, 0.04, -1.1); // curved belly tip
  bladeShape.lineTo(-0.04, -1.1);
  bladeShape.lineTo(-0.06, 0);
  bladeShape.closePath();

  const bladeExtrude = new THREE.ExtrudeGeometry(bladeShape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 3
  });
  const bladeMesh = new THREE.Mesh(bladeExtrude, steelMirrorMat);
  bladeMesh.rotation.x = Math.PI / 2;
  bladeMesh.position.set(0, 0.02, -1.6);
  bladeMesh.castShadow = true;
  scalpelGroup.add(bladeMesh);

  group.add(scalpelGroup);

  // 3. Instrument B: Anatomical Surgical Forceps (Tissue Tweezers)
  const forcepsGroup = new THREE.Group();
  forcepsGroup.position.set(0, 0.12, 0);
  forcepsGroup.rotation.y = -0.04;

  const fLen = 3.6;
  // Rear flexure spring arch
  const archGeo = new THREE.TorusGeometry(0.18, 0.04, 12, 24, Math.PI);
  const archMesh = new THREE.Mesh(archGeo, steelMat);
  archMesh.rotation.y = Math.PI / 2;
  archMesh.position.set(0, 0.05, fLen / 2);
  forcepsGroup.add(archMesh);

  // Left & Right spring arms
  [-0.14, 0.14].forEach((fx, idx) => {
    // Arm shank
    const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, fLen * 0.92), steelMat);
    armMesh.position.set(fx, 0.05, 0.1);
    armMesh.castShadow = true;
    forcepsGroup.add(armMesh);

    // Ribbed thumb grip pad
    const padMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, 0.7), steelDarkMat);
    padMesh.position.set(fx + (idx === 0 ? -0.02 : 0.02), 0.05, 0.3);
    forcepsGroup.add(padMesh);

    // Fine tapered tip
    const tipMesh = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.45, 8), steelMirrorMat);
    tipMesh.rotation.x = -Math.PI / 2;
    tipMesh.position.set(fx * 0.4, 0.05, -fLen / 2 + 0.1);
    forcepsGroup.add(tipMesh);
  });

  group.add(forcepsGroup);

  // 4. Instrument C: Hemostatic Surgical Clamp (Kelly / Scissor-Style Clamp)
  const clampGroup = new THREE.Group();
  clampGroup.position.set(-1.8, 0.14, 0);
  clampGroup.rotation.y = 0.08;

  // Dual Scissor Finger Rings at handle end
  [-0.45, 0.45].forEach((rx, rIdx) => {
    const ringGeo = new THREE.TorusGeometry(0.34, 0.05, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, steelMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(rx, 0, 1.4);
    clampGroup.add(ringMesh);

    // Shank arm leading to pivot hinge
    const shankMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 1.3, 12), steelMat);
    shankMesh.rotation.z = (rIdx === 0 ? 0.32 : -0.32);
    shankMesh.rotation.x = Math.PI / 2;
    shankMesh.position.set(rx * 0.55, 0, 0.75);
    shankMesh.castShadow = true;
    clampGroup.add(shankMesh);
  });

  // Interlocking Ratchet Lock bar between finger rings
  const ratchetMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.05, 0.07), steelDarkMat);
  ratchetMesh.position.set(0, 0, 1.32);
  clampGroup.add(ratchetMesh);

  // Box-Lock Pivot Hinge with screw pin
  const hingeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 16), steelMat);
  hingeMesh.position.set(0, 0, 0.1);
  const screwMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.14, 12), steelDarkMat);
  screwMesh.position.set(0, 0, 0.1);
  clampGroup.add(hingeMesh, screwMesh);

  // Serrated Curved Clamping Jaws
  [-0.1, 0.1].forEach((jx, jIdx) => {
    const jawMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.065, 1.1, 12), steelMirrorMat);
    jawMesh.rotation.x = -Math.PI / 2;
    jawMesh.rotation.z = (jIdx === 0 ? -0.1 : 0.1);
    jawMesh.position.set(jx * 0.6, 0, -0.45);
    clampGroup.add(jawMesh);
  });

  group.add(clampGroup);

  return group;
}
