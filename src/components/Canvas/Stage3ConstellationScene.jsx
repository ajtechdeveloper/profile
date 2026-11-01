import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundEngine } from '../../audio/soundEngine';

const SKILLS_DATA = [
  // AI & Future Architecture (Cyan)
  { name: 'AI Agents', category: 'AI', color: '#00f0ff', pos: [-2.8, 1.8, 0.5] },
  { name: 'MCP & LLMs', category: 'AI', color: '#00f0ff', pos: [-1.4, 2.6, -1.2] },
  { name: 'LangChain & OpenAI', category: 'AI', color: '#00f0ff', pos: [-3.5, 0.4, -0.8] },
  { name: 'AI Business Strategy', category: 'AI', color: '#00f0ff', pos: [-2.0, -0.8, 1.2] },

  // Cloud & Distributed Systems (Sky Blue)
  { name: 'Cloud-Native SaaS', category: 'Cloud', color: '#38bdf8', pos: [2.5, 1.9, -0.6] },
  { name: 'Multi-Tenant Arch', category: 'Cloud', color: '#38bdf8', pos: [3.4, 0.6, 1.0] },
  { name: 'Apache Kafka Pipelines', category: 'Cloud', color: '#38bdf8', pos: [1.8, 2.7, 1.4] },
  { name: 'IoT & MQTT (Protobuf)', category: 'Cloud', color: '#38bdf8', pos: [2.8, -0.9, -1.1] },

  // Leadership & Agile (Emerald)
  { name: 'Engineering Leadership', category: 'Exec', color: '#10b981', pos: [-1.5, -2.2, 0.8] },
  { name: 'Certified ScrumMaster', category: 'Exec', color: '#10b981', pos: [0.2, -2.8, -1.0] },
  { name: 'Strategic Planning', category: 'Exec', color: '#10b981', pos: [1.8, -2.1, 1.1] },

  // Domains & Systems (Gold / Violet)
  { name: 'Financial Workflows', category: 'Domain', color: '#f59e0b', pos: [0, 2.9, 0] },
  { name: 'Risk Infrastructure', category: 'Domain', color: '#a855f7', pos: [0, -1.5, -2.2] }
];

function SkillNode({ skill, onHoverSkill }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.4 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 8);
    }
  });

  return (
    <group position={skill.pos}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          soundEngine.playHover();
          if (onHoverSkill) onHoverSkill(skill.name);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          if (onHoverSkill) onHoverSkill(null);
        }}
        style={{ cursor: 'pointer' }}
      >
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : skill.color}
          emissive={skill.color}
          emissiveIntensity={hovered ? 1.5 : 0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Floating 3D Label */}
      <Html
        distanceFactor={14}
        position={[0, 0.4, 0]}
        center
        pointerEvents="none"
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: hovered ? '11px' : '9px',
            color: hovered ? '#ffffff' : skill.color,
            background: 'rgba(6, 9, 14, 0.85)',
            border: `1px solid ${hovered ? '#ffffff' : skill.color}`,
            borderRadius: '4px',
            padding: '2px 8px',
            whiteSpace: 'nowrap',
            boxShadow: hovered ? `0 0 15px ${skill.color}` : 'none',
            transform: `scale(${hovered ? 1.1 : 1})`,
            transition: 'all 0.2s ease',
            letterSpacing: '0.04em'
          }}
        >
          {skill.name}
        </div>
      </Html>
    </group>
  );
}

export default function Stage3ConstellationScene({ onHoverSkill, isOrbitActive = true }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!isOrbitActive) return;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    // Offset to x: 2.3 to frame the 3D constellation in the right hemisphere alongside left HTML cards
    <group position={[2.3, -70, 0]}>
      {/* Central Stellar Beacon Core */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={1.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Orbital Beacon Navigation Ring */}
      <mesh rotation={[Math.PI / 3, 0.2, 0]}>
        <torusGeometry args={[1.2, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#e2e8f0"
          emissive="#38bdf8"
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>
      {/* Concentric Orbital Trajectory Rings */}
      {[2.4, 3.4, 4.2].map((radius, idx) => (
        <mesh key={idx} rotation={[Math.PI / 2 + idx * 0.25, idx * 0.3, 0]}>
          <torusGeometry args={[radius, 0.01, 16, 96]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.18} />
        </mesh>
      ))}
      <pointLight color="#38bdf8" intensity={3.0} distance={10} />

      <Float speed={isOrbitActive ? 1.5 : 0} rotationIntensity={isOrbitActive ? 0.2 : 0} floatIntensity={isOrbitActive ? 0.5 : 0}>
        <group ref={groupRef}>
          {SKILLS_DATA.map((skill, idx) => (
            <SkillNode key={idx} skill={skill} onHoverSkill={onHoverSkill} />
          ))}
        </group>
      </Float>
    </group>
  );
}
