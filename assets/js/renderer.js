export function draw(game, canvas, currentTime) {
    const ctx = game.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hit line
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, game.hitLineY);
    ctx.lineTo(canvas.width, game.hitLineY);
    ctx.stroke();

    // Notes
    game.notes.forEach(note => {
        if (note.hit) return;

        let x = canvas.width / 2;

        if (note.type === "left") x -= 120;
        if (note.type === "right") x += 120;

        let y = game.getNoteY(note, currentTime);

        if (note.endTime) {
            let endY = game.getNoteEndY(note, currentTime);

            ctx.fillStyle = "rgba(0,255,255,0.5)";
            ctx.fillRect(x - 10, y, 20, endY - y);

            ctx.fillStyle = "cyan";
            ctx.fillRect(x - 20, y - 20, 40, 40);

            ctx.fillStyle = "blue";
            ctx.fillRect(x - 20, endY - 20, 40, 40);

            return;
        }

        ctx.fillStyle = note.type === "both" ? "pink" : "white";
        ctx.fillRect(x - 20, y - 20, 40, 40);
    });

    // Feedback
    const fb = game.feedbackRef();
    if (fb.timer > 0) {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.fillText(fb.text.toUpperCase(), canvas.width / 2 - 50, 50);
        game.tickFeedback();
    }

    // End
    if (game.gameEndedRef()) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("FIN DEL JUEGO", 180, 200);
    }
}