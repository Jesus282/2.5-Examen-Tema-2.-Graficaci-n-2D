export const Input = {
    keys: { f: false, j: false },
    keyTimes: { f: 0, j: 0 },
    // 1. Se crea el buffer para guardar las pulsaciones y sus tiempos
    inputBuffer: [], 

    init() {
        document.addEventListener("keydown", (e) => {
            // 2. Prevenir repeticiones automáticas si el usuario mantiene presionada la tecla
            if (e.repeat) return; 
            
            // 2. Prevenir el comportamiento por defecto del navegador (como hacer scroll si añades la barra espaciadora luego)
            if (e.code === "KeyF" || e.code === "KeyJ") {
                e.preventDefault();
            }

            let currentTime = Date.now() - window.startTimeRef();

            // 3. Cambio de e.key a e.code y registro en el buffer
            if (e.code === "KeyF") {
                this.keys.f = true;
                this.keyTimes.f = currentTime;
                this.inputBuffer.push({ key: "KeyF", time: currentTime });
            }

            if (e.code === "KeyJ") {
                this.keys.j = true;
                this.keyTimes.j = currentTime;
                this.inputBuffer.push({ key: "KeyJ", time: currentTime });
            }

            window.handleKeyDown(e, currentTime, this.keys, this.keyTimes);
        });

        document.addEventListener("keyup", (e) => {
            let currentTime = Date.now() - window.startTimeRef();

            // 3. Cambio de e.key a e.code
            if (e.code === "KeyF") this.keys.f = false;
            if (e.code === "KeyJ") this.keys.j = false;

            window.handleKeyUp(e, currentTime, this.keys);
        });
    },

    update() {
        // Nota: Recuerda limpiar o procesar this.inputBuffer aquí 
        // o en tu bucle principal para que no crezca infinitamente.
    }
};