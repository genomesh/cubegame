function Component (x,y,color,type) {
    this.topCorners = [];
    this.botCorners = [];
    this.CheckCorner = function (xDifAtAngle,yDifAtAngle) {
        this.Cornerx = new Corner(xDifAtAngle, yDifAtAngle,true);
        this.Cornerx.updateCorner(this.angle);
    }
    this.pointInDirection = function (OtherObj) {
        this.angle = Math.atan2(this.x - OtherObj.x, this.y - OtherObj.y) * -1
    }
    this.color = color;
    this.angle = 0;
    this.type = type;
    this.x = x;
    this.y = y;
    this.longestLength = 0;
    this.AddCorner = function (x0Dif,y0Dif,TopOrBot) {
        if (TopOrBot == "Top") {
            this.topCorners.push(new Corner(x0Dif,y0Dif))
        };
        if (TopOrBot == "Bot") {
            this.botCorners.push(new Corner(x0Dif,y0Dif))
        }
    }
    this.isTouching = function (OtherObject) {
        for (let w = 0; w<this.topCorners.length; w++) {
            CornerInspect = this.topCorners[w];
            OtherObject.CheckCorner(CornerInspect.x-OtherObject.x,CornerInspect.y-OtherObject.y);
            if (OtherObject.Cornerx.isInObj(OtherObject)) {
                return true;
            }
        }
        for (let w = 0; w<this.botCorners.length; w++) {
            CornerInspect = this.botCorners[w];
            OtherObject.CheckCorner(CornerInspect.x-OtherObject.x,CornerInspect.y-OtherObject.y);
            if (OtherObject.Cornerx.isInObj(OtherObject)) {
                return true;
            }
        }
        return false;
    }
    this.updateCorners = function () {
        for (let x=0; x<this.topCorners.length; x++) {
            this.topCorners[x].updateCorner(this.angle,this.x,this.y);
        }
        for (let i=0; i<this.botCorners.length; i++) {
            this.botCorners[i].updateCorner(this.angle,this.x,this.y);
        }
    }
    this.updateLongestlength = function () {
        for (let x=0;x<this.topCorners.length;x++) {
            if (this.topCorners[x].DistanceFromCentre > this.longestLength) {
                this.longestLength = this.topCorners[x].DistanceFromCentre;
            }
        }
        for (let x=0;x<this.botCorners.length;x++) {
            if (this.botCorners[x].DistanceFromCentre > this.longestLength) {
                this.longestLength = this.botCorners[x].DistanceFromCentre;
            }
        }
    }
    this.update = function () {
        const ctx = myCanvas.context;
        ctx.beginPath();
        ctx.moveTo(this.topCorners[0].x,this.topCorners[0].y);
        for (let x=1;x<this.topCorners.length;x++) {
            ctx.lineTo(this.topCorners[x].x,this.topCorners[x].y);
        };
        for (let y=0;y<this.botCorners.length;y++) {
            ctx.lineTo(this.botCorners[this.botCorners.length-1-y].x,this.botCorners[this.botCorners.length-1-y].y);
        };
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.fillStyle = "black";
        //draw outline
    };
}

var myCanvas = {
	canvas : document.createElement("canvas"),
	start : function () {
        this.canvas.width = 450;
		this.canvas.height = 450;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(ChangeTheAngle, 20);
        window.addEventListener('keydown', function (e) {
            myCanvas.keys = (myCanvas.keys || []);
            myCanvas.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myCanvas.keys[e.keyCode] = false;
        })
	},
    clear : function () {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    stop : function () {
        clearInterval(this.interval);
        GameAreaStopped = true;
    }
}

function createObstacle () {
    myObstacles[myObstacles.length-1].AddCorner(-8,-6,"Bot");
    myObstacles[myObstacles.length-1].AddCorner(0,-20,"Bot");
    myObstacles[myObstacles.length-1].AddCorner(8,-6,"Bot");
    myObstacles[myObstacles.length-1].AddCorner(-8,-6,"Top");
    myObstacles[myObstacles.length-1].AddCorner(8,-6,"Top");
    myObstacles[myObstacles.length-1].updateCorners();
}


function spawnObstacle () {
    RandInt = Math.floor(Math.random()*4);
    RandInt2 = Math.random();
    switch (RandInt) {
        case 0:
            myObstacles.push(new Component(myCanvas.canvas.width + 20,RandInt2*myCanvas.canvas.height,"red","Obst"));
            break;
        case 1:
            myObstacles.push(new Component(-20,RandInt2*myCanvas.canvas.height,"red","Obst"));
            break;
        case 2:
            myObstacles.push(new Component(RandInt2*myCanvas.canvas.width,-20,"red","Obst"));
            break;
        case 3:
            myObstacles.push(new Component(RandInt2*myCanvas.canvas.width,myCanvas.canvas.height+20,"red","Obst"));
            break;
    };
    myObstacles[myObstacles.length-1].pointInDirection(myBody);
    createObstacle();
};

function Corner (xDifAt0,yDifAt0,AngleIfCheck) {
    this.DistanceFromCentre = Math.sqrt(xDifAt0 * xDifAt0 + yDifAt0 * yDifAt0);
    this.angleFromCentre = Math.atan2(yDifAt0,xDifAt0);
    this.xDifAt0 = xDifAt0;
    this.yDifAt0 = yDifAt0;
    this.xFromCentre = 0;
    this.yFromCentre = 0;
    this.x = 0;
    this.y = 0;
    if (AngleIfCheck) {this.TempPoint = true;}
    this.updateCorner = function (angle,ObjX,ObjY) {
        if (this.TempPoint) {
            this.xDifAt0 = Math.cos(this.angleFromCentre-angle) * this.DistanceFromCentre;
            this.yDifAt0 = Math.sin(this.angleFromCentre-angle) * this.DistanceFromCentre;
        } else {
            this.xFromCentre = Math.cos(angle+this.angleFromCentre) * this.DistanceFromCentre;
            this.yFromCentre = Math.sin(angle+this.angleFromCentre) * this.DistanceFromCentre;
            this.x = ObjX + this.xFromCentre;
            this.y = ObjY + this.yFromCentre;
        }
        
    };
    this.isBelowPoints = function (OtherObj, p1, p2) { // p2 has higher x val
        this.xDif = OtherObj.topCorners[p2].xDifAt0 - OtherObj.topCorners[p1].xDifAt0;
        if (OtherObj.topCorners[p2].yDifAt0 > OtherObj.topCorners[p1].yDifAt0) {
            this.yDif = OtherObj.topCorners[p2].yDifAt0 - OtherObj.topCorners[p1].yDifAt0;
            this.BodyXDif = this.xDifAt0 - OtherObj.topCorners[p1].xDifAt0;
            this.XPercent = this.BodyXDif / this.xDif;
            this.MaxY = OtherObj.topCorners[p1].yDifAt0 + this.yDif * this.XPercent;
        } else {
            this.yDif = OtherObj.topCorners[p1].yDifAt0 - OtherObj.topCorners[p2].yDifAt0;
            this.BodyXDif = this.xDifAt0 - OtherObj.topCorners[p1].xDifAt0;
            this.XPercent = this.BodyXDif / this.xDif;
            this.MaxY = OtherObj.topCorners[p1].yDifAt0 - this.yDif * this.XPercent;
        };
        if (this.yDifAt0 < this.MaxY) {
            return true;
        } else {
            return false;
        }
    };
    this.isAbovePoints = function (OtherObj, p1, p2) { // p2 has higher x val
        this.xDif = OtherObj.botCorners[p2].xDifAt0 - OtherObj.botCorners[p1].xDifAt0;
        if (OtherObj.botCorners[p2].yDifAt0 > OtherObj.botCorners[p1].yDifAt0) {
            this.yDif = OtherObj.botCorners[p2].yDifAt0 - OtherObj.botCorners[p1].yDifAt0;
            this.BodyXDif = this.xDifAt0 - OtherObj.botCorners[p1].xDifAt0;
            this.XPercent = this.BodyXDif / this.xDif;
            this.MinY = OtherObj.botCorners[p1].yDifAt0 + this.yDif * this.XPercent;
        } else {
            this.yDif = OtherObj.botCorners[p1].yDifAt0 - OtherObj.botCorners[p2].yDifAt0;
            this.BodyXDif = this.xDifAt0 - OtherObj.botCorners[p1].xDifAt0;
            this.XPercent = this.BodyXDif / this.xDif;
            this.MinY = OtherObj.botCorners[p1].yDifAt0 - this.yDif * this.XPercent;
        };
        if (this.yDifAt0 > this.MinY) {
            return true;
        } else {
            return false;
        }
    };
    this.isInObj = function (OtherObj) {
        for (let i=0;i<OtherObj.topCorners.length-1;i++) {
            if (this.xDifAt0 < OtherObj.topCorners[i+1].xDifAt0 && this.xDifAt0 >= OtherObj.topCorners[i].xDifAt0) {
                if (this.isBelowPoints(OtherObj,i,i+1)) {
                    this.belowTop = true;
                }
            }
        };
        for (let i=0;i<OtherObj.botCorners.length-1;i++) {
            if (this.xDifAt0 < OtherObj.botCorners[i+1].xDifAt0 && this.xDifAt0 >= OtherObj.botCorners[i].xDifAt0) {
                if (this.isAbovePoints(OtherObj,i,i+1)) {
                    this.aboveBot = true;
                }
            }
        }
        if (this.aboveBot && this.belowTop) {
            return true;
        } else {
            return false;
        }
    }
}

myBody = new Component(225,225,"lightblue");
mySword = new Component(225,225,"blue");

let myObstacles = [];

GameAreaStopped = false;

myBody.LengthFromCentre = 30;

myBody.AddCorner(Math.cos(Math.PI/10)*-myBody.LengthFromCentre,Math.sin(Math.PI/10)*-myBody.LengthFromCentre,"Bot");
myBody.AddCorner(0,-myBody.LengthFromCentre,"Bot");
myBody.AddCorner(Math.cos(Math.PI/10)*myBody.LengthFromCentre,Math.sin(Math.PI/10)*-myBody.LengthFromCentre,"Bot");

myBody.AddCorner(Math.cos(Math.PI/10)*-myBody.LengthFromCentre,Math.sin(Math.PI/10)*-myBody.LengthFromCentre,"Top");
myBody.AddCorner(Math.cos(Math.PI*3/10)*-myBody.LengthFromCentre,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre,"Top");
myBody.AddCorner(Math.cos(Math.PI*3/10)*myBody.LengthFromCentre,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre,"Top");
myBody.AddCorner(Math.cos(Math.PI/10)*myBody.LengthFromCentre,Math.sin(Math.PI/10)*-myBody.LengthFromCentre,"Top");

mySword.AddCorner(-8,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre,"Bot");
mySword.AddCorner(8,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre,"Bot");

mySword.AddCorner(-8,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre,"Top");
mySword.AddCorner(0,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre*2,"Top");
mySword.AddCorner(8,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre,"Top");

let spawnObstacleCounter = 0;
let kills = 0;
startGame = function () {
    myBody.x = 225;
    myBody.y = 225;
    mySword.y = 225;
    mySword.x = 225;
    myBody.angle = 0;
    mySword.angle = 0;
    myObstacles = [];
    spawnObstacleCounter = 0;
    kills = 0;
    GameAreaStopped = false;
    myBody.updateCorners();
    mySword.updateCorners();

    myCanvas.start();
    
    instructionsDisplayed = false;
    
    myBody.update();
    mySword.update();
}

toggleInstructions = function () {
    console.log("yo");
    if (instructionsDisplayed == false) {
        drawInstructions();
        instructionsDisplayed = true;
    } else {
        removeInstructions();
        instructionsDisplayed = false;
    }
}
drawInstructions = function () {
    if (GameAreaStopped == true) { startGame(); }
    let ctx = myCanvas.context;
    let image = document.getElementById("image");
    ctx.drawImage(image,0,0,450,450);
    console.log("hi");
    GameAreaStopped = true;
    myCanvas.stop();
}

let instructionsDisplayed = false;

removeInstructions = function () {
    restart();
}

stopGame = function () {
    myCanvas.clear();
    if (GameAreaStopped == false) {myCanvas.stop()};
}

function restart() {
    stopGame();
    startGame();
};

let Level = 0;

function levelDown () {if (Level > 0) { Level -= 1; } }
function levelUp () {if (Level < 9) { Level += 1; } }

function ChangeTheAngle () {
    if (spawnObstacleCounter % (100 - 10*Level) == 0) { spawnObstacle(); }
    spawnObstacleCounter += 1;
    document.getElementById("Score").innerHTML = "Score: " + spawnObstacleCounter;
    document.getElementById("Kills").innerHTML = "Kills: " + kills;
    document.getElementById("Level").innerHTML = "Level: " + Level;
    if (myCanvas.keys && myCanvas.keys[65]) {
        myBody.x -= 2;
        mySword.x -= 2;
    }; if (myCanvas.keys && myCanvas.keys[68]) {
        myBody.x += 2;
        mySword.x += 2;
    }; if (myCanvas.keys && myCanvas.keys[87]) {
        myBody.y -= 2;
        mySword.y -= 2;
    }; if (myCanvas.keys && myCanvas.keys[83]) {
        myBody.y += 2;
        mySword.y += 2;
    }; if (myCanvas.keys && myCanvas.keys[37]) {
        myBody.angle -= Math.PI/60;
        mySword.angle -= Math.PI/60;
    }; if (myCanvas.keys && myCanvas.keys[39]) {
        myBody.angle += Math.PI/60;
        mySword.angle += Math.PI/60;
    };
    myCanvas.clear();
    myBody.updateCorners();
    mySword.updateCorners();
    myBody.update();
    mySword.update();
    for (let o = 0; o < myObstacles.length; o++) {
        if (myObstacles[o].isTouching(myBody)) {
            myCanvas.stop();
        }
        if (myObstacles[o].isTouching(mySword)) {
            myObstacles.splice(o,1);
            o -= 1;
            kills += 1;
        } else {
            myObstacles[o].pointInDirection(myBody);
            myObstacles[o].x += Math.sin(myObstacles[o].angle);
            myObstacles[o].y -= Math.cos(myObstacles[o].angle);
            myObstacles[o].updateCorners();
            myObstacles[o].update();
        }
    }
    if (myBody.x > 675 || myBody.x < -225 || myBody.y > 675 || myBody.y < -225) {
        myCanvas.stop();
        GameAreaStopped = true;
    }
}
/*
<html>
    <head>
    </head>
    <body>
        <canvas id = "canvas" width="500" height="500"></canvas>
        <div style="display:none;">
        <img src = "https://authoritynutrition.com/wp-content/uploads/2013/01/fruits.jpg" id = "source" width="300" height="227">
        </div>
        <script>
            let canvas = document.getElementById("canvas");
            let ctx = canvas.getContext("2d");
            let image = document.getElementById("source");
            
            ctx.drawImage(image, 33,71,104,124,21,20,87,104);
        </script>
    </body>
</html>
*/