import { registerHit } from "./score_system.js";

export function createGame(canvas, chartData) {
    const ctx = canvas.getContext("2d");

    let startTime = Date.now();

    const hitLineY = canvas.height - 80;
    const speed = 0.25;

    const PERFECT = 10;
    const GOOD = 25;
    const MISS = 40;

    const INPUT_WINDOW = 400;
    const HOLD_WINDOW = 500;
    const RELEASE_MARGIN = 120;

    const BOTH_WINDOW = 80;

    let feedback = "";
    let feedbackTimer = 0;

    let activeHold = null;

    let gameEnded = false;
    let endTimer = 0;

    //CARGA DINÁMICA DEL CHART
    let notes = structuredClone(chartData);

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
        registerHit("miss");
    }

    function showFeedback(text) {
        feedback = text;
        feedbackTimer = 20;
    }

    function handleKeyDown(e, currentTime, keys, keyTimes) {
        let inputType = null;

        if (keys.f && keys.j) {
            let diff = Math.abs(keyTimes.f - keyTimes.j);

            if (diff <= BOTH_WINDOW) {
                inputType = "both";
            } else {
                inputType = e.key === "f" ? "left" : "right";
            }
        } else if (e.key === "f") inputType = "left";
        else if (e.key === "j") inputType = "right";

        if (!inputType) return;

        let note = getClosestNote(inputType, currentTime);
        if (!note) return;

        if (note.endTime) {
            let diff = Math.abs(currentTime - note.time);
            if (diff > HOLD_WINDOW) return;

            note.started = true;
            activeHold = note;

            showFeedback("start");
            return;
        }

        let y = getNoteY(note, currentTime);
        let result = judge(y);

        showFeedback(result);
        registerHit(result);

        if (result !== "miss") note.hit = true;
    }

    function handleKeyUp(e, currentTime, keys) {
        if (!activeHold) return;

        if (activeHold.type === "both") {
            if (!keys.f || !keys.j) {
                if (currentTime < activeHold.endTime - RELEASE_MARGIN) {
                    fail(activeHold);
                }
            }
            return;
        }

        let inputType = null;
        if (e.key === "f") inputType = "left";
        if (e.key === "j") inputType = "right";

        if (!inputType) return;
        if (activeHold.type !== inputType) return;

        if (currentTime < activeHold.endTime - RELEASE_MARGIN) {
            fail(activeHold);
        }
    }

    function update(currentTime) {
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
                    registerHit(result);

                    note.hit = true;
                    activeHold = null;
                }
            }
        });

        let allDone = notes.every(n => n.hit);

        if (allDone && !gameEnded) {
            gameEnded = true;
            endTimer = 60;
        }

        if (gameEnded) {
            endTimer--;
        }
    }

    return {
        update,
        handleKeyDown,
        handleKeyUp,
        getNoteY,
        getNoteEndY,
        notes,
        feedbackRef: () => ({ text: feedback, timer: feedbackTimer }),
        tickFeedback: () => feedbackTimer--,
        hitLineY,
        gameEndedRef: () => gameEnded,
        endTimerRef: () => endTimer,
        ctx
    };
}