import { Time } from "./time_system.js";
import { Input } from "./input_system.js";
import { createGame } from "./game_logic.js";
import { draw } from "./renderer.js";

const canvas = document.getElementById("gameCanvas");
const game = createGame(canvas);

// puente global (para no romper tu lógica original)
window.startTimeRef = () => Time.startTime;

window.handleKeyDown = (e, t, keys, keyTimes) => {
    game.handleKeyDown(e, t, keys, keyTimes);
};

window.handleKeyUp = (e, t, keys) => {
    game.handleKeyUp(e, t, keys);
};

Input.init();

function gameLoop() {
    Time.update();

    game.update(Time.current);
    draw(game, canvas, Time.current);

    requestAnimationFrame(gameLoop);
}

gameLoop();