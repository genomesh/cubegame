let myObstacles = [];
let mouseX = 0;
let mouseY = 0;
let frame = 0;
let xDif = 0;
let yDif = 0;
let RandInt = 0;
let RandInt2 = 0;
let GameAreaStopped = false;

function startGame () {
	myGameArea.start();
    myObstacles = [];
    mouseX = 0;
    mouseY = 0;
    frame = 0;
    xDif = 0;
    yDif = 0;
    RandInt = 0;
    RandInt2 = 0;
    Score = 0;
    GameAreaStopped = false;
	myBody = new Component(30,30,"blue",240,120,"Body");
    mySword = new Component(20,20,"lightblue",240,120,"Sword");
    newObst();
}

function newObst () {
    RandInt = Math.floor(Math.random()*4);
    RandInt2 = Math.random();
    switch (RandInt) {
        case 0:
            myObstacles.push(new Component(20,20,"red",490,RandInt2*260,"Obst"));
            break;
        case 1:
            myObstacles.push(new Component(20,20,"red",-30,RandInt2*260,"Obst"));
            break;
        case 2:
            myObstacles.push(new Component(20,20,"red",RandInt2*480,-30,"Obst"));
            break;
        case 3:
            myObstacles.push(new Component(20,20,"red",RandInt2*480,280,"Obst"));
            break;
    };
    console.log("Me.")
};

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function () {
		this.canvas.width = 500;
		this.canvas.height = 300;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
        window.addEventListener('mousemove', function (e) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        })
	},
    clear : function () {
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
        GameAreaStopped = true;
    }
}

function Component (width,height,color,x,y,type) {
    this.type = type;
    this.width = width;
	this.height = height;
    this.color = color;
	this.x = x;
	this.y = y;
    this.speed = 0;
    this.angle = 0;
    var Lowcorner = 0;
    this.Highcorner = 0;
    this.Rightcorner = 0;
    this.Leftcorner = 0;
    this.RightcornerName = 0;
    this.HighcornerName = 0;
    this.LowcornerName = 0;
    this.LeftcornerName = 0;
    this.WithinMaxPoint = false;
    this.WithinMinPoint = false;
    if (this.type == "Sword") {
        this.LengthToTopV = Math.sqrt(35*35 + 100);
        this.LengthToBotV = Math.sqrt(15*15 + 100);
        this.TopBonusAngle = Math.atan2(10,35);
        this.BotBonusAngle = Math.atan2(10,15);
    } 
    if (this.type == "Obst") { this.speed = 1; xDiff = this.x - myBody.x; yDiff = this.y - myBody.y; this.angle = Math.atan2(xDiff, yDiff) * -1}
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        if (this.type == "Sword") {
            ctx.fillRect(this.width*0.75, this.height/-2, this.width, this.height);
        } else if (this.type == "Body") {
            ctx.fillRect(this.width/-2, this.width/-2, this.width, this.height);
        } else {
            ctx.fillRect(this.width/-2, this.height/-2, this.width, this.height);
        }
        ctx.restore();
        if (this.type == "Sword") {
            this.TBonusAngle = Math.atan2(10,35);
            this.LTAngle = mySword.angle - this.TBonusAngle;
            this.LTX = Math.cos(this.LTAngle) * (this.height+myBody.height/2) + mySword.x;
            this.LTY = Math.sin(this.LTAngle) * (this.height+myBody.height/2) + mySword.y;
            this.RTAngle = mySword.angle + this.TBonusAngle;
            this.RTX = Math.cos(this.RTAngle) * (this.height+myBody.height/2) + mySword.x;
            this.RTY = Math.sin(this.RTAngle) * (this.height+myBody.height/2) + mySword.y;
            this.BBonusAngle = Math.atan2(this.width/2,myBody.width/2);
            this.LBAngle = mySword.angle - this.BBonusAngle;
            this.LBX = Math.cos(this.LBAngle) * (myBody.height/2) + mySword.x;
            this.LBY = Math.sin(this.LBAngle) * (myBody.height/2) + mySword.y;
            this.RBAngle = mySword.angle + this.BBonusAngle;
            this.RBX = Math.cos(this.RBAngle) * (myBody.height/2) + mySword.x;
            this.RBY = Math.sin(this.RBAngle) * (myBody.height/2) + mySword.y;
        } else {
            this.LengthToV = Math.sqrt(this.height*this.height/2);
            this.RBAngle = this.angle + Math.PI/4; //done
            this.RBX = Math.cos(this.RBAngle) * this.LengthToV + this.x;
            this.RBY = Math.sin(this.RBAngle) * this.LengthToV + this.y;
            this.RTAngle = this.angle - Math.PI/4; //done
            this.RTX = Math.cos(this.RTAngle) * this.LengthToV + this.x;
            this.RTY = Math.sin(this.RTAngle) * this.LengthToV + this.y;
            this.LTAngle = this.angle + Math.PI/4;
            this.LTX = (this.x) - Math.cos(this.RBAngle) * this.LengthToV;
            this.LTY = (this.y) - Math.sin(this.RBAngle) * this.LengthToV;
            this.LBAngle = this.angle - Math.PI/4; //done
            this.LBX =(this.x) - Math.cos(this.RTAngle) * this.LengthToV;
            this.LBY =(this.y) - Math.sin(this.RTAngle) * this.LengthToV;
        };
        this.xCorners = [this.RBX, this.LBX, this.RTX, this.LTX];
        this.yCorners = [this.RBY, this.LBY, this.RTY, this.LTY];
    };
    this.newPos = function() {
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    };
    this.isBelowPoints = function (OtherObj, p1, p2, iOro) { // p2 has higher y val
        if (OtherObj.yCorners[p1] > OtherObj.yCorners[p2]) {return false};
        if (OtherObj.xCorners[p1] > OtherObj.xCorners[p2]) {
            this.xDif = OtherObj.xCorners[p1] - OtherObj.xCorners[p2];
        } else {
            this.xDif = OtherObj.xCorners[p2] - OtherObj.xCorners[p1];
        };
        this.yDif = OtherObj.yCorners[p2] - OtherObj.yCorners[p1];
        for (let i=0;i<this.xCorners.length;i++) {
            if (OtherObj.xCorners[p1] > OtherObj.xCorners[p2]) {
                this.BodyXDif = OtherObj.xCorners[p1] - this.xCorners[i];
            } else {
                this.BodyXDif = this.xCorners[i] - OtherObj.xCorners[p1];
            };
            this.XPercent = this.BodyXDif / this.xDif;
            this.MinY = OtherObj.yCorners[p1] + this.yDif * this.XPercent;
            if (iOro != undefined) {
                if (this.yCorners[i] < this.MinY) {
                    return true;
                }
            }
            if (iOro == undefined) {
                if (this.yCorners[i] > this.MinY) {
                    return true;
                };
            }
        };
        if (iOro != undefined) {
            return false;
        };
        return false;
    };
    this.getCorners = function () {
        this.Lowcorner = this.yCorners[0];
        this.Highcorner = 0;
        this.Rightcorner = 0;
        this.Leftcorner = this.xCorners[0];
        this.LowcornerName = 0;
        this.RightcornerName = 0;
        this.HighcornerName = 0;
        this.LeftcornerName = 0;
        for (let i=0;i<this.xCorners.length;i++) {
            if (this.yCorners[i] < this.Lowcorner) {
                this.Lowcorner = this.yCorners[i];
                this.LowcornerName = i;
            } if (this.yCorners[i] > this.Highcorner) {
                this.Highcorner = this.yCorners[i];
                this.HighcornerName = i;
            } if (this.xCorners[i] < this.Leftcorner) {
                this.Leftcorner = this.xCorners[i];
                this.LeftcornerName = i;
            } if (this.xCorners[i] > this.Rightcorner) {
                this.Rightcorner = this.xCorners[i];
                this.RightcornerName = i;
            };
        };
    };
    this.isTouching = function(perpetrator) {
        perpetrator.getCorners();
        if (perpetrator.RightcornerName == perpetrator.LowcornerName || perpetrator.RightcornerName == perpetrator.HighcornerName || perpetrator.LeftcornerName == perpetrator.HighcornerName || perpetrator.LeftcornerName == perpetrator.LowcornerName) {
            for (let z=0;z<this.xCorners.length;z++) {
                if (perpetrator.xCorners[perpetrator.LeftcornerName] < this.xCorners[z] && this.xCorners[z] < perpetrator.xCorners[perpetrator.RightcornerName] &&
                    perpetrator.yCorners[perpetrator.LowcornerName] < this.yCorners[z] && this.yCorners[z] < perpetrator.yCorners[perpetrator.HighcornerName]) {
                    return true;
                }
            }
            return false;
        }
        if (this.isBelowPoints(perpetrator, perpetrator.LeftcornerName, perpetrator.HighcornerName,"Oro") == false) {
            return false;
        } if (this.isBelowPoints(perpetrator, perpetrator.LowcornerName, perpetrator.RightcornerName) == false) {
            return false;
        } if (this.isBelowPoints(perpetrator, perpetrator.RightcornerName, perpetrator.HighcornerName,"Oro") == false) {
            return false;
        } if (this.isBelowPoints(perpetrator, perpetrator.LowcornerName, perpetrator.LeftcornerName) == false) {
            return false;
        }
        return true;
    }
};

function updateGameArea() {
    frame += 1;
    if (myGameArea.keys && myGameArea.keys[37]) {
        myBody.angle -= Math.PI / 90;
        mySword.angle -= Math.PI / 90;
    }; if (myGameArea.keys && myGameArea.keys[39]) {
        myBody.angle += Math.PI / 90;
        mySword.angle += Math.PI / 90;
    };
    myGameArea.clear();
    myBody.newPos();
    myBody.update();
    mySword.newPos();
    mySword.update();
    for (let i=0;i<myObstacles.length;i++) {
        myObstacles[i].newPos();
        myObstacles[i].update();
    };
    for (pff=0; pff<myObstacles.length;pff++) {
        if (mySword.isTouching(myObstacles[pff])) {
            myObstacles.splice(pff,1);
        }
        if (myBody.isTouching(myObstacles[pff])) {
            myGameArea.stop();
            document.getElementById("RIP").innerHTML = "You Lose";
        }
        
    };
    console.log(frame);
    if (frame % 100 == 0) {
        newObst();
        console.log("Spawns:")
    };
    document.getElementById("Score").innerHTML = frame;
};
 
function restart() {
    myGameArea.clear();
    if (GameAreaStopped == false) {myGameArea.stop()};
    startGame();
    document.getElementById("RIP").innerHTML = "";
};