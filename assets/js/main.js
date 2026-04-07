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

// puente global
window.startTimeRef = () => Time.startTime;

window.handleKeyDown = (e, t, keys, keyTimes) => {
    if (game) game.handleKeyDown(e, t, keys, keyTimes);
};

window.handleKeyUp = (e, t, keys) => {
    if (game) game.handleKeyUp(e, t, keys);
};

Input.init();

// iniciar juego con chart seleccionado
startBtn.addEventListener("click", () => {
    const selected = selector.value;
    const song = songs[selected];

    if (!song) return;

    stopSong();

    Time.startTime = Date.now();
    resetScore();

    game = createGame(canvas, song.chart);

    playSong(song.audio);
});

function gameLoop() {
    Time.update();

    if (game) {
        game.update(Time.current);
        draw(game, canvas, Time.current);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();