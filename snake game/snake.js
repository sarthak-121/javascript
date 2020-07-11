// getting context of canvas to draw on it
const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");


// body class
class Body {
    /**
     * @param {number} x is the x coordinate of the body
     * @param {number} y is the y coordinate of the body
     * @param {number} width is the width of the body
     * @param {number} height is the height of the body
     * @param {number} direction is the direction according to ascii code
     */
    constructor(x, y, width, height, direction) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.direction = direction;
    }

    update() {
        switch (this.direction) {
            // right direction
            case 39: this.x += this.width;
                    break;
            // down direction
            case 40: this.y += this.height;
                    break;
            // left direction
            case 37: this.x -= this.width;
                    break;
            // up direction
            case 38: this.y -= this.height;
                    break;
                
        }
    }

    /**
     * @param {object} ctx is the context of the canvas which is used to draw stuff
     */
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, this.height, this.width);
    }
}



//input class
class Input {
    // handels inputs
    constructor() {
        this.buttonPressed = false;
        this.direction = 39; 
        this.gameMode = 0;

        document.addEventListener("keydown", event => {
            this.buttonPressed = true;

            switch (event.keyCode) {
                case 37: if(this.direction != 39) {
                            this.direction = 37;
                         }
                         break;
                case 38: if(this.direction != 40) {
                            this.direction = 38;
                         }
                         break;
                case 39: if(this.direction != 37) {
                            this.direction = 39;
                         }
                         break;
                case 40: if(this.direction != 38) {
                            this.direction = 40;
                         }
                         break;
                case 32: this.gameMode = 1;
                         break;
                case 27: if(this.gameMode !== 3 ) {
                            this.gameMode = 2;
                         }   
                         break;
            }
        });
    }
}



/**
 * @returns {Array} blocks which contains the starting body object of the snake
 */
function init() {
    let blocks = [];

    blocks.push(new Body(240, 240, 20, 20, 39));
    blocks.push(new Body(220, 240, 20, 20, 39));
    blocks.push(new Body(200, 240, 20, 20, 39));

    return blocks;
}



/**
 * @returns {object} food which contains x and y coordinate of food
 */
function generateFood() {
    let food = {
        x: 0,
        y: 0
    };

    food.x = (Math.round(Math.random()*1000)%435)+20;
    food.y = (Math.round(Math.random()*1000)%435)+20;

    return food;
}



/**
 * @param {boolean} foodEaten tells wheather food is eaten or not
 */
function appendBody(foodEaten) {
    if(foodEaten) {
        if(body[body.length - 1].direction === 37) {
            body.push(new Body(body[body.length - 1].x + 20, body[body.length - 1].y, 20, 20, 37));
        }
        if(body[body.length - 1].direction === 38) {
            body.push(new Body(body[body.length - 1].x, body[body.length - 1].y + 20, 20, 20, 38));
        }
        if(body[body.length - 1].direction === 39) {
            body.push(new Body(body[body.length - 1].x - 20, body[body.length - 1].y, 20, 20, 39));
        }
        if(body[body.length - 1].direction === 40) {
            body.push(new Body(body[body.length - 1].x, body[body.length - 1].y - 20, 20, 20, 40));
        }
    }
}


/**
 * @returns {number} gameMode which tells the status of the game
 */
function checkColision() {
    let gameMode;

    if(body[0].x >= 20 && body[0].x <= 460 && body[0].y >= 20 && body[0].y <= 460) {
        for(let i = body.length - 1 ; i >= 1 ; i--) {
            if(body[0].x === body[i].x && body[0].y === body[i].y ) {
                return 3;
            }
        }
        return 1;
    }
    else {
        return 3;
    }

    return gameMode;
}


let body = init();
const bg = document.getElementById("bg_img");
const foodImage = document.getElementById("food_img");
let input = new Input();
let foodEaten = true;
let food, score = 0;

/**
 * main gameloop used to draw each frame
 * recusive function
 * 
 * @param {number} frame is the frame rate
 */
function gameLoop(frame) {

    if(input.gameMode === 0) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Spacebar to play", 500 / 2, 500 / 2);
    }

    if(input.gameMode === 1) {
        if(foodEaten) {
            food = generateFood();
            foodEaten = false;
        }

        ctx.clearRect(0, 0, 500, 600);
        ctx.drawImage(bg, 0, 0, 500, 500);
        ctx.drawImage(foodImage, food.x, food.y, 25, 25);
        ctx.font = "30px Arial";
        ctx.fillText(score.toString(), 250, 550);
        body.forEach( object => object.draw(ctx) );

        // is food eaten
        if(body[0].x > food.x && body[0].x < (food.x + 25)
        || (body[0].x + body[0].height) > food.x && (body[0].x + body[0].height)  < (food.x + 25) ) {
            if(body[0].y > food.y && body[0].y < (food.y + 25)
            || (body[0].y + body[0].width) > food.y && (body[0].y + body[0].width) < (food.y + 25 ) ) {
                score += 6;
                foodEaten = true;
            }
        }

        // appending the body of snake
        appendBody(foodEaten);
        
        // update snake 
        for(let i = body.length - 1 ; i >= 1 ; i--) {
            body[i].direction = body[i-1].direction;
            body[i].update();
        }
        body[0].direction = input.direction;
        body[0].update();


        // check collision
        input.gameMode = checkColision();
    }

    if(input.gameMode === 2) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.fillText("Paused", 500 / 2, 500 / 2);
    }

    if(input.gameMode === 3) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", 500 / 2, 500 / 2);

        score = 0;
        body = init();
        input.direction = 39;
    }
    
    setTimeout(gameLoop ,frame ,frame);
}

// used to call gameLoop function
setTimeout(gameLoop, 1, 100);

