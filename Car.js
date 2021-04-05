const MAX_SPEED = 27; // m/s  - 97.2 km/h
const MAX_ACCELERATE_SPEED = 2.7; //  meters per s^2

module.exports = class Car {
    // distance to start of the road
    constructor(distance, speed) {
        this.distance = distance; // m
        this.speed = speed ?? 0; // m/s
        this.accelerate = 0; // m/s^2
    }
    // get the most up to date speed and distance
    calculate(lastTime, nextTime) {
        const timeInterval = nextTime - lastTime;
        this.speed += this.accelerate * timeInterval;

        if (this.speed > MAX_SPEED) {
            this.speed = MAX_SPEED;
        }

        this.distance += this.speed * timeInterval;
    }
};