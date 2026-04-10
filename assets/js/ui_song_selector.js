import { songs } from "./songs.js";

export function initSongSelector() {
    const cards = document.querySelectorAll(".song-card");
    const selector = document.getElementById("songSelector");

    let currentAudio = null;

    cards.forEach(card => {
        const songKey = card.dataset.song;

        // 🎧 HOVER (puede fallar en algunos navegadores, pero lo dejamos)
        card.addEventListener("mouseenter", () => {
            const song = songs[songKey];
            if (!song) return;

            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            currentAudio = new Audio(song.audio);
            currentAudio.volume = 0.2;

            currentAudio.play().catch(() => {});
        });

        // 🛑 SALIR
        card.addEventListener("mouseleave", () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
        });

        // ✅ CLICK (este es el importante)
        card.addEventListener("click", () => {

            // UI
            cards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");

            // lógica del juego
            selector.value = songKey;

            // 🔥 reproducir preview seguro
            const song = songs[songKey];

            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            currentAudio = new Audio(song.audio);
            currentAudio.volume = 0.4;
            currentAudio.play();
        });
    });
}