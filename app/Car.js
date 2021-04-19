const {
    MAX_SPEED,
    MAX_ACCELERATE_SPEED,
    MAX_DECELERATE_SPEED,
    DISTANCE_START_TO_HIT_BRAKE,
    DISTANCE_TO_HIT_BRAKE_HARDEST,
    CAR_LENGTH,
} = require('./config');

const crashDistance = CAR_LENGTH / 2; // meter

module.exports = class Car {
    constructor(distance, speed) {
        this.distance = distance; // m
        this.speed = speed ?? 0; // m/s
        this.accRate = 0; // m/s^2
        this.state = 'running';
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

    brake(distance) {
        if (this.speed <= 0) {
            this.accRate = 0;
            return;
        }
        /**
         *  accRate = a * distance + b
         *  ->
         *  DISTANCE_START_TO_HIT_BRAKE * a + b = 0
         *  DISTANCE_TO_HIT_BRAKE_HARDEST * a + b = MAX_DECELERATE_SPEED
         *  ->
         *  a = ..
         *  b = ..
         */
        this.accRate = distance * MAX_DECELERATE_SPEED / (DISTANCE_TO_HIT_BRAKE_HARDEST - DISTANCE_START_TO_HIT_BRAKE)
                        + DISTANCE_START_TO_HIT_BRAKE * MAX_DECELERATE_SPEED / (DISTANCE_START_TO_HIT_BRAKE - DISTANCE_TO_HIT_BRAKE_HARDEST);
    }
    // I know this sounds weird, but I don't want to involve too many complexities...
    maintainSpeed() {
        this.accRate = 0;
    }
    /**
     *  return true when crashed, and reset all states of these 2 cars
     *  return false when no crash
     */
    static detectCrash(carA, carB) {
        const disBetween = Math.abs(carA.distance - carB.distance);

        if (disBetween > crashDistance) {
            return false;
        }

        carA.accRate = 0;
        carA.speed = 0;
        carA.state = 'crash';
        carB.accRate = 0;
        carB.speed = 0;
        carB.state = 'crash';

        window.crashes.push(Math.min(carA.distance, carB.distance));

        return true;
    }

    /**
     * return true when carA is faster
     * return false when carA is slower
     */
    static compareSpeed(carA, carB) {
        return carA.speed - carB.speed;
    }
};