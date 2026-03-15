import { useGameStore } from '../store';

export function UI() {
  const { score, gameStarted, gameOver, startGame } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 font-mono text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
            NEON RUNNER
          </h1>
          {gameStarted && (
            <div className="text-2xl mt-2 font-bold text-yellow-400 drop-shadow-[0_0_5px_rgba(255,255,0,0.8)]">
              SCORE: {score}
            </div>
          )}
        </div>
      </div>

      {/* Center Content */}
      <div className="flex-1 flex items-center justify-center">
        {!gameStarted && !gameOver && (
          <div className="text-center pointer-events-auto bg-black/50 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
            <h2 className="text-3xl mb-6 text-cyan-300">Ready to Run?</h2>
            <p className="mb-6 text-gray-300">
              Use <kbd className="bg-gray-800 px-2 py-1 rounded text-cyan-400">Left/Right</kbd> to dodge.
              <br />
              Use <kbd className="bg-gray-800 px-2 py-1 rounded text-cyan-400">Up/Space</kbd> to jump over spikes.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] hover:scale-105"
            >
              START GAME
            </button>
          </div>
        )}

        {gameOver && (
          <div className="text-center pointer-events-auto bg-black/80 p-10 rounded-3xl border border-red-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(255,0,0,0.3)]">
            <h2 className="text-5xl mb-2 font-black text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
              GAME OVER
            </h2>
            <div className="text-3xl mb-8 text-yellow-400 font-bold">
              FINAL SCORE: {score}
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,0,0,0.8)] hover:scale-105"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
