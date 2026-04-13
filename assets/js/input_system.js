export const Input = {
    keys: { f: false, j: false },
    keyTimes: { f: 0, j: 0 },
    inputBuffer: [], 

    init() {
        // --- TECLADO ---
        document.addEventListener("keydown", (e) => {
            if (e.repeat) return; 

            if (e.code === "KeyF" || e.code === "KeyJ") {
                e.preventDefault();
                this.handlePress(e.code);
            }
        });

        document.addEventListener("keyup", (e) => {
            if (e.code === "KeyF" || e.code === "KeyJ") {
                this.handleRelease(e.code);
            }
        });

        // --- TOUCH ---
        const canvas = document.getElementById("gameCanvas");

        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();

            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const touchX = touch.clientX - rect.left;

                const code = (touchX < rect.width / 2) ? "KeyF" : "KeyJ";
                this.handlePress(code);
            }
        }, { passive: false });

        canvas.addEventListener("touchend", (e) => {
            const rect = canvas.getBoundingClientRect();

            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const touchX = touch.clientX - rect.left;

                const code = (touchX < rect.width / 2) ? "KeyF" : "KeyJ";
                this.handleRelease(code);
            }
        });
    },

    handlePress(code) {
        let currentTime = Date.now() - window.startTimeRef();

        if (code === "KeyF") {
            this.keys.f = true;
            this.keyTimes.f = currentTime;
            this.inputBuffer.push({ code: "KeyF", time: currentTime });
        } 
        else if (code === "KeyJ") {
            this.keys.j = true;
            this.keyTimes.j = currentTime;
            this.inputBuffer.push({ code: "KeyJ", time: currentTime });
        }

        // 🔥 IMPORTANTE: avisamos al game logic
        window.handleKeyDown({ code: code }, currentTime, this.keys, this.keyTimes);
    },

    handleRelease(code) {
        let currentTime = Date.now() - window.startTimeRef();

        if (code === "KeyF") this.keys.f = false;
        if (code === "KeyJ") this.keys.j = false;

        // 🔥 para holds y lógica de liberación
        window.handleKeyUp({ code: code }, currentTime, this.keys);
    },

    update() {
        // 🧠 Aquí puedes procesar el buffer si quieres lógica más avanzada
        // Ejemplo: limpiar inputs viejos
        this.inputBuffer = this.inputBuffer.filter(input => {
            return Date.now() - window.startTimeRef() - input.time < 200;
        });
    }
};