import { create } from 'zustand';

interface GameState {
  score: number;
  speed: number;
  gameOver: boolean;
  gameStarted: boolean;
  lane: number; // -1 (left), 0 (center), 1 (right)
  isJumping: boolean;
  startGame: () => void;
  endGame: () => void;
  incrementScore: (amount: number) => void;
  increaseSpeed: (amount: number) => void;
  setLane: (lane: number) => void;
  setIsJumping: (isJumping: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  speed: 15,
  gameOver: false,
  gameStarted: false,
  lane: 0,
  isJumping: false,
  startGame: () => set({ gameStarted: true, gameOver: false, score: 0, speed: 15, lane: 0, isJumping: false }),
  endGame: () => set({ gameOver: true, gameStarted: false }),
  incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
  increaseSpeed: (amount) => set((state) => ({ speed: state.speed + amount })),
  setLane: (lane) => set({ lane }),
  setIsJumping: (isJumping) => set({ isJumping }),
  reset: () => set({ score: 0, speed: 15, gameOver: false, gameStarted: false, lane: 0, isJumping: false }),
}));
