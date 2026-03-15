import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import * as THREE from 'three';

const LANE_WIDTH = 2;
const SPAWN_Z = -100;
const DESPAWN_Z = 10;
const MAX_OBSTACLES = 20;

interface ObstacleData {
  active: boolean;
  lane: number; // -1, 0, 1
  type: 'spike' | 'block';
  z: number;
  passed: boolean;
}

export function Obstacles() {
  const { gameOver, gameStarted, endGame } = useGameStore();
  
  // Use refs for performance instead of React state
  const obstacles = useRef<ObstacleData[]>(
    Array.from({ length: MAX_OBSTACLES }, () => ({
      active: false,
      lane: 0,
      type: 'spike',
      z: SPAWN_Z,
      passed: false,
    }))
  );
  
  const groupRef = useRef<THREE.Group>(null);
  const distanceTraveled = useRef(0);
  const nextSpawnDistance = useRef(20);

  // Reset obstacles when game starts
  useFrame((state, delta) => {
    if (gameOver || !gameStarted || !groupRef.current) {
      if (!gameStarted) {
        // Reset state if not started
        obstacles.current.forEach(obs => obs.active = false);
        distanceTraveled.current = 0;
        nextSpawnDistance.current = 20;
        groupRef.current?.children.forEach(child => child.visible = false);
      }
      return;
    }

    const currentSpeed = useGameStore.getState().speed;
    const playerLane = useGameStore.getState().lane;
    const isJumping = useGameStore.getState().isJumping;
    
    distanceTraveled.current += currentSpeed * delta;

    // Spawn new obstacles
    if (distanceTraveled.current > nextSpawnDistance.current) {
      nextSpawnDistance.current += Math.max(10, 30 - currentSpeed * 0.5); // Spawn faster as speed increases
      
      // Find inactive obstacle to recycle
      const inactiveIdx = obstacles.current.findIndex(o => !o.active);
      if (inactiveIdx !== -1) {
        obstacles.current[inactiveIdx] = {
          active: true,
          lane: Math.floor(Math.random() * 3) - 1,
          type: Math.random() > 0.5 ? 'spike' : 'block',
          z: SPAWN_Z,
          passed: false,
        };
      }
    }

    // Update and check collisions
    obstacles.current.forEach((obs, index) => {
      if (!obs.active) return;

      obs.z += currentSpeed * delta;

      // Update mesh position
      const child = groupRef.current!.children[index];
      if (child) {
        child.position.set(obs.lane * LANE_WIDTH, obs.type === 'spike' ? 0.5 : 1, obs.z);
        child.visible = true;
        
        // Rotate spikes for effect
        if (obs.type === 'spike') {
          child.rotation.y += delta * 2;
        }
      }

      // Collision detection
      // Player is at z=0, width/depth ~1
      if (obs.z > -0.8 && obs.z < 0.8) {
        if (obs.lane === playerLane) {
          if (obs.type === 'spike') {
            // Spikes can be jumped over
            if (!isJumping) {
              endGame();
            }
          } else if (obs.type === 'block') {
            // Blocks are too tall to jump over easily, or maybe require precise timing
            // Let's say blocks are instant death if in same lane
            endGame();
          }
        }
      }

      // Scoring
      if (obs.z > 1 && !obs.passed) {
        obs.passed = true;
      }

      // Despawn
      if (obs.z > DESPAWN_Z) {
        obs.active = false;
        if (child) child.visible = false;
      }
    });
  });

  // Pre-create geometry and materials
  const spikeGeo = useMemo(() => new THREE.ConeGeometry(0.8, 1, 4), []);
  const spikeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff0055',
        emissive: '#ff0055',
        emissiveIntensity: 2,
        metalness: 0.1,
        roughness: 0.1,
        toneMapped: false,
      }),
    []
  );
  
  const blockGeo = useMemo(() => new THREE.BoxGeometry(1.8, 2, 1), []);
  const blockMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffaa00',
        emissive: '#ffcd69',
        emissiveIntensity: 1,
        metalness: 0.1,
        roughness: 0.1,
        toneMapped: false,
      }),
    []
  );

  return (
    <group ref={groupRef}>
      {obstacles.current.map((obs, i) => (
        <mesh
          key={i}
          visible={false}
          geometry={obs.type === 'spike' ? spikeGeo : blockGeo}
          material={obs.type === 'spike' ? spikeMat : blockMat}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

