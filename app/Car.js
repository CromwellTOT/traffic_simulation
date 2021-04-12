const MAX_SPEED = 27; // m/s  - 97.2 km/h
const MAX_ACCELERATE_SPEED = 2.7; //  meters per s^2

module.exports = class Car {
    // distance to start of the road
    constructor(distance, speed) {
        this.distance = distance; // m
        this.speed = speed ?? 0; // m/s
        this.accRate = 0; // m/s^2
    }
    // get the most up to date speed and distance
    // ms
    calculate(timeInterval) {
        this.speed += this.accRate * timeInterval;

        this.speed = Math.min(this.speed, MAX_SPEED);
        this.speed = Math.max(this.speed, 0);

        this.distance += this.speed * timeInterval;
    }

    accelerate() {
        if (this.speed >= MAX_SPEED) {
            this.accRate = 0;
            return;
        }

        this.accRate = MAX_ACCELERATE_SPEED;
    }

    decelerate() {
        if (this.speed <= 0) {
            this.accRate = 0;
            return;
        }

        this.accRate = -MAX_ACCELERATE_SPEED;
    }
};