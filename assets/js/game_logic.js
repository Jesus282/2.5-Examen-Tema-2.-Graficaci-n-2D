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

    // NUEVO: Reemplaza a handleKeyDown original. Procesa el buffer acumulado.
    function processInputBuffer(inputBuffer, currentTime) {
        if (!inputBuffer || inputBuffer.length === 0) return;

        // Limpiar el buffer para evitar ruido (teclas que no sean F o J)
        for (let i = inputBuffer.length - 1; i >= 0; i--) {
            let keyData = inputBuffer[i].key || inputBuffer[i].code;
            if (keyData !== "KeyF" && keyData !== "KeyJ") {
                inputBuffer.splice(i, 1);
            }
        }

        while (inputBuffer.length > 0) {
            let fIndex = inputBuffer.findIndex(i => (i.key || i.code) === "KeyF");
            let jIndex = inputBuffer.findIndex(i => (i.key || i.code) === "KeyJ");

            let fInput = fIndex !== -1 ? inputBuffer[fIndex] : null;
            let jInput = jIndex !== -1 ? inputBuffer[jIndex] : null;

            let inputType = null;
            let hitTime = currentTime;

            // 1. Detección de BOTH en ventana de tiempo
            if (fInput && jInput) {
                let diff = Math.abs(fInput.time - jInput.time);
                
                if (diff <= BOTH_WINDOW) {
                    inputType = "both";
                    hitTime = Math.max(fInput.time, jInput.time); // Usa el tiempo de la última tecla
                    
                    // Eliminar ambos del buffer cuidadosamente (de mayor a menor índice)
                    if (fIndex > jIndex) { inputBuffer.splice(fIndex, 1); inputBuffer.splice(jIndex, 1); }
                    else { inputBuffer.splice(jIndex, 1); inputBuffer.splice(fIndex, 1); }
                } else {
                    // Si están muy separados, procesamos solo el más antiguo
                    if (fInput.time < jInput.time) {
                        inputType = "left"; hitTime = fInput.time; inputBuffer.splice(fIndex, 1);
                    } else {
                        inputType = "right"; hitTime = jInput.time; inputBuffer.splice(jIndex, 1);
                    }
                }
            } 
            // 2. Detección individual esperando la ventana del BOTH
            else if (fInput) {
                if (currentTime - fInput.time > BOTH_WINDOW) {
                    // Ya pasó el tiempo de ventana, es seguro registrar un "left" solo
                    inputType = "left"; hitTime = fInput.time; inputBuffer.splice(fIndex, 1);
                } else {
                    break; // Cortamos el bucle para esperar al siguiente frame a ver si entra la J
                }
            } else if (jInput) {
                if (currentTime - jInput.time > BOTH_WINDOW) {
                    // Ya pasó el tiempo de ventana, es seguro registrar un "right" solo
                    inputType = "right"; hitTime = jInput.time; inputBuffer.splice(jIndex, 1);
                } else {
                    break; // Cortamos el bucle para esperar al siguiente frame a ver si entra la F
                }
            }

            if (!inputType) continue;

            // --- SE MANTIENE TU LÓGICA DE GOLPE EXACTAMENTE IGUAL ---
            let note = getClosestNote(inputType, hitTime);
            if (!note) continue;

            if (note.endTime) {
                let diff = Math.abs(hitTime - note.time);
                if (diff > HOLD_WINDOW) continue;

                note.started = true;
                activeHold = note;

                showFeedback("start");
                continue;
            }

            let y = getNoteY(note, hitTime);
            let result = judge(y);

            showFeedback(result);
            registerHit(result);

            if (result !== "miss") note.hit = true;
        }
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
        // Actualizado a e.code por consistencia, pero soportando fallback a e.key
        if (e.code === "KeyF" || e.key === "f") inputType = "left";
        if (e.code === "KeyJ" || e.key === "j") inputType = "right";

        if (!inputType) return;
        if (activeHold.type !== inputType) return;

        if (currentTime < activeHold.endTime - RELEASE_MARGIN) {
            fail(activeHold);
        }
    }

    // Modificamos el update para que reciba el buffer de inputs
    function update(currentTime, inputBuffer = []) {
        // Ejecutamos el procesador de buffer aquí
        processInputBuffer(inputBuffer, currentTime);

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
        processInputBuffer, // Renombrado de handleKeyDown para reflejar su nueva función
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