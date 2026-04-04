const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let startTime = Date.now();

let notes = [
    { type: "left", time: 1000, hit: false },
    { type: "right", time: 2000, hit: false },
    { type: "both", time: 3000, hit: false }
];

let keys = {
    f: false,
    j: false
};

// ================= INPUT =================
document.addEventListener("keydown", (e) => {
    let currentTime = Date.now() - startTime;

    let inputType = null;

    if (e.key === "f") {
        inputType = keys.j ? "both" : "left";
        keys.f = true;
    }

    if (e.key === "j") {
        inputType = keys.f ? "both" : "right";
        keys.j = true;
    }

    if (!inputType) return;

    // Buscar la nota más cercana del mismo tipo
    let note = notes
        .filter(n => !n.hit && n.type === inputType)
        .sort((a, b) => Math.abs(a.time - currentTime) - Math.abs(b.time - currentTime))[0];

    if (!note) return;

    let result = checkHit(note, currentTime);

    if (result !== "miss") {
        console.log(result);
        note.hit = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "f") keys.f = false;
    if (e.key === "j") keys.j = false;
});

// ================= LÓGICA =================
function checkHit(note, currentTime) {
    let diff = Math.abs(currentTime - note.time);

    if (diff < 100) return "perfect";
    if (diff < 200) return "good";

    return "miss";
}

// ================= RENDER =================
function drawNotes(currentTime) {
    notes.forEach(note => {
        if (note.hit) return;

        let timeDiff = note.time - currentTime;

        let x = canvas.width / 2;

        if (note.type === "left") x -= 100;
        if (note.type === "right") x += 100;

        let y = canvas.height - (timeDiff * 0.2);

        ctx.fillStyle = "white";

        if (note.type === "both") {
            ctx.fillStyle = "pink";
        }

        ctx.fillRect(x - 20, y - 20, 40, 40);
    });
}

// ================= GAME LOOP =================
function gameLoop() {
    let currentTime = Date.now() - startTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNotes(currentTime);

    // Detectar misses automáticos
    notes.forEach(note => {
        if (!note.hit) {
            let diff = currentTime - note.time;

            if (diff > 200) {
                note.hit = true;
                console.log("miss");
            }
        }
    });

    // Verificar fin del juego
    let allDone = notes.every(n => n.hit);

    if (allDone) {
        console.log("Juego terminado");
        return;
    }

    requestAnimationFrame(gameLoop);
}

// ================= START =================
gameLoop();