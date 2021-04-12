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