import React, { useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function EnvironmentEffects({ isOrbitActive = true }) {
  const pointsRef = useRef();
  const brightStarsRef = useRef();
  const skyDomeRef = useRef();

  // Two separate star fields — dense background field + sparse bright foreground stars
  const DUST_COUNT = 3000;
  const BRIGHT_COUNT = 55;

  // Load real spatial cosmic panorama textures
  const [orbitBg, nebulaBg] = useLoader(THREE.TextureLoader, [
    './textures/spatial_orbit_bg.jpg',
    './textures/deep_space_nebula.jpg'
  ]);

  orbitBg.colorSpace = THREE.SRGBColorSpace;
  nebulaBg.colorSpace = THREE.SRGBColorSpace;

  // Main star field — 3000 stars with size variation and per-star twinkling data
  const [starPositions, starColors, starSizes] = useMemo(() => {
    const pos = new Float32Array(DUST_COUNT * 3);
    const col = new Float32Array(DUST_COUNT * 3);
    const sizes = new Float32Array(DUST_COUNT);

    const goldStar  = new THREE.Color('#fde68a');
    const blueStar  = new THREE.Color('#93c5fd');
    const whiteStar = new THREE.Color('#ffffff');
    const redStar   = new THREE.Color('#fca5a5');

    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = Math.random() * -130 + 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90;

      const r = Math.random();
      const c = r < 0.50 ? whiteStar : r < 0.75 ? blueStar : r < 0.90 ? goldStar : redStar;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      // Non-uniform size distribution — most very small, a few larger
      sizes[i] = 0.06 + Math.pow(Math.random(), 4) * 0.22;
    }
    return [pos, col, sizes];
  }, []);

  // Bright star layer — 55 large, eye-catching stars
  const [brightPositions, brightColors] = useMemo(() => {
    const pos = new Float32Array(BRIGHT_COUNT * 3);
    const col = new Float32Array(BRIGHT_COUNT * 3);

    const colors = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#fde68a'),
      new THREE.Color('#bfdbfe'),
      new THREE.Color('#fca5a5'),
    ];

    for (let i = 0; i < BRIGHT_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = Math.random() * -120 + 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const c = colors[Math.floor(Math.random() * colors.length)];
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (!isOrbitActive) return;

    // Slow majestic celestial rotation
    if (skyDomeRef.current) skyDomeRef.current.rotation.y += delta * 0.004;

    // Gentle star drift
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.008;

    // Twinkling on bright stars — pulse their opacity with a sine wave
    if (brightStarsRef.current) {
      brightStarsRef.current.rotation.y += delta * 0.004;
      const mat = brightStarsRef.current.material;
      mat.opacity = 0.72 + Math.sin(state.clock.elapsedTime * 1.8) * 0.18 +
                    Math.sin(state.clock.elapsedTime * 3.1 + 1.2) * 0.08;
    }
  });

  return (
    <>
      {/* Real Spatial Environment SkyDome */}
      <mesh ref={skyDomeRef} position={[0, -40, 0]}>
        <sphereGeometry args={[90, 48, 48]} />
        <meshBasicMaterial
          map={orbitBg}
          side={THREE.BackSide}
          toneMapped={false}
        />
      </mesh>

      {/* Atmospheric Deep Nebula Layer — denser, more visible */}
      <mesh position={[0, -50, -12]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[55, 55, 95, 32, 1, true]} />
        <meshBasicMaterial
          map={nebulaBg}
          side={THREE.BackSide}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── Lighting ─────────────────────────────────────────────── */}

      {/* Primary Sun — rim lighting from high orbit angle */}
      <directionalLight
        position={[28, 35, 22]}
        intensity={3.2}
        color="#fff8e7"
      />
      {/* Earth albedo bounce — cool blue-cyan fill */}
      <directionalLight
        position={[-22, -18, 18]}
        intensity={1.4}
        color="#38bdf8"
      />
      {/* Soft deep-space ambient */}
      <ambientLight intensity={0.38} color="#8ba8c8" />

      {/* ── Star Fields ─────────────────────────────────────────── */}

      {/* Main dense star field — 3000 stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={DUST_COUNT}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={DUST_COUNT}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Bright twinkling foreground stars */}
      <points ref={brightStarsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={BRIGHT_COUNT}
            array={brightPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={BRIGHT_COUNT}
            array={brightColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </>
  );
}
