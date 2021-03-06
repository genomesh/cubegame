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
    this.xPos = x;
    this.yPos = y;
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
    };
}

let myCanvas = {
	canvas : document.createElement("canvas"),
	start : function () {
        this.canvas.width=600;
        this.canvas.height=400;
        this.apparentWidth=600;
        this.apparentHeight=400;
        this.canvas.id = 'canvas';
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateArea, 20);
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

let myScoreboard = {
	canvas : document.createElement("canvas"),
	start : function () {
        this.mouseDownOnRestart = false;
        this.canvas.width = 150;
		this.canvas.height = 400;
        this.canvas.id = 'scoreboard';
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateScoreboard, 20);
        window.addEventListener('mousemove', function (e) {
            myScoreboard.mouseX = e.pageX-myCanvas.apparentWidth-10;
            myScoreboard.mouseY = e.pageY-10;
        })
         window.addEventListener('mousedown', function (e) {
            if (restartButton.isOn()) { restartButton.pressed = true; }
            if (levelUpButton.isOn()) { levelUpButton.pressed = true; }
            if (levelDownButton.isOn()) { levelDownButton.pressed = true; }
            if (InstructionsButton.isOn()) { InstructionsButton.pressed = true; }
        })
         window.addEventListener('mouseup', function (e) {
            if (restartButton.isOn() && restartButton.pressed) { restart(); }
            if (levelUpButton.isOn() && levelUpButton.pressed) { levelUp(); }
            if (levelDownButton.isOn() && levelDownButton.pressed) { levelDown(); }
            if (InstructionsButton.isOn() && InstructionsButton.pressed) { toggleInstructions(); }
            restartButton.pressed = false;
            levelUpButton.pressed = false;
            levelDownButton.pressed = false;
            InstructionsButton.pressed = false;
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
    myObstacles[myObstacles.length-1].AddCorner(-(myBody.LengthFromCentre/4),-(myBody.LengthFromCentre/5),"Bot"); 
    myObstacles[myObstacles.length-1].AddCorner(0,-(myBody.LengthFromCentre*2/3),"Bot");
    myObstacles[myObstacles.length-1].AddCorner((myBody.LengthFromCentre/4),-(myBody.LengthFromCentre/5),"Bot");
    myObstacles[myObstacles.length-1].AddCorner(-(myBody.LengthFromCentre/4),-(myBody.LengthFromCentre/5),"Top");
    myObstacles[myObstacles.length-1].AddCorner((myBody.LengthFromCentre/4),-(myBody.LengthFromCentre/5),"Top"); 
    myObstacles[myObstacles.length-1].updateCorners();
}

function updateScoreboard () {
    resizeCanvas();
    const ctx = myScoreboard.canvas.getContext("2d");
    myScoreboard.clear();
    ctx.textBaseline = "hanging";
    ctx.font = myScoreboard.canvas.width/6+"px consolas";
    ctx.fillStyle= "black";
    ctx.fillText("Score: " + spawnObstacleCounter.toString(), 10, 10, myScoreboard.canvas.width-20);
    ctx.fillText("Kills: " + kills.toString(), 10, myScoreboard.canvas.width/6+10, myScoreboard.canvas.width-20);
    ctx.fillText("Level: " + Level.toString(), 10, 2*myScoreboard.canvas.width/6+10, myScoreboard.canvas.width-20);
    levelDownButton.start();
    levelUpButton.start();
    restartButton.start();
    InstructionsButton.start();
    if (restartButton.isOn()) { restartButton.blockColour = '#f1f1f1';} else {restartButton.blockColour = 'lightgrey'; }
    if (restartButton.pressed) { restartButton.designColour = 'lightgrey';} else { restartButton.designColour = 'darkgrey';}
    if (levelUpButton.isOn()) { levelUpButton.blockColour = '#f1f1f1';} else {levelUpButton.blockColour = 'lightgrey'; }
    if (levelUpButton.pressed) { levelUpButton.designColour = 'lightgrey';} else { levelUpButton.designColour = 'darkgrey';}
    if (levelDownButton.isOn()) { levelDownButton.blockColour = '#f1f1f1';} else {levelDownButton.blockColour = 'lightgrey'; }
    if (levelDownButton.pressed) { levelDownButton.designColour = 'lightgrey';} else { levelDownButton.designColour = 'darkgrey';}
    if (InstructionsButton.isOn()) { InstructionsButton.blockColour = '#f1f1f1';} else {InstructionsButton.blockColour = 'lightgrey'; }
    if (InstructionsButton.pressed) { InstructionsButton.designColour = 'lightgrey';} else { InstructionsButton.designColour = 'darkgrey';}
    levelUpButton.drawMe();
    levelDownButton.drawMe();
    restartButton.drawMe();
    InstructionsButton.drawMe();
}

let levelDownButton = {
    pressed : false,
    start : function () {
        this.buttonSize = myScoreboard.canvas.width/3;
        this.bL = this.buttonSize/10;
        this.x = myScoreboard.canvas.width/9;
        this.y = myScoreboard.canvas.height/4;
        this.blockColour = 'lightgrey';
        this.designColour = "darkgray";
    },
    isOn : function () {
        if (myScoreboard.mouseX > this.x && myScoreboard.mouseX < this.x+this.buttonSize && myScoreboard.mouseY > this.y && myScoreboard.mouseY < this.y+this.buttonSize) { return true; } else { return false; }
    },
    drawMe : function () {
        const ctx = myScoreboard.canvas.getContext("2d");
        ctx.fillStyle= this.blockColour;
        ctx.fillRect(this.x,this.y,this.buttonSize,this.buttonSize);
        ctx.fillStyle= this.designColour;
        ctx.fillRect(this.x+this.bL*2,this.y+this.bL*4, this.bL*6,this.bL*2);
    }
}

let levelUpButton = {
    pressed : false,
    start : function () {
        this.buttonSize = myScoreboard.canvas.width/3;
        this.bL = this.buttonSize/10;
        this.x = myScoreboard.canvas.width*5/9;
        this.y = myScoreboard.canvas.height/4;
        
        this.blockColour = 'lightgrey';
        this.designColour = "darkgray";
    },
    isOn : function () {
        if (myScoreboard.mouseX > this.x && myScoreboard.mouseX < this.x+this.buttonSize && myScoreboard.mouseY > this.y && myScoreboard.mouseY < this.y+this.buttonSize) { return true; } else { return false; }
    },
    drawMe : function () {
        const ctx = myScoreboard.canvas.getContext("2d");
        ctx.fillStyle= this.blockColour;
        ctx.fillRect(this.x,this.y,this.buttonSize,this.buttonSize);
        ctx.fillStyle= this.designColour;
        ctx.fillRect(this.x+this.bL*2,this.y+this.bL*4, this.bL*6,this.bL*2);
        ctx.fillRect(this.x+this.bL*4,this.y+this.bL*2, this.bL*2,this.bL*6);
    }
}

let restartButton = {
    pressed : false,
    start : function () {
        this.buttonSize = myScoreboard.canvas.width/3;
        this.bL = this.buttonSize/10;
        this.x = myScoreboard.canvas.width/9;
        this.y = myScoreboard.canvas.height/4 + myScoreboard.canvas.width*4/9;
        this.designColour = 'darkgray';
        this.blockColour = 'lightgrey';
    },
    isOn : function () {
        if (myScoreboard.mouseX > this.x && myScoreboard.mouseX < this.x+this.buttonSize && myScoreboard.mouseY > this.y && myScoreboard.mouseY < this.y+this.buttonSize) { return true; } else { return false; }
    },
    drawMe : function () {
        const ctx = myScoreboard.canvas.getContext("2d");
        ctx.fillStyle = this.blockColour;
        ctx.fillRect(this.x,this.y,this.buttonSize,this.buttonSize);
        ctx.fillStyle = this.designColour;
        ctx.fillRect(this.x+this.bL*6,this.y+this.bL*2,this.bL,this.bL*5);
        ctx.fillRect(this.x+this.bL*5,this.y+this.bL*5,this.bL*3,this.bL);
        ctx.fillRect(this.x+this.bL*4,this.y+this.bL*4,this.bL*5,this.bL);
        ctx.fillRect(this.x+this.bL*5,this.y+this.bL*2,this.bL,this.bL);
        ctx.fillRect(this.x+this.bL*2,this.y+this.bL,this.bL*4,this.bL);
        ctx.fillRect(this.x+this.bL*2,this.y+this.bL*2,this.bL,this.bL);
        ctx.fillRect(this.x+this.bL,this.y+this.bL*2,this.bL,this.bL*6);
        ctx.fillRect(this.x+this.bL*2,this.y+this.bL*7,this.bL,this.bL);
        ctx.fillRect(this.x+this.bL*2,this.y+this.bL*8,this.bL*4,this.bL);
    }
};

let InstructionsButton = {
    pressed : false,
    start : function () {
        this.buttonSize = myScoreboard.canvas.width/3;
        this.bL = this.buttonSize/10;
        this.x = myScoreboard.canvas.width*5/9;
        this.y = myScoreboard.canvas.height/4 + myScoreboard.canvas.width*4/9;
        this.designColour = 'darkgray';
        this.blockColour = 'lightgrey';
    },
    isOn : function () {
        if (myScoreboard.mouseX > this.x && myScoreboard.mouseX < this.x+this.buttonSize && myScoreboard.mouseY > this.y && myScoreboard.mouseY < this.y+this.buttonSize) { return true; } else { return false; }
    },
    drawMe : function () {
        const ctx = myScoreboard.canvas.getContext("2d");
        ctx.fillStyle = this.blockColour;
        ctx.fillRect(this.x,this.y,this.buttonSize,this.buttonSize);
        ctx.fillStyle = this.designColour;
        ctx.fillRect(this.x+this.bL*4,this.y+this.bL*7,this.bL*2,this.bL*2);
        ctx.fillRect(this.x+this.bL*5,this.y+this.bL*4,this.bL*3,this.bL);
        ctx.fillRect(this.x+this.bL*6,this.y+this.bL*2,this.bL*2,this.bL);
        ctx.fillRect(this.x+this.bL*3,this.y+this.bL,this.bL*4,this.bL);
        ctx.fillRect(this.x+this.bL*2,this.y+this.bL*2,this.bL*2,this.bL);
        ctx.fillRect(this.x+this.bL*5,this.y+this.bL*5,this.bL,this.bL);
        ctx.fillRect(this.x+this.bL*7,this.y+this.bL*3,this.bL,this.bL);
        ctx.fillRect(this.x+this.bL*2,this.y+this.bL*3,this.bL,this.bL);
        
    }
};

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

function updateObstacleSize () {
    myBody.botCorners = [
        new Corner(Math.cos(Math.PI/10)*-myBody.LengthFromCentre,Math.sin(Math.PI/10)*-myBody.LengthFromCentre),
        new Corner(0,-myBody.LengthFromCentre),
        new Corner(Math.cos(Math.PI/10)*myBody.LengthFromCentre,Math.sin(Math.PI/10)*-myBody.LengthFromCentre)
    ]
    myBody.topCorners = [
        new Corner(Math.cos(Math.PI/10)*-myBody.LengthFromCentre,Math.sin(Math.PI/10)*-myBody.LengthFromCentre),
        new Corner(Math.cos(Math.PI*3/10)*-myBody.LengthFromCentre,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre),
        new Corner(Math.cos(Math.PI*3/10)*myBody.LengthFromCentre,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre),
        new Corner(Math.cos(Math.PI/10)*myBody.LengthFromCentre,Math.sin(Math.PI/10)*-myBody.LengthFromCentre)
    ]
    mySword.botCorners = [
        new Corner(-(myBody.LengthFromCentre/4),Math.sin(Math.PI*3/10)*myBody.LengthFromCentre),
        new Corner((myBody.LengthFromCentre/4),Math.sin(Math.PI*3/10)*myBody.LengthFromCentre)
    ]
    mySword.topCorners = [
        new Corner(-(myBody.LengthFromCentre/4),Math.sin(Math.PI*3/10)*myBody.LengthFromCentre),
        new Corner(0,Math.sin(Math.PI*3/10)*myBody.LengthFromCentre*2),
        new Corner((myBody.LengthFromCentre/4),Math.sin(Math.PI*3/10)*myBody.LengthFromCentre)
    ]
}

startGame = function () {
    myBody.x = myCanvas.canvas.width/2;
    myBody.y = myCanvas.canvas.height/2;
    mySword.y = myCanvas.canvas.height/2;
    mySword.x = myCanvas.canvas.width/2;
    myBody.xPos = myBody.x;
    myBody.yPos = myBody.y;
    myBody.angle = 0;
    mySword.angle = 0;
    myObstacles = [];
    playerName = 'Anon';
    spawnObstacleCounter = 0;
    kills = 0;
    GameAreaStopped = false;
    myBody.updateCorners();
    mySword.updateCorners();
    myBody.dead = false;
    myScoreboard.start();
    myCanvas.start();
    
    instructionsDisplayed = false;
    
    myBody.update();
    mySword.update();
}

toggleInstructions = function () {
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
    GameAreaStopped = true;
    myCanvas.stop();
}

removeInstructions = function () {
    restart();
}

death = function () {
    myBody.dead = true;
    console.log('Death');
    let myHeaders = new Headers();
    myHeaders.append("Content-Type",'application/json');
    playerName = document.getElementById('name').value;
    if (playerName == "") {playerName = 'Anon'}
    let myInit = {
        method:"POST",
        body:JSON.stringify({score:spawnObstacleCounter,
                            level:Level,
                            name:playerName}),
        headers: myHeaders
    };
    fetch("/highscore",myInit).then(function (res) {
        return res.json();
    }).then(function (hsarray) {
        highscores=hsarray;
        displayHighscores();
    })
}

stopGame = function () {
    myCanvas.clear();
    if (GameAreaStopped == false) {myCanvas.stop()};
}

function restart() {
    stopGame();
    startGame();
};

function displayHighscores () {
    ctx = myCanvas.canvas.getContext("2d");
    ctx.fillStyle = "darkgrey";
    ctx.textBaseline = "hanging";
    ctx.font= "35px consolas";
    ctx.fillText("Level " + Level.toString() + " Highscores:",150,40,300);
    ctx.fillRect(200,100,200,60);
    ctx.fillRect(200,200,200,60);
    ctx.fillRect(200,300,200,60);
    ctx.font= "30px consolas";
    ctx.fillStyle = "lightgrey";
    ctx.fillText(highscores[Level][0].name + ": " + highscores[Level][0].score.toString(),215,115,170);
    ctx.fillText(highscores[Level][1].name + ": " + highscores[Level][1].score.toString(),215,215,170);
    ctx.fillText(highscores[Level][2].name + ": " + highscores[Level][2].score.toString(),215,315,170);
    
}

function levelDown () {
    if (Level > 0) {
        Level -= 1;
        spawnObstacleCounter=0;
    }
}
function levelUp () {
    if (Level < 9) {
        Level += 1;
        spawnObstacleCounter=0;
    }
}

ScaleHeight = 300;
ScaleWidth = 500;

resizeCanvas = function() {
    if (window.innerHeight < screen.availHeight) { ScaleHeight = window.innerHeight} else {ScaleHeight = screen.availHeight}
    if (window.innerWidth < screen.availWidth) { ScaleWidth = window.innerWidth} else {ScaleWidth = screen.availWidth}
    if (ScaleHeight/8 > ScaleWidth/15) {
        myCanvas.canvas.style="width: " + ((ScaleWidth-40)*4/5).toString();
        myCanvas.apparentWidth = (ScaleWidth-40)*4/5;
        myCanvas.apparentHeight = myCanvas.apparentWidth/3*2;
        myScoreboard.canvas.width = (ScaleWidth-40)/5;
        myScoreboard.canvas.height = myScoreboard.canvas.width/3*8;
    } else {
        myCanvas.canvas.style="height: " + (ScaleHeight-40).toString();
        myCanvas.apparentHeight = ScaleHeight-40;
        myCanvas.apparentWidth = myCanvas.apparentHeight/2*3;
        myScoreboard.canvas.height = ScaleHeight-40;
        myScoreboard.canvas.width = myScoreboard.canvas.height/8*3
    }
}

function updateArea () {
    if (myBody.dead === false) {
        if (spawnObstacleCounter % (100 - 10*Level) == 0) { spawnObstacle(); }
        spawnObstacleCounter += 1;
        if (myBody.yPos+myCanvas.canvas.height/2 > 600 || myBody.yPos-myCanvas.canvas.height/2 < -200) {
            if (myCanvas.keys && myCanvas.keys[87]) {
                myBody.y -= 2;
                mySword.y -= 2;
                myBody.yPos -= 2;
            }; if (myCanvas.keys && myCanvas.keys[83]) {
                myBody.y += 2;
                mySword.y += 2;
                myBody.yPos += 2;
            };
        } else {
            if (myCanvas.keys && myCanvas.keys[87]) {
                for (let i=0;i<myObstacles.length;i++) {
                    myObstacles[i].y += 2;
                }
                myBody.yPos -= 2;
            }; if (myCanvas.keys && myCanvas.keys[83]) {
                for (let i=0;i<myObstacles.length;i++) {
                    myObstacles[i].y -= 2;
                }
                myBody.yPos += 2;
            };
        }
        if (myBody.xPos+myCanvas.canvas.width/2 > 960 || myBody.xPos-myCanvas.canvas.width/2 < -320) {
            if (myCanvas.keys && myCanvas.keys[65]) {
                myBody.x -= 2;
                mySword.x -= 2;
                myBody.xPos -= 2;
            }; if (myCanvas.keys && myCanvas.keys[68]) {
                myBody.x += 2;
                mySword.x += 2;
                myBody.xPos += 2;
            }; 
        } else {
            if (myCanvas.keys && myCanvas.keys[65]) {
                for (let i=0;i<myObstacles.length;i++) {
                    myObstacles[i].x += 2;
                }
                myBody.xPos -= 2;
            }; if (myCanvas.keys && myCanvas.keys[68]) {
                for (let i=0;i<myObstacles.length;i++) {
                    myObstacles[i].x -= 2;
                }
                myBody.xPos += 2;
            };
        }
        if (myCanvas.keys && myCanvas.keys[37]) {
            myBody.angle -= Math.PI/60;
            mySword.angle -= Math.PI/60;
        }; if (myCanvas.keys && myCanvas.keys[39]) {
            myBody.angle += Math.PI/60;
            mySword.angle += Math.PI/60;
        };
        myBody.LengthFromCentre = myCanvas.canvas.width/20;
        myCanvas.clear();
        myBody.updateCorners();
        mySword.updateCorners();
        myBody.update();
        mySword.update();
        updateObstacleSize();
        for (let o = 0; o < myObstacles.length; o++) {
            if (myObstacles[o].isTouching(myBody)) {
                death();
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
        if (myBody.xPos > 960 || myBody.xPos < -320 || myBody.yPos > 600 || myBody.yPos < -200) {
            death();
        }
    } else {
        ctx = myCanvas.canvas.getContext("2d");
        myBody.LengthFromCentre = myCanvas.canvas.width/20;
        myCanvas.clear();
        ctx.globalAlpha = 0.5;
        myBody.updateCorners();
        mySword.updateCorners();
        myBody.update();
        mySword.update();
        updateObstacleSize();
        for (let o = 0; o < myObstacles.length; o++) {
            myObstacles[o].updateCorners();
            myObstacles[o].update();
        }
        ctx.globalAlpha = 1;
        displayHighscores();
    }
}

let highscores = [];
let Level = 0;
myBody = new Component(myCanvas.canvas.width/2,myCanvas.canvas.height/2,"lightblue");
mySword = new Component(myCanvas.canvas.width/2,myCanvas.canvas.height/2,"blue");

myBody.dead = false;

myBody.LengthFromCentre = 30;

fetch("/hits").then(function(response) {
    return response.json()
}).then(function(nowJson) {
    document.getElementById("hits").innerHTML = nowJson.hits
});


updateObstacleSize();

let spawnObstacleCounter = 0;
let kills = 0;

let instructionsDisplayed = false;

let myObstacles = [];

GameAreaStopped = false;