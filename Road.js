// one lane, one entry
const Car = require('./Car');
const MAX_SPEED = 27; // m/s  - 97.2 km/h
const MAX_ACCELERATE_SPEED = 2.7; //  meters per s^2
const ROAD_LENGTH = 3000; // meters

module.exports = class Road {
    cars = []; // queue

    generateCar() {
        const newCar = new Car(0, 0);
        this.cars.push(newCar);
    }
    /**
     * render every car on the screen
     * remove car if out of scope
     */
    render(time) {
        console.log();
        console.log('time', `${time}s`);

        for (const [i, car] of this.cars.entries()) {
            // reach the exit, remove this car
            if (car.distance >= ROAD_LENGTH) {
                this.cars.splice(i, 1);
            }

            console.log(`car #${i}`, `${car.distance}m`);
        }
    }

    /**
     * get most up to date
     *  accelerate speed
     *  speed
     *  distance
     * for all cars
     */
    calculate(lastTime, nextTime) {
        for (const [i, car] of this.cars.entries()) {
            // decide accelerate rate
            const carInFront = this.cars[i - 1];

            if (!carInFront) {
                // no car in front
                if (car.speed < MAX_SPEED) {
                    car.accelerate = MAX_ACCELERATE_SPEED;
                } else {
                    // reach the maximum speed
                    car.accelerate = 0;
                }
            } else {
                // have car in front
                const dis = carInFront.distance - car.distance;

                if (dis < 25) {
                    car.accelerate = -MAX_ACCELERATE_SPEED;
                } else if (dis > 50) {
                    car.accelerate = MAX_ACCELERATE_SPEED;
                } else {
                    car.accelerate = 0;
                }
            }

            car.calculate(lastTime, nextTime);
        }
    }

    hasCars() {
        return this.cars.length;
    }
};