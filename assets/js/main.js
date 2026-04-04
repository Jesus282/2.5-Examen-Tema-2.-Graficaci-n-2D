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

document.addEventListener("keydown", (e) => {
    if (e.key === "f") keys.f = true;
    if (e.key === "j") keys.j = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "f") keys.f = false;
    if (e.key === "j") keys.j = false;
});

function checkHit(note, currentTime) {
    let diff = Math.abs(currentTime - note.time);

    if (diff < 100) return "perfect";
    if (diff < 200) return "good";

    return "miss";
}

function drawNotes(currentTime) {
    notes.forEach(note => {
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

function handleInput(currentTime) {
    let inputType = null;

    if (keys.f && keys.j) inputType = "both";
    else if (keys.f) inputType = "left";
    else if (keys.j) inputType = "right";

    if (!inputType) return;

    let note = notes.find(n => !n.hit);

    if (!note) return;

    if (note.type === inputType) {
        let result = checkHit(note, currentTime);
        console.log(result);

        note.hit = true;
    }
}

function gameLoop() {
    let currentTime = Date.now() - startTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawNotes(currentTime);
    handleInput(currentTime);

    requestAnimationFrame(gameLoop);
}

gameLoop();