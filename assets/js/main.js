import { Time } from "./time_system.js";
import { Input } from "./input_system.js";
import { createGame } from "./game_logic.js";
import { draw, drawCountdown } from "./renderer.js";
import { resetScore } from "./score_system.js";
import { songs } from "./songs.js";
import { playSong, stopSong } from "./audio_system.js";
import { initSongSelector } from "./ui_song_selector.js";

const canvas = document.getElementById("gameCanvas");
const selector = document.getElementById("songSelector");
const startBtn = document.getElementById("startBtn");

// 🔥 UI refs (nuevo)
const sidebar = document.getElementById("sidebar");

let game = null;

// 🔥 COUNTDOWN STATE
let countdownActive = false;
let countdownStart = 0;
let countdownDuration = 3500;
let pendingSong = null;

// 🔥 puente global
window.startTimeRef = () => Time.startTime;

window.handleKeyUp = (e, t, keys) => {
    if (game) game.handleKeyUp(e, t, keys);
};

// (por si lo usas en el futuro 👀)
window.handleKeyDown = () => {};

// 🔧 INIT
Input.init();
initSongSelector();

// 🎮 START BUTTON
startBtn.addEventListener("click", () => {
    const selected = selector.value;
    const song = songs[selected];

    if (!song) return;

    // 🛑 evitar spam de inicio
    if (countdownActive) return;

    stopSong();

    // 📱 cerrar sidebar en móvil (extra seguro)
    if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove("active");
    }

    // reset estado
    game = null;
    Input.inputBuffer = [];

    // 👇 iniciar countdown
    countdownActive = true;
    countdownStart = Date.now();
    pendingSong = song;
});

function gameLoop() {
    Time.update();

    // 🧠 COUNTDOWN
    if (countdownActive) {
        const elapsed = Date.now() - countdownStart;

        drawCountdown(canvas, elapsed);

        if (elapsed >= countdownDuration) {
            countdownActive = false;

            Time.startTime = Date.now();
            resetScore();

            Input.inputBuffer = [];

            game = createGame(canvas, pendingSong.chart);

            // 🔥 sync audio (ligero delay)
            setTimeout(() => {
                playSong(pendingSong.audio);
            }, 100);
        }

    } 
    // 🎮 GAME LOOP
    else if (game) {
        game.update(Time.current, Input.inputBuffer);
        draw(game, canvas, Time.current, Input.keys);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();