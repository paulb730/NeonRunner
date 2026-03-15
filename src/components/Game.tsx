import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import { Player } from './Player';
import { Ground } from './Ground';
import { Obstacles } from './Obstacles';
import { GameManager } from './GameManager';
import { Nebula } from './Nebula';
import { Lightning } from './Lightning';
import { useGameStore } from '../store';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

export function Game() {
  const { gameStarted, gameOver } = useGameStore();

  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          // three@0.183 uses ColorSpace enums instead of outputEncoding
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 5, 45]} />

        {/* Neon lighting setup */}
        <ambientLight intensity={0.15} />
        <pointLight color="#FF1515" intensity={1.2} position={[0, 5, 2]} distance={20} decay={2} />
        <pointLight color="#ff00ff" intensity={0.8} position={[-4, 3, -4]} distance={18} decay={2} />
        <pointLight color="#ff0055" intensity={0.6} position={[4, 3, -4]} distance={18} decay={2} />

        <directionalLight
          castShadow
          position={[10, 20, 10]}
          intensity={0.8}
          shadow-mapSize={[1024, 1024]}
        >
          <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
        </directionalLight>

        <Environment preset="night" />

        <Nebula />
        <Lightning />

        <GameManager />
        <Player />
        <Obstacles />
        <Ground />

        {/* Post-processing for that Geometry Dash neon feel */}
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.2} height={480} />
         
        </EffectComposer>
      </Canvas>
    </div>
  );
}
