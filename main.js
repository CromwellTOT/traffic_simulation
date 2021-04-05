const Road = require('./Road');
//const config = require('./config');

const road = new Road();

let timer = 0;

// calculate every frame? yes
while (true) {
    // generate car every 10 seconds
    if (timer % 10 === 0) {
        road.generateCar(0);
    }
    // get 1 decimal precision
    const nextTimer = Math.round((timer + 0.1) * 10) / 10;

    road.render(timer);
    road.calculate(timer, nextTimer);
    // or user press stop button
    if (timer === 30) {
        break;
    }

    timer = nextTimer;
}
