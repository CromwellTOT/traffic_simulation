module.exports = class Car {
    // distance to start of the road
    constructor(distance, speed) {
        this.distance = distance; // m
        this.speed = speed ?? 0; // m/s
        this.accelerate = 0; // m/s^2
    }

    simulate() {
        this.speed += this.accelerate / 30;
        this.distance += this.speed / 30;
    }
};