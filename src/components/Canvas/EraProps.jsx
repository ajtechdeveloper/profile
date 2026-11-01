import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Common real-world aerospace materials with high-specular finish for Bloom
const goldFoilMaterial = new THREE.MeshStandardMaterial({
  color: '#eab308',
  roughness: 0.22,
  metalness: 0.94,
  emissive: '#d97706',
  emissiveIntensity: 0.2
});

const whiteHullMaterial = new THREE.MeshStandardMaterial({
  color: '#f8fafc',
  roughness: 0.2,
  metalness: 0.65
});

const titaniumMaterial = new THREE.MeshStandardMaterial({
  color: '#94a3b8',
  roughness: 0.25,
  metalness: 0.92
});

const darkMetalMaterial = new THREE.MeshStandardMaterial({
  color: '#1e293b',
  roughness: 0.35,
  metalness: 0.88
});

const solarCellMaterial = new THREE.MeshStandardMaterial({
  color: '#0f2b5c',
  emissive: '#1e3a8a',
  emissiveIntensity: 0.45,
  roughness: 0.18,
  metalness: 0.85
});

// =========================================================================
// 1. SAGE: James Webb Deep-Space Spacecraft & Autonomous AI Observatory
// Real-world space telescope with gold hexagonal mirror array & sunshield
// =========================================================================
export function SageAiAgentProp({ position = [0, 0, 0] }) {
  const observatoryRef = useRef();
  const mirrorRef = useRef();

  useFrame((state, delta) => {
    if (observatoryRef.current) {
      observatoryRef.current.rotation.y += delta * 0.16;
      observatoryRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.1;
    }
    if (mirrorRef.current) {
      mirrorRef.current.rotation.z += delta * 0.04;
    }
  });

  // Hexagonal ring of 6 gold mirror segments around 1 center segment
  const mirrorSegments = [
    [0, 0, 0],
    ...[0, 1, 2, 3, 4, 5].map((i) => {
      const angle = (i * Math.PI) / 3;
      return [Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 0];
    })
  ];

  return (
    <group position={position}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={observatoryRef} scale={1.55}>
          {/* Key Rim Spotlight for specular highlights on gold mirrors */}
          <pointLight position={[1.5, 2, 2.5]} color="#fef08a" intensity={2.2} distance={8} />

          {/* Multi-Layered Diamond Sunshield Pallet */}
          {[-0.15, -0.22, -0.29].map((z, idx) => (
            <mesh key={idx} position={[0, -0.3, z]} rotation={[0.35, 0, 0]}>
              <cylinderGeometry args={[1.75 - idx * 0.1, 1.75 - idx * 0.1, 0.02, 4]} />
              <meshStandardMaterial
                color="#e2e8f0"
                roughness={0.15}
                metalness={0.92}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}

          {/* Spacecraft Avionics Bus */}
          <mesh position={[0, -0.52, -0.45]}>
            <boxGeometry args={[0.75, 0.42, 0.52]} />
            <primitive object={goldFoilMaterial} attach="material" />
          </mesh>

          {/* Primary Gold Beryllium Hexagonal Mirror Array */}
          <group ref={mirrorRef} position={[0, 0.35, 0.05]}>
            {mirrorSegments.map((pos, idx) => (
              <mesh key={idx} position={pos} rotation={[0, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.24, 0.24, 0.04, 6]} />
                <meshStandardMaterial
                  color="#fbbf24"
                  emissive="#d97706"
                  emissiveIntensity={0.4}
                  roughness={0.1}
                  metalness={0.98}
                />
              </mesh>
            ))}

            {/* Secondary Mirror Support Tripod */}
            {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => {
              const x = Math.cos(angle) * 0.72;
              const y = Math.sin(angle) * 0.72;
              return (
                <group key={i} position={[x / 2, y / 2, 0.48]}>
                  <mesh rotation={[x * 0.8, -y * 0.8, 0]}>
                    <cylinderGeometry args={[0.012, 0.012, 1.0, 8]} />
                    <primitive object={darkMetalMaterial} attach="material" />
                  </mesh>
                </group>
              );
            })}

            {/* Secondary Mirror Reflector */}
            <mesh position={[0, 0, 0.95]}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 6]} />
              <meshStandardMaterial
                color="#fbbf24"
                roughness={0.08}
                metalness={0.98}
              />
            </mesh>
          </group>

          {/* Deployable Solar Panel Wing at Aft */}
          <mesh position={[0, -0.78, -0.45]} rotation={[0.35, 0, 0]}>
            <boxGeometry args={[1.3, 0.32, 0.02]} />
            <primitive object={solarCellMaterial} attach="material" />
          </mesh>

          {/* High-Gain Telemetry Dish */}
          <mesh position={[0.55, -0.4, -0.2]} rotation={[0.5, 0.8, 0]}>
            <coneGeometry args={[0.2, 0.08, 16, 1, true]} />
            <primitive object={whiteHullMaterial} attach="material" />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// =========================================================================
// 2. APPTIO: Modular Space Station Complex (ISS Habitat, Node & Truss)
// Pressurized orbital laboratory, docking nodes, Cupola dome & solar wings
// =========================================================================
export function ApptioMicroservicesProp({ position = [0, 0, 0] }) {
  const stationRef = useRef();
  const solarRef = useRef();

  useFrame((state, delta) => {
    if (stationRef.current) {
      stationRef.current.rotation.y += delta * 0.14;
      stationRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
    }
    if (solarRef.current) {
      solarRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.18;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={stationRef} scale={1.45}>
          {/* Dedicated Studio Fill Light */}
          <pointLight position={[2, 1.5, 2]} color="#93c5fd" intensity={2.0} distance={7} />

          {/* Main Pressurized Laboratory Cylinder */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.48, 0.48, 2.2, 24]} />
            <primitive object={whiteHullMaterial} attach="material" />
          </mesh>

          {/* Module Ribbed Hull Rings */}
          {[-0.8, -0.4, 0.4, 0.8].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.49, 0.015, 8, 24]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
          ))}

          {/* Central Connecting Node & Docking Collar */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.54, 16, 16]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>

          {/* Forward Docking Adapter */}
          <mesh position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.28, 0.38, 0.32, 16]} />
            <primitive object={darkMetalMaterial} attach="material" />
          </mesh>
          <mesh position={[1.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.29, 0.03, 8, 16]} />
            <primitive object={goldFoilMaterial} attach="material" />
          </mesh>

          {/* Cupola Observation Module with Glass Viewports */}
          <group position={[0, 0.52, 0]}>
            <mesh>
              <cylinderGeometry args={[0.24, 0.34, 0.26, 8]} />
              <primitive object={darkMetalMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <sphereGeometry args={[0.2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={0.6}
                roughness={0.1}
                metalness={0.9}
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>

          {/* Integrated Structural Truss (ITS) Beam */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.22, 0.22, 3.4]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>

          {/* Dual Photovoltaic Solar Array Wings */}
          <group ref={solarRef}>
            {/* Port Solar Wing */}
            <mesh position={[0, 0, 2.05]} rotation={[0, 0.25, 0]}>
              <boxGeometry args={[1.5, 0.02, 0.85]} />
              <primitive object={solarCellMaterial} attach="material" />
            </mesh>
            {/* Starboard Solar Wing */}
            <mesh position={[0, 0, -2.05]} rotation={[0, 0.25, 0]}>
              <boxGeometry args={[1.5, 0.02, 0.85]} />
              <primitive object={solarCellMaterial} attach="material" />
            </mesh>
          </group>

          {/* Blinking Navigation LED Beacons at Truss Tips */}
          <pointLight position={[0, 0, 3.0]} color="#10b981" intensity={1.8} distance={2.5} />
          <pointLight position={[0, 0, -3.0]} color="#ef4444" intensity={1.8} distance={2.5} />
        </group>
      </Float>
    </group>
  );
}

// =========================================================================
// 3. JPMORGAN CHASE: Lunar Exploration Lander (Apollo / Artemis LEM)
// Faceted gold MLI descent stage, titanium ascent cabin, RCS quads & footpads
// =========================================================================
export function JPMorganBankingVaultProp({ position = [0, 0, 0] }) {
  const landerRef = useRef();

  useFrame((state, delta) => {
    if (landerRef.current) {
      landerRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={landerRef} scale={1.5}>
          {/* Key Rim Light */}
          <pointLight position={[1.5, 2, 1.8]} color="#fde047" intensity={2.0} distance={7} />

          {/* Octagonal Descent Stage with Gold Thermal Foil */}
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.95, 1.0, 0.7, 8]} />
            <primitive object={goldFoilMaterial} attach="material" />
          </mesh>

          {/* Descent Rocket Engine Bell */}
          <mesh position={[0, -0.75, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.38, 0.48, 16, 1, true]} />
            <primitive object={darkMetalMaterial} attach="material" />
          </mesh>

          {/* 4 Articulated Landing Struts & Footpads */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i * Math.PI) / 2 + Math.PI / 4;
            const x = Math.cos(angle) * 1.15;
            const z = Math.sin(angle) * 1.15;
            return (
              <group key={i}>
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([Math.cos(angle) * 0.65, -0.2, Math.sin(angle) * 0.65, x, -0.9, z])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color="#eab308" linewidth={2} />
                </line>
                <mesh position={[x, -0.9, z]}>
                  <cylinderGeometry args={[0.18, 0.18, 0.03, 12]} />
                  <primitive object={goldFoilMaterial} attach="material" />
                </mesh>
              </group>
            );
          })}

          {/* Upper Ascent Stage Crew Cabin */}
          <mesh position={[0, 0.48, 0]}>
            <boxGeometry args={[1.0, 0.7, 0.9]} />
            <primitive object={whiteHullMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.52, 0.46]}>
            <boxGeometry args={[0.75, 0.48, 0.08]} />
            <primitive object={darkMetalMaterial} attach="material" />
          </mesh>

          {/* Forward Crew Triangular Window Viewports */}
          <mesh position={[-0.22, 0.54, 0.51]}>
            <boxGeometry args={[0.17, 0.13, 0.02]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0.22, 0.54, 0.51]}>
            <boxGeometry args={[0.17, 0.13, 0.02]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
          </mesh>

          {/* Overhead Docking Tunnel & Hatch */}
          <mesh position={[0, 0.88, 0]}>
            <cylinderGeometry args={[0.27, 0.27, 0.16, 16]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>

          {/* Reaction Control System (RCS) Quad Thruster Clusters */}
          {[-0.58, 0.58].map((x, xi) =>
            [-0.52, 0.52].map((z, zi) => (
              <group key={`${xi}-${zi}`} position={[x, 0.48, z]}>
                <mesh>
                  <boxGeometry args={[0.09, 0.09, 0.09]} />
                  <primitive object={titaniumMaterial} attach="material" />
                </mesh>
                <mesh position={[x > 0 ? 0.07 : -0.07, 0, 0]} rotation={[0, 0, x > 0 ? -Math.PI / 2 : Math.PI / 2]}>
                  <coneGeometry args={[0.035, 0.07, 6]} />
                  <primitive object={darkMetalMaterial} attach="material" />
                </mesh>
              </group>
            ))
          )}

          {/* Steerable S-Band High-Gain Dish Antenna */}
          <group position={[0.58, 0.9, -0.3]} rotation={[0.4, 0.6, 0]}>
            <mesh>
              <cylinderGeometry args={[0.016, 0.016, 0.32, 8]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <coneGeometry args={[0.24, 0.09, 16, 1, true]} />
              <primitive object={whiteHullMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
}

// =========================================================================
// 4. OLA: Orbital Telemetry & GPS / Comms Relay Satellite (GPS III / Iridium)
// Parabolic dish, phased-array antennas, solar wings, and xenon blue ion drive
// =========================================================================
export function OlaIotIngestionProp({ position = [0, 0, 0] }) {
  const satelliteRef = useRef();
  const dishRef = useRef();

  useFrame((state, delta) => {
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y += delta * 0.18;
      satelliteRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.1;
    }
    if (dishRef.current) {
      dishRef.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={satelliteRef} scale={1.55}>
          {/* Key Rim Light */}
          <pointLight position={[1.8, 1.8, 1.8]} color="#fed7aa" intensity={2.0} distance={7} />

          {/* Central Satellite Body (Gold Thermal Blanket) */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.75, 0.85, 0.7]} />
            <primitive object={goldFoilMaterial} attach="material" />
          </mesh>

          {/* Nadir Earth-Facing Equipment Deck */}
          <mesh position={[0, 0, 0.38]}>
            <boxGeometry args={[0.7, 0.8, 0.07]} />
            <primitive object={darkMetalMaterial} attach="material" />
          </mesh>

          {/* Gimbaled Telemetry High-Gain Parabolic Dish */}
          <group ref={dishRef} position={[0, 0.22, 0.58]} rotation={[0.4, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.48, 0.16, 24, 1, true]} />
              <meshStandardMaterial
                color="#f8fafc"
                roughness={0.15}
                metalness={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh position={[0, 0, 0.24]}>
              <cylinderGeometry args={[0.02, 0.04, 0.14, 8]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
          </group>

          {/* Mobile IoT Helical Telemetry Antennas */}
          {[-0.22, 0.22].map((x, idx) => (
            <mesh key={idx} position={[x, -0.24, 0.52]} rotation={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.28, 12]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
          ))}

          {/* Extended Solar Array Wings */}
          <group position={[-1.45, 0, 0]}>
            <mesh>
              <boxGeometry args={[1.8, 0.58, 0.02]} />
              <primitive object={solarCellMaterial} attach="material" />
            </mesh>
            <mesh position={[1.0, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} rotation={[0, 0, Math.PI / 2]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
          </group>

          <group position={[1.45, 0, 0]}>
            <mesh>
              <boxGeometry args={[1.8, 0.58, 0.02]} />
              <primitive object={solarCellMaterial} attach="material" />
            </mesh>
            <mesh position={[-1.0, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} rotation={[0, 0, Math.PI / 2]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
          </group>

          {/* Rear Xenon Ion Propulsion Engine with glowing blue exhaust */}
          <mesh position={[0, 0, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.22, 0.15, 16]} />
            <primitive object={darkMetalMaterial} attach="material" />
          </mesh>
          <pointLight position={[0, 0, -0.55]} color="#38bdf8" intensity={2.8} distance={3} />
        </group>
      </Float>
    </group>
  );
}

// =========================================================================
// 5. FICO: Voyager Interstellar Deep Space Probe
// 3.7m parabolic reflector, Golden Record plaque, magnetometer boom & RTG
// =========================================================================
export function FicoKafkaPipelineProp({ position = [0, 0, 0] }) {
  const voyagerRef = useRef();

  useFrame((state, delta) => {
    if (voyagerRef.current) {
      voyagerRef.current.rotation.y += delta * 0.13;
      voyagerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={voyagerRef} scale={1.5}>
          {/* Key Rim Light */}
          <pointLight position={[2, 2, 2]} color="#e9d5ff" intensity={2.0} distance={7} />

          {/* Iconic High-Gain Parabolic Reflector Dish */}
          <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1.3, 0.34, 32, 1, true]} />
            <primitive object={whiteHullMaterial} attach="material" />
          </mesh>

          {/* Sub-Reflector Feed & Tripod on Top of Dish */}
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
            <line key={i}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([0, 0.9, 0, Math.cos(angle) * 0.95, 0.38, Math.sin(angle) * 0.95])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#94a3b8" />
            </line>
          ))}

          {/* 10-Sided Decagonal Equipment Bus */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.68, 0.68, 0.38, 10]} />
            <primitive object={whiteHullMaterial} attach="material" />
          </mesh>

          {/* The Famous Golden Record Mounted on the Spacecraft Bus */}
          <group position={[0.58, 0.08, 0.38]} rotation={[0, 0.6, 0]}>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.24, 0.24, 0.02, 32]} />
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#d97706"
                emissiveIntensity={0.5}
                metalness={0.96}
                roughness={0.12}
              />
            </mesh>
            <mesh position={[0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.025, 16]} />
              <primitive object={darkMetalMaterial} attach="material" />
            </mesh>
          </group>

          {/* Long Magnetometer Boom Arm */}
          <group position={[-0.55, 0, 0]} rotation={[0, 0, 0.3]}>
            <mesh position={[-1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.016, 0.016, 2.3, 8]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            <mesh position={[-2.3, 0, 0]}>
              <boxGeometry args={[0.13, 0.13, 0.13]} />
              <primitive object={whiteHullMaterial} attach="material" />
            </mesh>
          </group>

          {/* RTG Power Canister Boom */}
          <group position={[0.55, -0.1, -0.42]} rotation={[0, 0.8, -0.3]}>
            <mesh position={[0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 1.15, 8]} />
              <primitive object={darkMetalMaterial} attach="material" />
            </mesh>
            {[-0.1, 0, 0.1].map((offset, i) => (
              <mesh key={i} position={[1.2, offset, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.09, 0.09, 0.36, 12]} />
                <primitive object={titaniumMaterial} attach="material" />
              </mesh>
            ))}
          </group>
        </group>
      </Float>
    </group>
  );
}

// =========================================================================
// 6. METABYTE: Gaia / Astrometric Survey & Precision Mapping Spacecraft
// Conical 10m thermal sunshield skirt, dual aperture optics, star trackers
// =========================================================================
export function MetabyteInsuranceEngineProp({ position = [0, 0, 0] }) {
  const gaiaRef = useRef();

  useFrame((state, delta) => {
    if (gaiaRef.current) {
      gaiaRef.current.rotation.y += delta * 0.14;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={gaiaRef} scale={1.5}>
          {/* Key Rim Light */}
          <pointLight position={[1.8, 1.8, 1.8]} color="#fbcfe8" intensity={2.0} distance={7} />

          {/* Conical Deployable Thermal Sunshield Skirt */}
          <mesh position={[0, -0.46, 0]}>
            <cylinderGeometry args={[1.55, 1.85, 0.19, 24]} />
            <primitive object={solarCellMaterial} attach="material" />
          </mesh>

          {/* Sunshield Gold Trim Ring */}
          <mesh position={[0, -0.37, 0]}>
            <torusGeometry args={[1.56, 0.022, 8, 24]} />
            <primitive object={goldFoilMaterial} attach="material" />
          </mesh>

          {/* Hexagonal Service Module */}
          <mesh position={[0, -0.72, 0]}>
            <cylinderGeometry args={[0.88, 0.98, 0.36, 6]} />
            <primitive object={goldFoilMaterial} attach="material" />
          </mesh>

          {/* Cylindrical Optical Bench & Payload Housing */}
          <mesh position={[0, 0.26, 0]}>
            <cylinderGeometry args={[0.88, 0.88, 1.15, 24]} />
            <primitive object={whiteHullMaterial} attach="material" />
          </mesh>

          {/* Precision Dual Telescope Apertures */}
          <group position={[0, 0.32, 0]}>
            <mesh position={[-0.42, 0.1, 0.8]} rotation={[0.2, -0.2, 0]}>
              <cylinderGeometry args={[0.19, 0.19, 0.32, 16]} />
              <primitive object={darkMetalMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.42, 0.1, 0.92]}>
              <circleGeometry args={[0.16, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
            </mesh>

            <mesh position={[0.42, 0.1, 0.8]} rotation={[0.2, 0.2, 0]}>
              <cylinderGeometry args={[0.19, 0.19, 0.32, 16]} />
              <primitive object={darkMetalMaterial} attach="material" />
            </mesh>
            <mesh position={[0.42, 0.1, 0.92]}>
              <circleGeometry args={[0.16, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
            </mesh>
          </group>

          {/* Dual Star Tracker Optical Heads */}
          <mesh position={[0, 0.94, 0]}>
            <cylinderGeometry args={[0.32, 0.46, 0.26, 16]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <coneGeometry args={[0.22, 0.16, 16]} />
            <primitive object={darkMetalMaterial} attach="material" />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

// =========================================================================
// 7. J.P. MORGAN: DART Planetary Defense Spacecraft & Kinetic Shield
// Titanium Whipple impact shield, gold bus, hydrazine tanks & DRACO camera
// =========================================================================
export function JPMorganRiskShieldProp({ position = [0, 0, 0] }) {
  const dartRef = useRef();

  useFrame((state, delta) => {
    if (dartRef.current) {
      dartRef.current.rotation.y += delta * 0.16;
      dartRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.1;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={dartRef} scale={1.55}>
          {/* Key Rim Light */}
          <pointLight position={[1.8, 1.8, 1.8]} color="#cffafe" intensity={2.0} distance={7} />

          {/* Heavy Reinforced Titanium Whipple Shield / Forward Bumper */}
          <mesh position={[0, 0, 0.68]}>
            <cylinderGeometry args={[0.95, 0.95, 0.09, 24]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.73]}>
            <torusGeometry args={[0.92, 0.03, 8, 24]} />
            <primitive object={darkMetalMaterial} attach="material" />
          </mesh>

          {/* Main Spacecraft Bus with MLI Gold Foil */}
          <mesh position={[0, 0, 0.12]}>
            <boxGeometry args={[0.88, 0.88, 0.98]} />
            <primitive object={goldFoilMaterial} attach="material" />
          </mesh>

          {/* Dual Spherical Hydrazine Propellant Tanks */}
          <mesh position={[0, 0.26, -0.44]}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.26, -0.44]}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>

          {/* DRACO High-Resolution Optical Navigation Guidance Camera */}
          <group position={[0, 0.48, 0.42]} rotation={[0.1, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.17, 0.23, 0.42, 16]} />
              <primitive object={darkMetalMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0.22]}>
              <circleGeometry args={[0.15, 16]} />
              <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.7} roughness={0.1} metalness={0.9} />
            </mesh>
          </group>

          {/* Dual ROSA (Roll-Out Solar Arrays) Extended on Booms */}
          <group position={[-1.48, 0, 0.12]}>
            <mesh>
              <boxGeometry args={[1.7, 0.5, 0.02]} />
              <primitive object={solarCellMaterial} attach="material" />
            </mesh>
            <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.22, 12]} />
              <primitive object={darkMetalMaterial} attach="material" />
            </mesh>
          </group>

          <group position={[1.48, 0, 0.12]}>
            <mesh>
              <boxGeometry args={[1.7, 0.5, 0.02]} />
              <primitive object={solarCellMaterial} attach="material" />
            </mesh>
            <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.22, 12]} />
              <primitive object={darkMetalMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
}

// =========================================================================
// 8. SATYAM: Pioneer 10 First-Generation Deep Space Pioneer Spacecraft
// 2.74m aluminum parabolic antenna, gold chassis, long radio dipole whip antennas
// =========================================================================
export function SatyamWaferAutomationProp({ position = [0, 0, 0] }) {
  const pioneerRef = useRef();

  useFrame((state, delta) => {
    if (pioneerRef.current) {
      pioneerRef.current.rotation.y += delta * 0.15;
      pioneerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.28) * 0.08;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={pioneerRef} scale={1.5}>
          {/* Key Rim Light */}
          <pointLight position={[1.8, 1.8, 1.8]} color="#ccfbf1" intensity={2.0} distance={7} />

          {/* Main 2.74-meter Parabolic Antenna Dish */}
          <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[1.25, 0.32, 32, 1, true]} />
            <meshStandardMaterial
              color="#e2e8f0"
              roughness={0.2}
              metalness={0.78}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Central Feed Horn & Instrument Mast */}
          <mesh position={[0, 0.76, 0]}>
            <cylinderGeometry args={[0.032, 0.065, 0.28, 8]} />
            <primitive object={titaniumMaterial} attach="material" />
          </mesh>

          {/* Hexagonal Main Equipment Chassis */}
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.62, 0.68, 0.42, 6]} />
            <primitive object={goldFoilMaterial} attach="material" />
          </mesh>

          {/* Long Slender Radio Dipole Whip Antennas */}
          {[-0.65, 0.65].map((x, i) => (
            <mesh key={i} position={[x, -0.1, 0]} rotation={[0, 0, x > 0 ? -0.8 : 0.8]}>
              <cylinderGeometry args={[0.009, 0.009, 1.9, 8]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
          ))}

          {/* RTG Power Booms Extended on Triangle Trusses */}
          <group position={[0.7, -0.16, -0.32]} rotation={[0, 0.5, -0.4]}>
            <mesh position={[0.72, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 1.35, 8]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            <mesh position={[1.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.13, 0.13, 0.38, 12]} />
              <primitive object={darkMetalMaterial} attach="material" />
            </mesh>
          </group>

          {/* Science Instrument Boom & Plasma Analyzer */}
          <group position={[-0.7, -0.16, -0.32]} rotation={[0, -0.5, 0.4]}>
            <mesh position={[-0.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 1.15, 8]} />
              <primitive object={titaniumMaterial} attach="material" />
            </mesh>
            <mesh position={[-1.25, 0, 0]}>
              <boxGeometry args={[0.2, 0.16, 0.16]} />
              <primitive object={goldFoilMaterial} attach="material" />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
}
