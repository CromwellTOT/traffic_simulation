// dev: watchify main.js -o bundle.js -v
const Road = require('./app/Road');
//const config = require('./config');
const framePerSecond = 5;
const interval = 1000 / framePerSecond;

const timerElem = document.getElementById("timer");

let INTERVAL;
let timer; // second

const road = new Road();



// put 4 cars on the board
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
        stop();
    }
}

restart();
// controllers
function restart() {
    stop();
    timer = 0;
    start();
}

function stop() {
    console.log('stopped');
    clearInterval(INTERVAL);
}

function start() {
    // to prevent race
    if (INTERVAL) {
        clearInterval(INTERVAL);
    }
    INTERVAL = setInterval(simulate, interval);
}
// even listeners from console panel
document.getElementById('stopresume').addEventListener('click', (event) => {
    const thisButton = event.target;

    if (thisButton.innerHTML === 'resume') {
        start();
        thisButton.innerHTML = "stop";
    } else if (thisButton.innerHTML === 'stop') {
        stop();
        thisButton.innerHTML = "resume";
    }
});
document.getElementById('restart').addEventListener('click', () => {
    restart();
    document.getElementById('stopresume').innerHTML = 'stop';
});