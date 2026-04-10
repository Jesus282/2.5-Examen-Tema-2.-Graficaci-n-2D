import { score, combo, getFinalResult } from "./score_system.js";

export function draw(game, canvas, currentTime) {
    const ctx = game.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🌌 Fondo gradiente interno
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#2a1f3d");
    bg.addColorStop(1, "#0d0b14");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ✨ Hit Line (línea mágica)
    ctx.shadowColor = "#f6c453";
    ctx.shadowBlur = 15;
    ctx.strokeStyle = "#f6c453";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, game.hitLineY);
    ctx.lineTo(canvas.width, game.hitLineY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 💎 Notas
    game.notes.forEach(note => {
        if (note.hit) return;

        let x = canvas.width / 2;

        if (note.type === "left") x -= 120;
        if (note.type === "right") x += 120;

        let y = game.getNoteY(note, currentTime);

        // 🎨 Colores por tipo
        let color = "#9f7aea"; // left
        if (note.type === "right") color = "#ff4da6";
        if (note.type === "both") color = "#f6c453";

        // 🌈 HOLD NOTES
        if (note.endTime) {
            let endY = game.getNoteEndY(note, currentTime);

            const grad = ctx.createLinearGradient(0, y, 0, endY);
            grad.addColorStop(0, "#9f7aea");
            grad.addColorStop(1, "#ff4da6");

            ctx.globalAlpha = 0.6;
            ctx.fillStyle = grad;
            ctx.fillRect(x - 10, y, 20, endY - y);
            ctx.globalAlpha = 1;

            // extremos tipo gema
            drawNote(ctx, x, y, color);
            drawNote(ctx, x, endY, color);

            return;
        }

        drawNote(ctx, x, y, color);
    });

    // ✨ Feedback
    const fb = game.feedbackRef();
    if (fb.timer > 0) {
        ctx.font = "28px Segoe UI";
        ctx.textAlign = "center";

        if (fb.text === "perfect") {
            ctx.fillStyle = "#f6c453";
            ctx.shadowColor = "#f6c453";
        } else if (fb.text === "good") {
            ctx.fillStyle = "#9f7aea";
            ctx.shadowColor = "#9f7aea";
        } else {
            ctx.fillStyle = "#999";
            ctx.shadowColor = "#999";
        }

        ctx.shadowBlur = 10;
        ctx.fillText(fb.text.toUpperCase(), canvas.width / 2, 80);
        ctx.shadowBlur = 0;

        game.tickFeedback();
    }

    // 🔢 SCORE
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Segoe UI";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 20, 30);

    // 🔥 COMBO (protagonista)
    ctx.textAlign = "center";
    ctx.font = "40px Segoe UI";

    ctx.fillStyle = "#ff4da6";
    ctx.shadowColor = "#ff4da6";
    ctx.shadowBlur = 15;

    if (combo > 0) {
        ctx.fillText(combo + " COMBO", canvas.width / 2, 140);
    }

    ctx.shadowBlur = 0;

    // 🏁 END SCREEN
    if (game.gameEndedRef()) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = "center";
        ctx.font = "32px Segoe UI";

        ctx.fillStyle = "#f6c453";
        ctx.shadowColor = "#f6c453";
        ctx.shadowBlur = 15;

        ctx.fillText("RESULTADO", canvas.width / 2, 180);

        ctx.shadowBlur = 0;

        ctx.font = "24px Segoe UI";
        ctx.fillText(getFinalResult(), canvas.width / 2, 230);
    }
    
    function drawNote(ctx, x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(x - 5, y - 5, 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();
}
}