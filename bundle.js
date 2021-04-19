(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
const canvas = require('./canvas');
const Car = require('./Car');

const ROAD_LENGTH = 1500; // meters
const distanceToHitBrake = 45;

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

                    if (disBetween <= distanceToHitBrake) {
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
},{"./Car":1,"./canvas":3}],3:[function(require,module,exports){
// divide the whole road into many segments, so that they fit in one screen, and don't need to scroll
const segmentLength = 1500; // px
const canvasWidth = segmentLength;
const firstSegmentHeight = 40; // px
const segmentHeight = 100; // px

let segmentNo;
let canvasHeight;

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

module.exports = {
    /**
     * @input meters
     */
    drawRoad: (RoadTotallength) => {
        const maxLength = RoadTotallength * 10;
        segmentNo = Math.ceil(maxLength / segmentLength);
        // real canvas width and height are larger than consts
        canvas.width = canvasWidth + 50;
        canvas.height = canvasHeight = segmentNo * segmentHeight + 100;

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";

        for (let s = 0; s < segmentNo; s++) {
            const thisSegmentStartRoadHeight = firstSegmentHeight + s * segmentHeight;
            // draw road
            ctx.fillRect(0, thisSegmentStartRoadHeight, segmentLength, 1);
            ctx.fillRect(0, thisSegmentStartRoadHeight + 29, segmentLength, 1);
            // draw length text
            ctx.fillText(`${(s + 1) * segmentLength / 10}m`, segmentLength - 50, firstSegmentHeight + s * segmentHeight);
        }

        // drawCrash
        for (const crashDistance of window.crashes) {
            ctx.fillStyle = "red";
            const segmentNo = Math.floor(crashDistance * 10 / segmentLength);

            ctx.fillText('CRASH!', crashDistance, segmentNo * segmentHeight + firstSegmentHeight);
        }
    },

    /**
     * @input
     *   car.distance: meters
     *   car.speed: meters per second
     *   car.accRate: meters ^ 2 per second
     */
    drawCar: (car) => {
        ctx.fillStyle = car.color ?? 'black';
        // draw the car
        const segmentNo = Math.floor(car.distance * 10 / segmentLength);
        const distance = car.distance * 10 % segmentLength;

        ctx.fillRect(distance - 15, segmentNo * segmentHeight + firstSegmentHeight + 5, 30, 20);
        // car info
        ctx.fillStyle = car.color ?? 'black';
        ctx.font = "20px Times New Roman";

        ctx.fillText(`${car.distance.toFixed(1)} m`, distance - 15, segmentNo * segmentHeight + firstSegmentHeight + 40);
        ctx.fillText(`${car.speed.toFixed(1)} m/s`, distance - 15, segmentNo * segmentHeight + firstSegmentHeight + 60);
        ctx.fillText(`${car.accRate.toFixed(1)} m/s2`, distance - 15, segmentNo * segmentHeight + firstSegmentHeight + 80);
    },

    clear: () => {
        ctx.clearRect(0, 0, canvasWidth + 50, canvasHeight + 100);
    }
};
},{}],4:[function(require,module,exports){
const Road = require('./app/Road');
//const config = require('./config');
const framePerSecond = 10;
const interval = 1000 / framePerSecond;
const ROAD_LENGTH = 1500; // meters
const MAX_SPEED = 27; // m/s  - 97.2 km/h

const timerElem = document.getElementById("timer");

let INTERVAL; // singleton
let timer = 0; // second

const road = new Road();

function generateDefaultCars() {
    road.generateCar();
    road.generateCar(100, 10);
    road.generateCar(50, 1);
    road.generateCar(200, 0);
}

function simulate() {
    // 1, update timer
    timer += interval / 1000;
    timerElem.innerText = timer.toFixed(2) + ' s';
    // 2, render all elements at this moment
    road.render();
    // 3, calculate the state at the next moment
    road.calculate(interval / 1000);
}
// controllers
function restart() {
    // clear everything
    window.crashes = [];
    road.cars = [];
    pause();
    timer = 0;

    // start again
    generateDefaultCars();
    start();
}

function pause() {
    console.log('paused');

    if (INTERVAL) {
        clearInterval(INTERVAL);
    }
}

function start() {
    INTERVAL = setInterval(simulate, interval);
}
// event listeners from console panel
document.getElementById('pauseresume').addEventListener('click', (event) => {
    const thisButton = event.target;

    if (thisButton.innerHTML === 'resume') {
        start();
        thisButton.innerHTML = "pause";
    } else if (thisButton.innerHTML === 'pause') {
        pause();
        thisButton.innerHTML = "resume";
    }
});
document.getElementById('addCar').addEventListener('click', (event) => {
    const distance = Number(document.getElementById('distance').value);
    const speed = Number(document.getElementById('speed').value);
    const addCarAlertElem = document.getElementById('addCarAlert');

    if (distance < 0 || speed < 0 || typeof distance !== 'number' || typeof speed !== 'number' || distance > ROAD_LENGTH || speed > MAX_SPEED) {
        console.log('invalid input', distance, speed);
        addCarAlertElem.innerText = 'invalid input';
        addCarAlertElem.style.display = 'block';
        return;
    }
    // don't allow enter the road below 17 m/s if not entering from the beginning
    if (distance !== 0 && speed < 17) {
        addCarAlertElem.innerText = 'too slow';
        addCarAlertElem.style.display = 'block';
        return;
    }

    addCarAlertElem.style.display = 'none';

    road.generateCar(distance, speed);
});
document.getElementById('restart').addEventListener('click', () => {
    restart();
    document.getElementById('pauseresume').innerHTML = 'pause';
});

// begin simulation by default
generateDefaultCars();
start();
},{"./app/Road":2}]},{},[4]);
