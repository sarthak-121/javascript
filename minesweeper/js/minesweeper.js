const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
const HEIGHT = 600;
const WIDTH = 400;

// 2d array for tiles in board
let tiles = new Array(9);
for(let i = 0 ; i < 9 ; i++)
    tiles[i] = new Array(9);

// tile class
class Tile {
    
    /**
     * 
     * @param counter = Integer
     * @param bomb = boolean
     * @param x and y are coordinates of tiles 
     * @param height and width are the dimenion of tile
     */
    constructor(counter, bomb, y, x, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.counter = counter;
        this.bomb = bomb;
        this.flipped = false;
        this.flagged = false;
        this.surroundingBomb = 0;
        this.coverImage = document.getElementById("cover_img");
        this.oneImage = document.getElementById("1_img");
        this.twoImage = document.getElementById("2_img");
        this.threeImage = document.getElementById("3_img");
        this.flagImage = document.getElementById("flag_img");
        this.bombImage = document.getElementById("bomb_img");
        this.zeroImage = document.getElementById("0_img");
        this.fourImage = document.getElementById("4_img");
        this.fiveImage = document.getElementById("5_img");
    }

    incrementSurroundingBomb() {
        this.surroundingBomb += 1; 
    }

    isClicked(x, y) {
        if(x == 0 && y == 0)
        return false;

        if( y < (this.y + this.height) && y > this.y ) {
            if( ( x - this.x ) < this.width && (x - this.x) >= 0) {
                return true;
            }
            else
                return false;
        }
        else {
            return false;
        }
    }

    draw(ctx) {
        if(!this.flipped) {
            ctx.drawImage(this.coverImage, this.x, this.y, this.height, this.width)
        }
        if(this.flipped) {
            if(this.bomb) {
                ctx.drawImage(this.bombImage, this.x, this.y, this.height, this.width);
            }
            else {
                if(this.surroundingBomb === 0) {
                    ctx.drawImage(this.zeroImage, this.x, this.y, this.height, this.width);
                }
                else if(this.surroundingBomb === 1) {
                    ctx.drawImage(this.oneImage, this.x, this.y, this.height, this.width);
                }
                else if(this.surroundingBomb === 2) {
                    ctx.drawImage(this.twoImage, this.x, this.y, this.height, this.width);
                }
                else if(this.surroundingBomb === 3) {
                    ctx.drawImage(this.threeImage, this.x, this.y, this.height, this.width);
                }
                else if(this.surroundingBomb === 4) {
                    ctx.drawImage(this.fourImage, this.x, this.y, this.height, this.width);
                }
                else {
                    ctx.drawImage(this.fiveImage, this.x, this.y, this.height, this.width);
                }
            }
        }
        if(this.flagged) {
            ctx.drawImage(this.flagImage, this.x, this.y, this.height, this.width);
        }
        
    }
}


//input class
class Input {
    /**
     * tiles contain a 2d array of tile object
     */
    constructor(tiles) {
        this.cx = 0;
        this.cy = 0;
        this.selectedBomb = false;
        this.gameStarted = false;
        this.remainingFlag = 10;

        canvas.addEventListener('mousedown', event => {
            this.gameStarted = true;
            this.cx = event.offsetX;
            this.cy = event.offsetY;

            switch(event.which) {
                case 1: this.rightClickHandler();
                        break;
                case 3: this.leftClickHandler();
                        break;
            }

        });

        canvas.addEventListener('contextmenu', function (e) { 
            e.preventDefault(); 
          }, false);
    }

    rightClickHandler() {
        for(let i = 0 ; i < 9 ; i++) {
            for(let j = 0 ; j < 9 ; j++) {
                if(tiles[i][j].isClicked(this.cx, this.cy)) {
                    if(tiles[i][j].bomb) {
                        tiles[i][j].flipped = true;
                        this.selectedBomb = true;
                    }
                    else if(tiles[i][j].surroundingBomb != 0) {
                        tiles[i][j].flipped = true;
                    }
                    else {
                        this.searchForZeros(i, j);
                    }
                }
            }
        }
    }

    leftClickHandler() {

        if(this.remainingFlag <= 0) {
            return;
        }

        for(let i = 0 ; i < 9 ; i++) {
            for(let j = 0 ; j < 9 ; j++) {
                if(tiles[i][j].isClicked(this.cx, this.cy) && tiles[i][j].flagged === true ) {
                    tiles[i][j].flagged = false;
                    tiles[i][j].flipped = false;
                    this.remainingFlag += 1;
                    return;
                }

                if(tiles[i][j].isClicked(this.cx, this.cy) && tiles[i][j].flipped === false ) {
                    tiles[i][j].flagged = true;
                    tiles[i][j].flipped = true;
                    this.remainingFlag -= 1;
                    return;
                }
            }
        }
    }

    searchForZeros(i, j) {
        //return if tile is a non zero no
        if(tiles[i][j].surroundingBomb != 0) {
            tiles[i][j].flipped = true;
            return;
        }
        //check up i-1 and j
        if((i-1) >= 0 && 
            tiles[i-1][j].flipped === false && 
            tiles[i-1][j].flagged === false && 
            tiles[i-1][j].bomb === false) {
            tiles[i-1][j].flipped = true;
            this.searchForZeros(i-1, j);
        }
        //check right i and j+1
        if((j+1) < 9 && tiles[i][j+1].flipped === false && tiles[i][j+1].flagged === false && tiles[i][j+1].bomb === false) {
            tiles[i][j+1].flipped = true;
            this.searchForZeros(i, j+1);
        }
        //check down i+1 and j
        if((i+1) < 9 && tiles[i+1][j].flipped === false && tiles[i+1][j].flagged === false && tiles[i+1][j].bomb === false) {
            tiles[i+1][j].flipped = true;
            this.searchForZeros(i+1, j);
        }
        //check left i and j-1 
        if((j-1) >= 0 && tiles[i][j-1].flipped === false && tiles[i][j-1].flagged === false && tiles[i][j-1].bomb === false) {
            tiles[i][j-1].flipped = true;
            this.searchForZeros(i, j-1);
        }
    }
}


//assigning surrounding bomb

function assignSurroundingBomb(i, j, tiles) {
    if(i < 9 && (j+1) < 9)                              //1
        tiles[i][j+1].incrementSurroundingBomb();
    if((i+1) < 9 && (j+1) < 9)                          //2
        tiles[i+1][j+1].incrementSurroundingBomb();        
    if((i+1) < 9 && j < 9)                               //3
        tiles[i+1][j].incrementSurroundingBomb();
    if((i+1) < 9 && (j-1) >= 0)
        tiles[i+1][j-1].incrementSurroundingBomb();
    if(i < 9 && (j-1) >= 0)                               //5
        tiles[i][j-1].incrementSurroundingBomb();   
    if((i-1) >= 0 && (j-1) >= 0)                           //6
        tiles[i-1][j-1].incrementSurroundingBomb();   
    if((i-1) >= 0 && j < 9)                             //7
        tiles[i-1][j].incrementSurroundingBomb();   
    if((i-1) >= 0 && (j+1) < 9)                           //8
        tiles[i-1][j+1].incrementSurroundingBomb();   
}



// creating the board

function createBoard() {

    //generating random bombs
    let locationForBomb = [];
    while(locationForBomb.length < 10) {
        let rand = ((Math.round(Math.random()*100) + 1) % 81)+1;
        if(locationForBomb.includes(rand)) {
            continue;
        }
        locationForBomb.push(rand);
    }

    console.log(locationForBomb);

    // creating object

    // placing bomb
    let counter = 1;
    for(let i = 0 ; i < 9 ; i++) {
        for(let j = 0 ; j < 9 ; j++) {
            if( locationForBomb.includes(counter) ) {
                tiles[i][j] = new Tile(counter, true, i*40+20, j*40+20, 40, 40);
            }
            else {
                tiles[i][j] = new Tile(counter, false, i*40+20, j*40+20, 40, 40);
            }
            counter++;
        }
    }

    // assigning no of surrounding bomb
    for(let i = 0 ; i < 9 ; i++) {
        for(let j = 0 ; j < 9 ; j++) {
            if(tiles[i][j].bomb) {
                assignSurroundingBomb(i, j, tiles);
            }
        }
    }
   
}


createBoard();
let inputs = new Input(tiles);
let clock = 0;

//gameloop
function gameloop() {

    let gameWon = 81;

    for(let i = 0 ; i < 9 ; i++) {
        for(let j = 0 ; j < 9 ; j++) {
            if(tiles[i][j].flipped) {
                gameWon--;
            }
            tiles[i][j].draw(ctx);
        }
    }

    if(gameWon === 0) {
        ctx.rect(0, 0, 400, 400);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fill();
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.fillText("You Won", 200, 200);
    }

    if(inputs.selectedBomb) {
        ctx.rect(0, 0, 400, 400);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", 200, 200);
    }
    else {
        setTimeout(gameloop, 33);
    }
}


//time and flag count
function time(clock) {
    let remainingFlag = inputs.remainingFlag;

    if(inputs.gameStarted) {
        clock += 1;
    }

    ctx.clearRect(20, 400, 400, 100);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.drawImage(document.getElementById("time_img"), 50, 420, 50, 50);
    ctx.fillText(clock.toString(), 120, 450);
    ctx.drawImage(document.getElementById("flag_img"), 280, 420, 50, 50);
    ctx.fillText(remainingFlag.toString(), 350, 450);

    if(!inputs.selectedBomb) {
        setTimeout(time, 1000, clock);
    }
}

setTimeout(time, 1, clock);
setTimeout(gameloop, 33);
