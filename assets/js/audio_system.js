let currentAudio = null;

export function playSong(src) {
    if (currentAudio) {
        currentAudio.pause();
    }

    currentAudio = new Audio(src);
    currentAudio.currentTime = 0;

    currentAudio.play().catch(() => {});
}

export function stopSong() {
    if (!currentAudio) return;

    currentAudio.pause();
    currentAudio.currentTime = 0;
}