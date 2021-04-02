// one lane, one entry
const Car = require('./Car');
const MAX_SPEED = 60000; // km per hour
const MAX_ACCELERATE_SPEED = 3000; // per second -> get to the top speed from 0 in 20 seconds
const ROAD_LENGTH = 30000;

module.exports = class Road {
    cars = []; // queue

    constructor() {

    }

    generateCar() {
        const newCar = new Car(0, 0);
        this.cars.push(newCar);
    }
    // 30 frame per second
    // every simulate, move 1/30 second * speed (meters)
    simulate() {
        for (const [i, car] of this.cars.entries()) {
            // reach the exit, remove this car
            if (car.distance >= ROAD_LENGTH) {
                this.cars.splice(i, 1);
            }

            const carInFront = this.cars[i - 1];

            if (!carInFront) {
                // no car in front
                if (car.speed < MAX_SPEED) {
                    car.accelerate = MAX_ACCELERATE_SPEED;
                } else {
                    car.accelerate = 0;
                }
            } else {

            }

            car.simulate();
            //console.log(this.cars, car);
        }
    }

    hasCars() {
        return this.cars.length;
    }
};