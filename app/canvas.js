const {
    SEGMENT_LENGTH,
    SEGMENT_HEIGHT,
    FIRST_SEGMENT_HEIGHT
} = require('./config');

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const canvasWidth = SEGMENT_LENGTH;
let canvasHeight;

module.exports = {
    /**
     * @input meters
     */
    drawRoad: (RoadTotallength) => {
        const maxLength = RoadTotallength * 10;
        const segmentNo = Math.ceil(maxLength / SEGMENT_LENGTH);
        // real canvas space is larger than just the road
        canvas.width = canvasWidth + 50;
        canvas.height = canvasHeight = segmentNo * SEGMENT_HEIGHT + 100;

        ctx.fillStyle = "black";
        ctx.font = "20px Times New Roman";

        for (let s = 0; s < segmentNo; s++) {
            const thisSegmentStartRoadHeight = s * SEGMENT_HEIGHT + FIRST_SEGMENT_HEIGHT;
            // draw road
            ctx.fillRect(0, thisSegmentStartRoadHeight, SEGMENT_LENGTH, 1);
            ctx.fillRect(0, thisSegmentStartRoadHeight + 29, SEGMENT_LENGTH, 1);
            // draw length text
            ctx.fillText(`${(s + 1) * SEGMENT_LENGTH / 10}m`, SEGMENT_LENGTH - 50, s * SEGMENT_HEIGHT + FIRST_SEGMENT_HEIGHT);
        }

        // drawCrash
        for (const crashDistance of window.crashes) {
            ctx.fillStyle = "red";
            const segmentNo = Math.floor(crashDistance * 10 / SEGMENT_LENGTH);
            const distance = (crashDistance * 10) % SEGMENT_LENGTH;

            ctx.fillText('CRASH!', distance, segmentNo * SEGMENT_HEIGHT + FIRST_SEGMENT_HEIGHT);
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
        const segmentNo = Math.floor(car.distance * 10 / SEGMENT_LENGTH);
        const distance = (car.distance * 10) % SEGMENT_LENGTH;

        ctx.fillRect(distance - 15, segmentNo * SEGMENT_HEIGHT + FIRST_SEGMENT_HEIGHT + 5, 30, 20);
        // car info
        ctx.fillStyle = car.color ?? 'black';
        ctx.font = "20px Times New Roman";

        ctx.fillText(`${car.distance.toFixed(1)} m`, distance - 15, segmentNo * SEGMENT_HEIGHT + FIRST_SEGMENT_HEIGHT + 40);
        ctx.fillText(`${car.speed.toFixed(1)} m/s`, distance - 15, segmentNo * SEGMENT_HEIGHT + FIRST_SEGMENT_HEIGHT + 60);
        ctx.fillText(`${car.accRate.toFixed(1)} m/s2`, distance - 15, segmentNo * SEGMENT_HEIGHT + FIRST_SEGMENT_HEIGHT + 80);
    },

    clear: () => {
        ctx.clearRect(0, 0, canvasWidth + 50, canvasHeight + 100);
    }
};