const canvas = require('./canvas');
const Car = require('./Car');

const ROAD_LENGTH = 1500; // meters

module.exports = class Road {
    cars = []; // queue

    constructor() {
        //canvas.drawRoad(ROAD_LENGTH);
    }

    generateCar(distance = 0, speed = 0) {
        const newCar = new Car(distance, speed);
        this.cars.push(newCar);
        this.cars.sort((c1, c2) => c1.distance - c2.distance);
    }

    /**
     * render road
     * render every car on the screen
     * remove car if out of scope
     */
    render() {
        canvas.clear();
        canvas.drawRoad(ROAD_LENGTH);

        for (const [i, car] of this.cars.entries()) {
            // reach the exit, remove this car
            if (car.distance >= ROAD_LENGTH) {
                this.cars.splice(i, 1);
            }

            canvas.drawCar(car);
        }
    }

    /**
     * get most up to date
     *  accelerate speed
     *  speed
     *  distance
     * for all cars
     */
    calculate(timeInterval) {
        for (const [i, car] of this.cars.entries()) {
            const carInFront = this.cars[i + 1];

            if (!carInFront) {
                car.accelerate();
            } else {
                // have car in front
                const dis = carInFront.distance - car.distance;

                if (dis < 25) {
                    car.decelerate();
                } else {
                    car.accelerate();
                }
            }

            car.calculate(timeInterval);
        }
    }

    hasCars() {
        return this.cars.length;
    }
};