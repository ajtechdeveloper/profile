import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function Stage1HeroCore({ isOrbitActive = true }) {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const satelliteGroupRef = useRef();
  const beaconRef = useRef();

  // Load authentic NASA high-resolution equirectangular Earth textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    THREE.TextureLoader,
    [
      './textures/earth_atmos_2048.jpg',
      './textures/earth_normal_2048.jpg',
      './textures/earth_specular_2048.jpg',
      './textures/earth_clouds_1024.png',
    ]
  );

  // Configure correct color spaces for realistic tone reproduction
  colorMap.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.colorSpace = THREE.SRGBColorSpace;

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;

    // When orbit is active, rotate Earth, clouds, and satellite in real-time
    if (isOrbitActive) {
      if (earthRef.current) {
        earthRef.current.rotation.y += delta * 0.05;
      }

      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += delta * 0.07;
        cloudsRef.current.rotation.x = Math.sin(elapsed * 0.1) * 0.01;
      }

      if (satelliteGroupRef.current) {
        satelliteGroupRef.current.rotation.y = elapsed * 0.25;
        satelliteGroupRef.current.rotation.z = Math.sin(elapsed * 0.15) * 0.2;
      }
    }

    // Pulsing communication beacon
    if (beaconRef.current) {
      beaconRef.current.intensity = 0.8 + Math.sin(elapsed * 4) * 0.6;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Solar Illumination — positioned to illuminate the continents beautifully */}
      <directionalLight position={[4, 2.5, 4.5]} intensity={2.6} color="#fffcf5" />

      {/* Gentle Earth-shine fill light from space */}
      <ambientLight intensity={0.28} color="#93c5fd" />

      {/* Atmospheric limb rim light from the edge */}
      <directionalLight position={[-4, 1, -2]} intensity={0.9} color="#38bdf8" />

      <Float speed={isOrbitActive ? 1.1 : 0} rotationIntensity={isOrbitActive ? 0.08 : 0} floatIntensity={isOrbitActive ? 0.2 : 0}>
        {/* Core Group tilted to Earth's real axial tilt (23.4 degrees = ~0.41 radians) */}
        <group rotation={[0.41, 0, 0]}>
          {/* Photorealistic Earth Globe */}
          <mesh ref={earthRef}>
            <sphereGeometry args={[1.72, 64, 64]} />
            <meshStandardMaterial
              map={colorMap}
              normalMap={normalMap}
              normalScale={new THREE.Vector2(0.85, 0.85)}
              metalnessMap={specularMap}
              metalness={0.4}
              roughness={0.65}
            />
          </mesh>

          {/* Dynamic Clouds Layer with Real NASA Atmospheric Density */}
          <mesh ref={cloudsRef}>
            <sphereGeometry args={[1.748, 64, 64]} />
            <meshStandardMaterial
              map={cloudsMap}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              roughness={1}
            />
          </mesh>

          {/* Inner Rayleigh Scattering Atmospheric Rim */}
          <mesh>
            <sphereGeometry args={[1.78, 48, 48]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.22}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Outer Ethereal Exosphere Glow */}
          <mesh>
            <sphereGeometry args={[1.86, 32, 32]} />
            <meshBasicMaterial
              color="#0284c7"
              transparent
              opacity={0.1}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Sleek Low-Earth Orbit Satellite */}
          <group ref={satelliteGroupRef}>
            <group position={[2.6, 0.4, 0]} rotation={[0, 0, 0.35]}>
              {/* Satellite Main Chassis (Gold multi-layer insulation foil) */}
              <mesh>
                <boxGeometry args={[0.09, 0.09, 0.14]} />
                <meshStandardMaterial
                  color="#d4af37"
                  metalness={0.9}
                  roughness={0.25}
                />
              </mesh>

              {/* High-Gain Parabolic Communications Dish */}
              <mesh position={[0, 0.07, 0]} rotation={[0.4, 0, 0]}>
                <coneGeometry args={[0.07, 0.03, 16, 1, true]} />
                <meshStandardMaterial
                  color="#f1f5f9"
                  metalness={0.8}
                  roughness={0.3}
                  side={THREE.DoubleSide}
                />
              </mesh>

              {/* Blue Photovoltaic Solar Panels */}
              <group position={[0.22, 0, 0]}>
                <mesh>
                  <boxGeometry args={[0.26, 0.01, 0.08]} />
                  <meshStandardMaterial
                    color="#1e3a8a"
                    metalness={0.85}
                    roughness={0.2}
                    emissive="#0284c7"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              </group>
              <group position={[-0.22, 0, 0]}>
                <mesh>
                  <boxGeometry args={[0.26, 0.01, 0.08]} />
                  <meshStandardMaterial
                    color="#1e3a8a"
                    metalness={0.85}
                    roughness={0.2}
                    emissive="#0284c7"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              </group>

              {/* Telemetry Sensor Antenna */}
              <mesh position={[0, -0.06, 0]}>
                <cylinderGeometry args={[0.004, 0.004, 0.08, 8]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
              </mesh>

              {/* Blinking Optical Beacon Light */}
              <pointLight
                ref={beaconRef}
                color="#38bdf8"
                distance={0.8}
                intensity={1}
              />
            </group>
          </group>
        </group>
      </Float>
    </group>
  );
}
