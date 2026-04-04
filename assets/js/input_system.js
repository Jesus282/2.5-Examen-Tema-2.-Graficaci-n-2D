export const Input = {
    keys: { f: false, j: false },
    keyTimes: { f: 0, j: 0 },

    init() {
        document.addEventListener("keydown", (e) => {
            let currentTime = Date.now() - window.startTimeRef();

            if (e.key === "f") {
                this.keys.f = true;
                this.keyTimes.f = currentTime;
            }

            if (e.key === "j") {
                this.keys.j = true;
                this.keyTimes.j = currentTime;
            }

            window.handleKeyDown(e, currentTime, this.keys, this.keyTimes);
        });

        document.addEventListener("keyup", (e) => {
            let currentTime = Date.now() - window.startTimeRef();

            if (e.key === "f") this.keys.f = false;
            if (e.key === "j") this.keys.j = false;

            window.handleKeyUp(e, currentTime, this.keys);
        });
    },

    update() {}
};