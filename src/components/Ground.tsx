import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import * as THREE from 'three';

export function Ground() {
  const gridRef = useRef<THREE.GridHelper>(null);
  const { gameOver, gameStarted } = useGameStore();

  useFrame((state, delta) => {
    if (!gridRef.current || gameOver || !gameStarted) return;

    const speed = useGameStore.getState().speed;
    // Move grid backwards to simulate forward movement
    gridRef.current.position.z += speed * delta;

    // Reset grid position to create endless effect
    if (gridRef.current.position.z > 10) {
      gridRef.current.position.z -= 10;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 200]} />
        <meshStandardMaterial color="#05030f" metalness={1} roughness={0.1} />
      </mesh>

      {/* Neon lane guides */}
      <group position={[0, 0.01, 0]}>
        {[-2, 0, 2].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <boxGeometry args={[0.05, 0.02, 200]} />
            <meshStandardMaterial
              color="#FF1515"
              emissive="#f86565"
              emissiveIntensity={5}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      
    </group>
  );
}
