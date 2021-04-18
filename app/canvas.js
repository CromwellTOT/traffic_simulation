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
    // passed in length is the road total length in meters
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
    },

    /**
     * @input
     * car.distance: meters
     * car.speed: meters per second
     * car.accRate: meters ^ 2 per second
     */
    drawCar: (car) => {
        ctx.fillStyle = car.color ?? 'red';
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