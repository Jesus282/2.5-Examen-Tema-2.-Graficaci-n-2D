import { score, combo, getFinalResult } from "./score_system.js";

/* =========================
   🎮 GAME RENDER
========================= */
export function draw(game, canvas, currentTime, keys) {
    const ctx = game.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🌌 Fondo
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#2a1f3d");
    bg.addColorStop(1, "#0d0b14");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ✨ Hit Line
    ctx.strokeStyle = "#f6c453";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, game.hitLineY);
    ctx.lineTo(canvas.width, game.hitLineY);
    ctx.stroke();

    const HIT_DURATION = 150;

    // 💎 Notas
    game.notes.forEach(note => {

        let x = canvas.width / 2;
        if (note.type === "left") x -= 120;
        if (note.type === "right") x += 120;

        let color = "#9f7aea";
        if (note.type === "right") color = "#ff4da6";
        if (note.type === "both") color = "#f6c453";

        // =========================
        // 💥 HIT EFECTO PRO
        // =========================
        if (note.hit) {
            const elapsed = Date.now() - (note.hitTime || 0);

            if (elapsed < HIT_DURATION) {
                let progress = elapsed / HIT_DURATION;

                let size = 30 + (progress * 40);
                let alpha = 1 - progress;

                drawHitEffect(ctx, x, game.hitLineY, color, size, alpha);
            }

            return;
        }

        let y = game.getNoteY(note, currentTime);

        // =========================
        // 🌈 HOLD PRO
        // =========================
        if (note.endTime) {
            let endY = game.getNoteEndY(note, currentTime);

            let isHolding = false;

            if (keys) {
                if (note.type === "left") isHolding = keys.f;
                if (note.type === "right") isHolding = keys.j;
                if (note.type === "both") isHolding = keys.f && keys.j;
            }

            let width = isHolding ? 14 : 10;

            // 💓 pulso
            if (isHolding) {
                let pulse = 1 + Math.sin(Date.now() * 0.01) * 0.2;
                width *= pulse;

                ctx.shadowColor = color;
                ctx.shadowBlur = 25;
            }

            // cuerpo
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = color;
            ctx.fillRect(x - width / 2, y, width, endY - y);
            ctx.globalAlpha = 1;

            ctx.shadowBlur = 0;

            // extremos
            drawNote(ctx, x, y, color, isHolding ? 28 : 22);
            drawNote(ctx, x, endY, color, isHolding ? 28 : 22);

            return;
        }

        // =========================
        // 💎 TAP NORMAL
        // =========================
        drawNote(ctx, x, y, color);
    });

    // ✨ Feedback texto
    const fb = game.feedbackRef();
    if (fb.timer > 0) {
        ctx.font = "32px Segoe UI";
        ctx.textAlign = "center";

        if (fb.text === "perfect") {
            ctx.fillStyle = "#f6c453";
            ctx.shadowColor = "#f6c453";
        } else if (fb.text === "good") {
            ctx.fillStyle = "#9f7aea";
            ctx.shadowColor = "#9f7aea";
        } else {
            ctx.fillStyle = "#ff4d4d";
            ctx.shadowColor = "#ff4d4d";
        }

        ctx.shadowBlur = 12;
        ctx.fillText(fb.text.toUpperCase(), canvas.width / 2, 80);
        ctx.shadowBlur = 0;

        game.tickFeedback();
    }

    // 🔢 SCORE
    ctx.fillStyle = "#ffffff";
    ctx.font = "18px Segoe UI";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 20, 30);

    // 🔥 COMBO
    ctx.textAlign = "center";
    ctx.font = "40px Segoe UI";

    ctx.fillStyle = "#ff4da6";
    ctx.shadowColor = "#ff4da6";
    ctx.shadowBlur = 15;

    if (combo > 0) {
        ctx.fillText(combo + " COMBO", canvas.width / 2, 140);
    }

    ctx.shadowBlur = 0;

    // 🏁 FIN
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
}

/* =========================
   💥 HIT EFFECT PRO
========================= */
function drawHitEffect(ctx, x, y, color, size = 40, alpha = 1) {

    ctx.globalAlpha = alpha;

    // 💥 círculo principal
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 35;
    ctx.fill();

    // 🔵 anillo
    ctx.beginPath();
    ctx.arc(x, y, size + 15, 0, Math.PI * 2);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 🌟 flash blanco
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);

    ctx.fillStyle = "white";
    ctx.globalAlpha = alpha * 0.8;
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
}

/* =========================
   💎 DRAW NOTE
========================= */
function drawNote(ctx, x, y, color, size = 20) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(x - size / 4, y - size / 4, size / 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();
}

/* =========================
   ⏳ COUNTDOWN
========================= */
export function drawCountdown(canvas, elapsed) {
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, "#1a1325");
    bg.addColorStop(1, "#0d0b14");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let text = "3";
    if (elapsed > 1000) text = "2";
    if (elapsed > 2000) text = "1";
    if (elapsed > 3000) text = "START";

    ctx.textAlign = "center";
    ctx.font = "80px Segoe UI";

    ctx.fillStyle = "#f6c453";
    ctx.shadowColor = "#ff4da6";
    ctx.shadowBlur = 20;

    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    ctx.shadowBlur = 0;
}