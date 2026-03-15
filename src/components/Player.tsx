import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import * as THREE from 'three';

const LANE_WIDTH = 2;
const JUMP_HEIGHT = 2.5;
const GRAVITY = 20;
const JUMP_VELOCITY = 8;

export function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const { setLane, setIsJumping, gameOver, gameStarted } = useGameStore();
  
  const velocityY = useRef(0);
  const positionY = useRef(0.5);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState();
      if (state.gameOver || !state.gameStarted) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setLane(Math.max(state.lane - 1, -1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setLane(Math.min(state.lane + 1, 1));
      } else if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && !state.isJumping) {
        setIsJumping(true);
        velocityY.current = JUMP_VELOCITY;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setLane, setIsJumping]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const ring = ringRef.current;

    if (!group) return;

    if (!gameStarted) {
      group.position.set(0, 0.5, 0);
      group.rotation.set(0, 0, 0);
      positionY.current = 0.5;
      velocityY.current = 0;
      if (ring) ring.rotation.set(0, 0, 0);
      return;
    }

    if (gameOver) return;

    const currentLane = useGameStore.getState().lane;
    const isJumping = useGameStore.getState().isJumping;

    // Smooth lane transition
    const targetX = currentLane * LANE_WIDTH;
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, 10 * delta);

    // Jump physics
    if (isJumping) {
      velocityY.current -= GRAVITY * delta;
      positionY.current += velocityY.current * delta;

      if (positionY.current <= 0.5) {
        positionY.current = 0.5;
        velocityY.current = 0;
        setIsJumping(false);
      }
    }

    group.position.y = positionY.current;

    // Rotate player group for visual flair and ring for visible spin
    group.rotation.x += 10 * delta;
    //group.rotation.y += 2 * delta;

    if (ring) {
      ring.rotation.z += 6 * delta;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.5, 0]} castShadow>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#ff1515"
          emissive="#ffb8b8"
          emissiveIntensity={0.9}
          metalness={1}
          roughness={0.1}
          toneMapped={false}
        />
      </mesh>

      {/* Spinning ring to make rotation visible */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.8, 0.08, 16, 60]} />
        <meshStandardMaterial
          color="#808080"
          emissive="#fa8dcd"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
