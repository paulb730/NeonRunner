import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// NOTE: three/examples modules sometimes lack TS typings; using the JS entrypoint to satisfy TS resolution.
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

export function Lightning() {
  const areaRef = useRef<THREE.RectAreaLight>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const timer = useRef(0);

  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  useFrame((state, delta) => {
    const area = areaRef.current;
    const beam = beamRef.current;
    if (!area || !beam) return;

    timer.current -= delta;

    if (timer.current <= 0) {
      // Randomize next flash
      if (Math.random() < 0.25) {
        area.intensity = THREE.MathUtils.randFloat(10, 26);
        beam.material.opacity = THREE.MathUtils.randFloat(0.35, 0.7);
        timer.current = THREE.MathUtils.randFloat(0.05, 0.14);
      } else {
        timer.current = THREE.MathUtils.randFloat(0.4, 1.3);
      }
    }

    // Smoothly fade flash and beam
    area.intensity = Math.max(area.intensity - delta * 40, 0);
    beam.material.opacity = Math.max((beam.material as THREE.MeshBasicMaterial).opacity - delta * 1.5, 0);

    // Slight movement to emulate light flicker
    area.position.x = Math.sin(state.clock.elapsedTime * 2) * 2;
    beam.position.x = area.position.x;
  });

  return (
    <group>
      <rectAreaLight
        ref={areaRef}
        color="#ffffff"
        intensity={0}
        width={16}
        height={6}
        position={[0, 12, -12]}
        rotation={[-Math.PI / 2.5, 0, 0]}
        castShadow
      />

      {/* RTX-style beam: additive, tone-mapped off, masks shadows */}
      <mesh ref={beamRef} position={[0, 10, -10]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[18, 10]} />
        <meshBasicMaterial
          color="#fff0f0"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
