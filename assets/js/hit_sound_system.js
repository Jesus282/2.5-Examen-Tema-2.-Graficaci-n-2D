const tapSound = new Audio("./audio/tap.mp3");
tapSound.load();

const holdSound = new Audio("./audio/hold.mp3");
holdSound.load();
holdSound.loop = true;

holdSound.loop = true;

export function playTap() {
    const s = tapSound.cloneNode(); // permite spam
    s.volume = 0.4;
    s.play();
}

export function startHold() {
    holdSound.currentTime = 0;
    holdSound.volume = 0.3;
    holdSound.play();
}

export function stopHold() {
    holdSound.pause();
    holdSound.currentTime = 0;
}