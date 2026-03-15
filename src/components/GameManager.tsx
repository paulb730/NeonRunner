import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import { useRef } from 'react';

export function GameManager() {
  const { gameStarted, gameOver } = useGameStore();
  const scoreAccumulator = useRef(0);

  useFrame((state, delta) => {
    if (gameStarted && !gameOver) {
      const currentSpeed = useGameStore.getState().speed;
      
      // Increase speed slowly over time
      if (currentSpeed < 50) {
        useGameStore.setState({ speed: currentSpeed + delta * 0.5 });
      }

      // Increment score based on distance
      scoreAccumulator.current += currentSpeed * delta * 0.5;
      if (scoreAccumulator.current >= 1) {
        const points = Math.floor(scoreAccumulator.current);
        useGameStore.getState().incrementScore(points);
        scoreAccumulator.current -= points;
      }
    }
  });

  return null;
}


