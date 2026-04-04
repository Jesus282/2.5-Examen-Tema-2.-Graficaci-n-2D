export const Time = {
    startTime: Date.now(),
    current: 0,

    update() {
        this.current = Date.now() - this.startTime;
    }
};