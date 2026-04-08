import { Time } from "./time_system.js";
import { Input } from "./input_system.js";
import { createGame } from "./game_logic.js";
import { draw } from "./renderer.js";
import { resetScore } from "./score_system.js";
import { songs } from "./songs.js";
import { playSong, stopSong } from "./audio_system.js";

const canvas = document.getElementById("gameCanvas");
const selector = document.getElementById("songSelector");
const startBtn = document.getElementById("startBtn");

let game = null;

// Puente global para el tiempo (necesario para input_system)
window.startTimeRef = () => Time.startTime;

// 1. Eliminamos window.handleKeyDown porque ahora game_logic
// procesará el buffer automáticamente dentro del update.

window.handleKeyUp = (e, t, keys) => {
    if (game) game.handleKeyUp(e, t, keys);
};

Input.init();

startBtn.addEventListener("click", () => {
    const selected = selector.value;
    const song = songs[selected];

    if (!song) return;

    stopSong();

    Time.startTime = Date.now();
    resetScore();

    // Reiniciamos el buffer de input al empezar una canción nueva para evitar "fantasmas"
    Input.inputBuffer = []; 

    game = createGame(canvas, song.chart);

    playSong(song.audio);
});

function gameLoop() {
    Time.update();

    if (game) {
        // 2. PASAMOS EL BUFFER: Ahora le enviamos el inputBuffer de Input.js
        // al update del juego para que pueda detectar los "BOTH".
        game.update(Time.current, Input.inputBuffer);
        
        draw(game, canvas, Time.current);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();