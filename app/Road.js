const canvas = require('./canvas');
const Car = require('./Car');
const {
    ROAD_LENGTH,
    DISTANCE_START_TO_HIT_BRAKE
} = require('./config');

module.exports = class Road {
    cars = []; // queue

    constructor() {

    }

    generateCar(distance = 0, speed = 0) {
        const newCar = new Car(distance, speed);
        this.cars.push(newCar);
        this.cars.sort((c1, c2) => c1.distance - c2.distance);
    }

    /**
     * 1, clear canvas
     * 2, render road
     * 3, render every car on the screen
     * 4, remove car if needed
     */
    render() {
        canvas.clear();
        canvas.drawRoad(ROAD_LENGTH);

        for (const [i, car] of this.cars.entries()) {
            // if crash, remove this car
            if (car.state === 'crash') {
                this.cars.splice(i, 1);
            }
            // reach the exit, remove this car
            if (car.distance >= ROAD_LENGTH) {
                this.cars.splice(i, 1);
            }

            canvas.drawCar(car);
        }
    }

    /**
     * 1, detect crash
     * 2, driver decides to hit acclerator or brake
     *    (depending on the distance between the car directly infront of him / her)
     * 3, update each car's state
     */
    calculate(timeInterval) {
        for (const [i, car] of this.cars.entries()) {
            if (car.state === 'crash') {
                // will be removed during render
                continue;
            }

            const carInFront = this.cars[i + 1];

            if (!carInFront) {
                car.accelerate();
            }
            // have car in front
            else {
                if (Car.detectCrash(car, carInFront)) {
                    // if crash, then no need to calculate
                    continue;
                }
                // @todo: driver's decision should be refactored to Car class
                // if the car in front is faster
                if (Car.compareSpeed(carInFront, car)) {
                    car.accelerate();
                }
                // if the car in front is slower
                else {
                    const disBetween = carInFront.distance - car.distance;

                    if (disBetween <= DISTANCE_START_TO_HIT_BRAKE) {
                        car.brake(disBetween);
                    } else {
                        car.accelerate();
                    }
                }
            }

            car.calculate(timeInterval);
        }
    }

    hasCars() {
        return this.cars.length;
    }
};