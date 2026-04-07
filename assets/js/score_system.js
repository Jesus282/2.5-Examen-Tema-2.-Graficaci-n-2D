export let score = 0;
export let combo = 0;
export let maxCombo = 0;

let allPerfect = true;
let fullCombo = true;

const SCORE_VALUES = {
    perfect: 1000,
    good: 500,
    miss: 0
};

export function registerHit(result) {
    if (result === "miss") {
        combo = 0;
        fullCombo = false;
        return;
    }

    score += SCORE_VALUES[result];

    combo++;
    if (combo > maxCombo) maxCombo = combo;

    if (result !== "perfect") {
        allPerfect = false;
    }
}

export function getFinalResult() {
    // si rompiste combo → fin normal
    if (!fullCombo) return "LIVE COMPLETE";

    // si nunca rompiste combo
    if (allPerfect) return "PERFECT COMBO";

    return "FULL COMBO";
}

export function resetScore() {
    score = 0;
    combo = 0;
    maxCombo = 0;
    allPerfect = true;
    fullCombo = true;
}