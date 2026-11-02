import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import EnvironmentEffects from './EnvironmentEffects';
import Stage1HeroCore from './Stage1HeroCore';
import Stage2Milestones from './Stage2Milestones';
import Stage3ConstellationScene from './Stage3ConstellationScene';
import Stage4TerminalScene from './Stage4TerminalScene';
import CameraFlightController from './CameraFlightController';

// Detect mobile to optimize DPR
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

export default function SceneCanvas({ onHoverSkill, isOrbitActive = true }) {
  return (
    <div className="webgl-container">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45, near: 0.1, far: 200 }}
        dpr={isMobile ? [1, 1.2] : [1, 2]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#06090e', 1);
          const canvas = gl.domElement;
          if (canvas) {
            canvas.style.backgroundColor = '#06090e';
            canvas.addEventListener('webglcontextlost', (e) => {
              e.preventDefault(); // Prevents browser from permanently killing context
            }, false);
            canvas.addEventListener('webglcontextrestored', () => {
              gl.setClearColor('#06090e', 1);
            }, false);
          }
        }}
      >
        <color attach="background" args={['#06090e']} />

        {/* Atmospheric depth fog — objects fade into deep space naturally */}
        <fog attach="fog" args={['#070b14', 45, 145]} />

        <Suspense fallback={null}>
          <EnvironmentEffects isOrbitActive={isOrbitActive} />
          <Stage1HeroCore isOrbitActive={isOrbitActive} />
          <Stage2Milestones />
          <Stage3ConstellationScene onHoverSkill={onHoverSkill} isOrbitActive={isOrbitActive} />
          <Stage4TerminalScene />
          <CameraFlightController isOrbitActive={isOrbitActive} />
        </Suspense>
      </Canvas>
    </div>
  );
}
