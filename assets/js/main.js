const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let startTime = Date.now();

const hitLineY = canvas.height - 80;
const speed = 0.25;

// 🎯 TAP
const PERFECT = 10;
const GOOD = 25;
const MISS = 40;

// 🎯 ventanas
const INPUT_WINDOW = 400;
const HOLD_WINDOW = 500;
const RELEASE_MARGIN = 120;

let feedback = "";
let feedbackTimer = 0;

let activeHold = null;

// 🔥 NUEVO (delay de fin)
let gameEnded = false;
let endTimer = 0;

let notes = [
    { type: "left", time: 1000, hit: false },
    { type: "right", time: 2000, hit: false },

    {
        type: "left",
        time: 3000,
        endTime: 7000,
        hit: false,
        started: false
    }
];

// ================= INPUT =================
document.addEventListener("keydown", (e) => {
    let currentTime = Date.now() - startTime;

    let inputType = null;
    if (e.key === "f") inputType = "left";
    if (e.key === "j") inputType = "right";
    if (!inputType) return;

    let note = getClosestNote(inputType, currentTime);
    if (!note) return;

    // HOLD START
    if (note.endTime) {
        let diff = Math.abs(currentTime - note.time);
        if (diff > HOLD_WINDOW) return;

        note.started = true;
        activeHold = note;

        showFeedback("start");
        return;
    }

    // TAP
    let y = getNoteY(note, currentTime);
    let result = judge(y);

    showFeedback(result);
    if (result !== "miss") note.hit = true;
});

document.addEventListener("keyup", (e) => {
    let currentTime = Date.now() - startTime;

    let inputType = null;
    if (e.key === "f") inputType = "left";
    if (e.key === "j") inputType = "right";
    if (!inputType) return;

    if (!activeHold) return;
    if (activeHold.type !== inputType) return;

    if (currentTime < activeHold.endTime - RELEASE_MARGIN) {
        fail(activeHold);
    }
});

// ================= LÓGICA =================
function getClosestNote(type, currentTime) {
    return notes
        .filter(n => {
            if (n.hit) return false;
            if (n.type !== type) return false;

            let diff = Math.abs(currentTime - n.time);

            if (n.endTime) return diff <= HOLD_WINDOW;
            return diff <= INPUT_WINDOW;
        })
        .sort((a, b) =>
            Math.abs(currentTime - a.time) -
            Math.abs(currentTime - b.time)
        )[0];
}

function getNoteY(note, currentTime) {
    return canvas.height - ((note.time - currentTime) * speed);
}

function getNoteEndY(note, currentTime) {
    return canvas.height - ((note.endTime - currentTime) * speed);
}

function judge(y) {
    let diff = Math.abs(y - hitLineY);

    if (diff <= PERFECT) return "perfect";
    if (diff <= GOOD) return "good";
    return "miss";
}

function fail(note) {
    note.hit = true;
    activeHold = null;
    showFeedback("miss");
}

function showFeedback(text) {
    feedback = text;
    feedbackTimer = 20;
}

// ================= RENDER =================
function drawHitLine() {
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, hitLineY);
    ctx.lineTo(canvas.width, hitLineY);
    ctx.stroke();
}

function drawNotes(currentTime) {
    notes.forEach(note => {
        if (note.hit) return;

        let x = canvas.width / 2;
        if (note.type === "left") x -= 100;
        if (note.type === "right") x += 100;

        let y = getNoteY(note, currentTime);

        if (note.endTime) {
            let endY = getNoteEndY(note, currentTime);

            ctx.fillStyle = activeHold === note
                ? "rgba(0,255,0,0.6)"
                : "rgba(0,255,255,0.5)";

            ctx.fillRect(x - 10, y, 20, endY - y);

            ctx.fillStyle = "cyan";
            ctx.fillRect(x - 20, y - 20, 40, 40);

            ctx.fillStyle = "blue";
            ctx.fillRect(x - 20, endY - 20, 40, 40);
            return;
        }

        ctx.fillStyle = "white";
        ctx.fillRect(x - 20, y - 20, 40, 40);
    });
}

function drawFeedback() {
    if (feedbackTimer > 0) {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText(feedback.toUpperCase(), canvas.width / 2 - 50, 50);
        feedbackTimer--;
    }
}

// ================= GAME LOOP =================
function gameLoop() {
    let currentTime = Date.now() - startTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawHitLine();
    drawNotes(currentTime);
    drawFeedback();

    notes.forEach(note => {
        if (note.hit) return;

        let y = getNoteY(note, currentTime);

        if (!note.endTime && y > hitLineY + MISS) {
            fail(note);
            return;
        }

        if (note.endTime) {
            let endY = getNoteEndY(note, currentTime);

            if (!note.started && y > hitLineY + MISS) {
                fail(note);
                return;
            }

            if (note.started && !note.hit && endY >= hitLineY) {
                let result = judge(endY);

                showFeedback(result);

                note.hit = true;
                activeHold = null;
            }
        }
    });

    // 🔥 FIN CON DELAY
    let allDone = notes.every(n => n.hit);

    if (allDone && !gameEnded) {
        gameEnded = true;
        endTimer = 60; // ~1 segundo
    }

    if (gameEnded) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("FIN DEL JUEGO", 180, 200);

        endTimer--;

        if (endTimer <= 0) {
            return;
        }
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();