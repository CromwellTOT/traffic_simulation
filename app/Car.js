const MAX_SPEED = 27; // m/s  - 97.2 km/h
const MAX_ACCELERATE_SPEED = 2.7; //  meters per s^2
const distanceToHitBrake = 45;
const distanceToHitBrakeHardest = 5;
const MAX_DECELERATE_SPEED = -10; //  meters per s^2
const crashDistance = 1.5;

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
         *  distanceToHitBrake * a + b = 0
         *  distanceToHitBrakeHardest * a + b = MAX_DECELERATE_SPEED
         *  ->
         *  a = ..
         *  b = ..
         */
        this.accRate = distance * MAX_DECELERATE_SPEED / (distanceToHitBrakeHardest - distanceToHitBrake)
                        + distanceToHitBrake * MAX_DECELERATE_SPEED / (distanceToHitBrake - distanceToHitBrakeHardest);
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