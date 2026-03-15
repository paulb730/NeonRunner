import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function Nebula() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.02;
    groupRef.current.rotation.x += delta * 0.01;
  });

  return (
    <group ref={groupRef}>
      <Sparkles
        count={200}
        scale={[60, 30, 80]}
        size={2.4}
        speed={0.25}
        noise={0.7}
        color="#FF1515"
        opacity={0.4}
      />
    </group>
  );
}
