(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
const canvas = require('./canvas');
const Car = require('./Car');

const ROAD_LENGTH = 3000; // meters

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
},{"./Car":1,"./canvas":3}],3:[function(require,module,exports){
let maxLength;
let width;
let height;
let roadHeight = 200;

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

module.exports = {
    drawRoad: (length) => {
        maxLength = length * 10;

        ctx.fillStyle = "black";
        const interval = 1500;

        let counter = Math.ceil(maxLength / interval);

        width = canvas.width = maxLength;
        height = canvas.height = 500;

        ctx.fillRect(0, roadHeight, maxLength, 1);
        ctx.fillRect(0, roadHeight + 29, maxLength, 1);

        ctx.font = "20px Arial";
        for (let i = 0; i < counter; i++) {
            ctx.fillText(`${i * interval / 10} m`, i * interval, 200);
        }
    },

    drawCar: (car) => {
        //console.log(car);
        // draw the car
        ctx.fillStyle = car.color ?? 'red';
        ctx.fillRect(car.distance * 10 - 15, roadHeight + 5, 30, 20);
        // car info
        ctx.fillStyle = car.color ?? 'black';
        ctx.font = "20px Times New Roman";
        ctx.fillText(`${car.distance.toFixed(1)} m`, car.distance * 10 - 15, roadHeight + 40);
        ctx.fillText(`${car.speed.toFixed(1)} m/s`, car.distance * 10 - 15, roadHeight + 60);
        ctx.fillText(`${car.accRate.toFixed(1)} m/s2`, car.distance * 10 - 15, roadHeight + 80);
    },

    clear: () => {
        ctx.clearRect(0, 0, maxLength, 500);
    }
};
},{}],4:[function(require,module,exports){
// dev: watchify main.js -o bundle.js -v
const Road = require('./app/Road');
//const config = require('./config');
const framePerSecond = 5;
const interval = 1000 / framePerSecond;
const timerElem = document.getElementById("timer");

const road = new Road();

let timer = 0; // second

road.generateCar();
road.generateCar(100,10);
road.generateCar(50, 1);
road.generateCar(200, 0);

function simulate() {
    timer += interval / 1000;
    //console.log(`${timer} s`);
    timerElem.innerText = timer.toFixed(2) + ' s';

    road.render();
    road.calculate(interval / 1000);

    if (timer >= 100 || !road.hasCars()) {
        console.log('stopped');
        clearInterval(INTERVAL);
    }
}

const INTERVAL = setInterval(simulate, interval);
},{"./app/Road":2}]},{},[4]);
