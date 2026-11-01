import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CameraFlightController({ isOrbitActive = true }) {
  const { camera, pointer } = useThree();
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);

  // Define 3D CatmullRom spline path for continuous smooth camera flight
  const { camPath, targetPath } = useMemo(() => {
    const camPoints = [
      new THREE.Vector3(0, 0, 7.5),        // 0: Hero
      new THREE.Vector3(1.2, -10, 6.2),    // 1: Sage
      new THREE.Vector3(-1.2, -17, 6.2),   // 2: Apptio
      new THREE.Vector3(1.2, -24, 6.2),    // 3: JPMorgan Chase
      new THREE.Vector3(-1.2, -31, 6.2),   // 4: Ola
      new THREE.Vector3(1.2, -38, 6.2),    // 5: FICO
      new THREE.Vector3(-1.2, -45, 6.2),   // 6: Metabyte
      new THREE.Vector3(1.2, -52, 6.2),    // 7: J.P. Morgan BPM
      new THREE.Vector3(-1.2, -59, 6.2),   // 8: Satyam
      new THREE.Vector3(0.4, -70, 7.8),    // 9: Skill Constellation (Framed for Split View)
      new THREE.Vector3(0, -77, 7.0),      // 10: Posts (Thought Leadership)
      new THREE.Vector3(0, -84, 5.5)       // 11: Terminal Platform
    ];

    const lookPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -10, 0),
      new THREE.Vector3(0, -17, 0),
      new THREE.Vector3(0, -24, 0),
      new THREE.Vector3(0, -31, 0),
      new THREE.Vector3(0, -38, 0),
      new THREE.Vector3(0, -45, 0),
      new THREE.Vector3(0, -52, 0),
      new THREE.Vector3(0, -59, 0),
      new THREE.Vector3(0.8, -70, 0),
      new THREE.Vector3(0, -77, 0),
      new THREE.Vector3(0, -84, 0)
    ];

    return {
      camPath: new THREE.CatmullRomCurve3(camPoints, false, 'centripetal'),
      targetPath: new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal')
    };
  }, []);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        targetProgressRef.current = Math.min(Math.max(self.progress, 0), 0.999);
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Frame loop with smooth lerping & subtle pointer parallax
  useFrame((state, delta) => {
    // Smooth dampening towards target scroll progress
    currentProgressRef.current = THREE.MathUtils.damp(
      currentProgressRef.current,
      targetProgressRef.current,
      6.0,
      delta
    );

    const t = Math.min(Math.max(currentProgressRef.current, 0), 0.999);

    const baseCamPos = camPath.getPointAt(t);
    const baseTargetPos = targetPath.getPointAt(t);

    // Subtle cursor parallax when orbit is active
    const parallaxX = isOrbitActive ? pointer.x * 0.45 : 0;
    const parallaxY = isOrbitActive ? pointer.y * 0.35 : 0;

    camera.position.x = baseCamPos.x + parallaxX;
    camera.position.y = baseCamPos.y + parallaxY;
    camera.position.z = baseCamPos.z;

    const lookTarget = new THREE.Vector3(
      baseTargetPos.x + parallaxX * 0.3,
      baseTargetPos.y + parallaxY * 0.3,
      baseTargetPos.z
    );

    camera.lookAt(lookTarget);
  });

  return null;
}
