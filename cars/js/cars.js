let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");
const height = 600;
const width = 400;
const bgImage = document.getElementById("road_img");


class Car{
    constructor(width, height){
        this.x = 50;
        this.y = 460;
        this.height = height;
        this.width = width;
        this.lane = true;
        this.image = document.getElementById("car_img");
    }

    moveRight() {
        this.lane = false;
    }

    moveLeft() {
        this.lane = true;
    }

    draw(ctx) {
        if(this.lane === true)
            ctx.drawImage(this.image, this.x, this.y, this.height, this.width);
        else
            ctx.drawImage(this.image, this.x+200, this.y, this.height, this.width);
    }
}


class Obstacle {
    constructor(x, y, width, height, lane) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 12;
        this.image = document.getElementById("obs_img");
        this.valid = true;
        this.lane = lane;
    }

    draw(ctx) {
        this.y = this.y + this.speed;
        if(this.lane === false)
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        else
            ctx.drawImage(this.image, this.x+200, this.y, this.width, this.height);
    }
}


class Input {
    constructor(car) {
        this.gameMode = 0;
        document.addEventListener("keydown", event => {
            switch (event.keyCode) {
              case 37:
                car.moveLeft();
                break;
              case 39:
                car.moveRight();
                break;
              case 27:
                this.gameMode = 1;
                break;
              case 32:
                this.gameMode = 0;
                break;
            }
        });
    }
}


class Stripes {
    constructor() {
        this.x = 196;
        this.y = -80;
        this.width = 8;
        this.height = 80;
        this.speed = 12;
        this.image = document.getElementById("strip_img");
    }

    draw(ctx) {
        this.y += this.speed;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}


const obswidth = 50;
const obsheight = 50;
const carwidth = 80;
const carheight = 80;
let score = 0;
let counter = 0;
let obsarray = [];
let strips = [];
let car = new Car(carwidth,  carheight);
let input = new Input(car);     //input object
let obsObj = new Obstacle(50, -25, obswidth, obsheight, false);
obsarray.push(obsObj); 
let strip = new Stripes();
strips.push(strip);


function gameLoop() {

    if(input.gameMode === 0) {   

        if(strips.length <= 8 && strip.y >= 50) {
            strip = new Stripes();
            strips.push(strip);
        }

        if(obsarray.length <= 4 && obsObj.y >= 250 )  {
            let randLane; //= Math.round((Math.random() * 10) % 2); 
            if( (Math.round((Math.random() * 10) % 3) + 1) % 2)
                randLane = true;
            else
                randLane = false;
            obsObj =  new Obstacle(50, -25, obswidth, obsheight, randLane);
            obsarray.push(obsObj); 
        }

        obsarray.forEach(object => {
            if(object.y >= 600) {
                obsarray.splice(obsarray.indexOf(object), 1);
            }
            //collision detection
            if(object.y + object.height > car.y && object.y < car.y + car.height && object.lane !== car.lane) {
                obsarray.splice(obsarray.indexOf(object), 1);
                input.gameMode = 2;
            }
        });

        strips.forEach(object => {
            if(object.y >=600) {
                strips.splice(strips.indexOf(object), 1);
            }
        });

        ctx.clearRect(0, 0, width, height);

        ctx.drawImage(bgImage, 0, 0, width, height);
        car.draw(ctx);
        obsarray.forEach( object => object.draw(ctx) );
        strips.forEach(object => object.draw(ctx));

        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(score.toString(), 200, 35);

        counter += 1;
        score = Math.round(counter/3);
    }

    if(input.gameMode === 1) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Paused", width / 2, height / 2);
    }

    if(input.gameMode === 2) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", width / 2, height / 2);
        // obsarray.slice(0, obsarray.length);
        // strips.slice(0, strips.length);
    }

    setTimeout(gameLoop, 33);
}

setTimeout(gameLoop, 33);