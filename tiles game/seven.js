let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");



class Tile {
    constructor(width, height, i, j, rand, counter) {
        this.x = i*100;
        this.y = j*100;
        this.width = width;
        this.height = height;
        this.coverImage = document.getElementById("cover_tile");
        this.backImage;
        this.selected = false;
        this.random = rand;
        this.counter = counter;
    }

    backImageSelector(randomNumber) {
        switch(randomNumber) {
            case 1 : this.backImage = document.getElementById("1_img");
                     break;
            case 2 : this.backImage = document.getElementById("2_img");
                     break;
            case 3 : this.backImage = document.getElementById("3_img");
                     break;
            case 4 : this.backImage = document.getElementById("4_img");
                     break;
        }
    }

    draw(ctx) {
        if(this.selected)
            ctx.drawImage(this.backImage, this.x, this.y, this.width, this.height);
        else
            ctx.drawImage(this.coverImage, this.x, this.y, this.width, this.height);
    }

    checkClicked(x, y) {
        if(x == 0 && y == 0)
            return false;

        //code to check if the tile was clicked
        //console.log("is "+y+" < "+(this.x + this.height)+" && "+y+" > "+this.x+"{"+this.counter+" is being checked}");

        if( y < (this.y + this.height) && y > this.y ) {

            //console.log( ( x - this.x ) + " < " + this.width );
            if( ( x - this.x ) < this.width ) {
                // console.log("tile value "+this.random);
                // console.log("tile no " + this.counter);
                this.selected = true;
                return true;
            }
            else
                return false;

        }
        else {
            return false;
        }


    }
}


class Input {
    constructor(canvas, tiles) {
        this.cx = 0;
        this.cy = 0;
        this.preObj;
        this.counter = 0;

        canvas.addEventListener('mousedown', event => {
            this.cx = event.offsetX;
            this.cy = event.offsetY;
            //console.log("(X,Y) = ("+this.cx+","+this.cy+")");
            let bool = false;

            for(let i = 0 ; i < 4 ; i++) {
                for(let j = 0 ; j < 4 ; j++) {
                    bool = tiles[i][j].checkClicked(this.cx, this.cy);

                    if(bool) {
                        this.counter += 1;

                        if(this.counter === 1) {
                            this.preObj = tiles[i][j];
                        }
                        if(this.counter === 2) {
                            console.log("working");
                            if(this.preObj.random !== tiles[i][j].random) {
                                this.preObj.selected = false;
                                console.log(this.preObj);
                                
                                tiles[i][j].selected = false;
                                console.log(tiles[i][j]);
                            }
                        }
                        this.cx = 0;
                        this.cy = 0;
                        break;
                    }
                }
            }
            if(this.counter >= 2)  { 
                console.log("working:):");
                this.counter = 0;
            }
          });
    }
}


//2d array to save object
let tiles = new Array(4);

for(let i = 0 ; i < 4 ; i++)
    tiles[i] = new Array(4);



let pattern = {
    a: 4,
    b: 4,
    c: 4,
    d: 4
};

let counter = 1;
let rand;
let width = 400;
let height = 500;

//generating random tiles
for(let i = 0 ; i < 4 ; i++) {
    for(let j = 0 ; j < 4 ; j++) {
        let run = true;
        while(run) {
            rand = Math.round((Math.random() *10) % 3) + 1;
            switch (rand) {
                case 1: if(pattern.a !== 0) {
                            run = false;
                            pattern.a--;
                            break;
                        }
                        else {
                            break;
                        }
                case 2: if(pattern.b !== 0) {
                            run = false;
                            pattern.b--;
                            break;
                        }
                        else {
                            break;
                        }
                case 3: if(pattern.c !== 0) {

                    run = false;
                            pattern.c--;
                            break;
                        }
                        else {
                            break;
                        }
                case 4: if(pattern.d !== 0) {
                            run = false;
                            pattern.d--;
                            break;
                        }
                        else {
                            break;
                        }
            }
        }
        tiles[i][j] = new Tile(100, 100 ,j ,i, rand, counter);
        tiles[i][j].backImageSelector(rand);
        tiles[i][j].draw(ctx);
        counter++;
    }
}



let input = new Input(canvas, tiles);


function gameloop() {

    ctx.clearRect(0, 0, width, height);

    for(let i = 0 ; i < 4 ; i++) {
        for(let j = 0 ; j < 4 ; j++) {
            tiles[i][j].draw(ctx);
        }
    }
    setTimeout(gameloop ,27);
}

setTimeout(gameloop ,27);


