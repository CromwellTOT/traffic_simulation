const Road = require('./Road');
const config = require('./config');

const MAX_SPEED = config.max_speed;
const FRAME_PER_SECOND = config.frames_per_second;

const road = new Road();
road.generateCar(0);

let timer = 0;
// while there are still cars driving on the road
while (road.hasCars()) {
    if (timer % 10 === 0) {
        console.log(timer, road.cars);
    }

    road.simulate();
    timer++;

    if (timer === 1000) {
        break;
    }
}
