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