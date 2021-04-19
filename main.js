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