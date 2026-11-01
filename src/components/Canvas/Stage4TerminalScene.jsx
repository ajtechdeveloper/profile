import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export default function Stage4TerminalScene() {
  const dishRef = useRef();

  // Load real lunar surface texture
  const lunarTexture = useLoader(THREE.TextureLoader, './textures/lunar_surface.jpg');
  lunarTexture.colorSpace = THREE.SRGBColorSpace;
  lunarTexture.wrapS = THREE.RepeatWrapping;
  lunarTexture.wrapT = THREE.RepeatWrapping;
  lunarTexture.repeat.set(2, 2);

  useFrame((state, delta) => {
    if (dishRef.current) {
      dishRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group position={[0, -84, 0]}>
      {/* Real Lunar Surface Terrain Landing Base */}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[8.5, 9.2, 0.8, 64]} />
        <meshStandardMaterial
          map={lunarTexture}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Titanium Reinforced Architectural Landing Pad */}
      <mesh position={[0, -1.75, 0]}>
        <cylinderGeometry args={[6.5, 6.5, 0.15, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Outer Solar Beacon Array */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI * 2) / 8;
        const x = Math.cos(angle) * 6.2;
        const z = Math.sin(angle) * 6.2;
        return (
          <group key={i} position={[x, -1.6, z]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.08, 0.35, 8]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
            </mesh>
            <pointLight color="#38bdf8" intensity={1.2} distance={3} />
          </group>
        );
      })}

      {/* Floating Spatial Communication Terminal Console */}
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[0, 0.4, 0]}>
          {/* Obsidian & Titanium Pedestal */}
          <mesh>
            <boxGeometry args={[2.8, 1.8, 1.2]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>

          {/* Frosted Solar Glass Display Front */}
          <mesh position={[0, 0, 0.62]}>
            <planeGeometry args={[2.5, 1.5]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0369a1"
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Deep Space Parabolic Dish on Pedestal */}
          <group ref={dishRef} position={[0, 1.3, 0]}>
            <mesh rotation={[-Math.PI / 4, 0, 0]}>
              <sphereGeometry args={[0.55, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color="#e2e8f0"
                metalness={0.95}
                roughness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0.25, 0.25]}>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>

            {/* Upward Outbound Transmission Data Beam */}
            <mesh position={[0, 1.4, 0.8]} rotation={[-Math.PI / 4, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.35, 2.5, 16, 1, true]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.35}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
            <pointLight position={[0, 1.2, 0.6]} color="#38bdf8" intensity={2.8} distance={6} />
          </group>
        </group>
      </Float>
    </group>
  );
}
