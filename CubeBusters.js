var myBody;
var mySword;
var myObstacles = [];
var mouseX = 0;
var mouseY = 0;
var frame = 0;
var xDif = 0;
var yDif = 0;
var RandInt = 0;
var RandInt2 = 0;
var spawnObst = 0;


function startGame () {
	myGameArea.start();
	myBody = new Component(30,30,"blue",240,120,"Body");
    mySword= new Component(20,20,"lightblue",240,120,"Sword");
    newObst();
}

function newObst () {
    RandInt = Math.floor(Math.random()*4);
    RandInt2 = Math.random();
    switch (RandInt) {
        case 0:
            myObstacles.push(new Component(20,20,"red",490,RandInt2*260,"Obst"));
            return (true);
        case 1:
            myObstacles.push(new Component(20,20,"red",-30,RandInt2*260,"Obst"));
            return (true);
        case 2:
            myObstacles.push(new Component(20,20,"red",RandInt2*480,-30,"Obst"));
            return (true);
        case 3:
            myObstacles.push(new Component(20,20,"red",RandInt2*480,280,"Obst"));
            return (true);
    };
};

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function () {
		this.canvas.width = 900;
		this.canvas.height = 900;
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
            this.LTX = Math.cos(this.LTAngle) * (this.height+myBody.height/2) + mySword.x+this.width/2;
            this.LTY = Math.sin(this.LTAngle) * (this.height+myBody.height/2) + mySword.y+this.width/2;
            this.RTAngle = mySword.angle + this.TBonusAngle;
            this.RTX = Math.cos(this.RTAngle) * (this.height+myBody.height/2) + mySword.x+this.width/2;
            this.RTY = Math.sin(this.RTAngle) * (this.height+myBody.height/2) + mySword.y+this.width/2;
            this.BBonusAngle = Math.atan2(this.width/2,myBody.width/2);
            this.LBAngle = mySword.angle - this.BBonusAngle;
            this.LBX = Math.cos(this.LBAngle) * (myBody.height/2) + mySword.x+this.width/2;
            this.LBY = Math.sin(this.LBAngle) * (myBody.height/2) + mySword.y+this.width/2;
            this.RBAngle = mySword.angle + this.BBonusAngle;
            this.RBX = Math.cos(this.RBAngle) * (myBody.height/2) + mySword.x+this.width/2;
            this.RBY = Math.sin(this.RBAngle) * (myBody.height/2) + mySword.y+this.width/2;
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
            this.xCorners = [this.RBX, this.LBX, this.RTX, this.LTX];
            this.yCorners = [this.RBY, this.LBY, this.RTY, this.LTY];
        };
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
        for (i=0;i<myBody.xCorners.length;i++) {
            if (OtherObj.xCorners[p1] > OtherObj.xCorners[p2]) {
                this.BodyXDif = OtherObj.xCorners[p1] - myBody.xCorners[i];
            } else {
                this.BodyXDif = myBody.xCorners[i] - OtherObj.xCorners[p1];
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
        for (i=0;i<this.xCorners.length;i++) {
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
            for (z=0;z<myBody.xCorners.length;z++) {
                if (perpetrator.xCorners[perpetrator.LeftcornerName] < myBody.xCorners[z] && myBody.xCorners[z] < perpetrator.xCorners[perpetrator.RightcornerName] &&
                    perpetrator.yCorners[perpetrator.LowcornerName] < myBody.yCorners[z] && myBody.yCorners[z] < perpetrator.yCorners[perpetrator.HighcornerName]) {
                    return true;
                }
            }
            return false;
        }
        if (myBody.isBelowPoints(perpetrator,perpetrator.LeftcornerName,perpetrator.HighcornerName,"Oro") == false) {
            return false;
        } if (myBody.isBelowPoints(perpetrator,perpetrator.LowcornerName,perpetrator.RightcornerName) == false) {
            return false;
        } if (myBody.isBelowPoints(perpetrator,perpetrator.RightcornerName,perpetrator.HighcornerName,"Oro") == false) {
            return false;
        } if (myBody.isBelowPoints(perpetrator,perpetrator.LowcornerName,perpetrator.LeftcornerName) == false) {
            return false;
        }
        return true;
    }
};

function updateGameArea() {
    frame += 1;
    spawnObst += 1;
    if (spawnObst == 100) {
        newObst();
        spawnObst = 0;
    } if (myGameArea.keys && myGameArea.keys[37]) {
        myBody.angle -= Math.PI / 90;
        mySword.angle -= Math.PI / 90;
    }; if (myGameArea.keys && myGameArea.keys[39]) {
        myBody.angle += Math.PI / 90;
        mySword.angle += Math.PI / 90;
    };
    myGameArea.clear(); 
    mySword.newPos();
    mySword.update();
    myBody.newPos();
    myBody.update();
    for (i=0;i<myObstacles.length;i++) {
        myObstacles[i].newPos();
        myObstacles[i].update();
    };
    document.getElementById("testing2").innerHTML = "."
    document.getElementById("testing3").innerHTML = "."
    console.log(frame);
    for (z=0;z<myObstacles.length;z++) {
        
        if (myBody.isTouching(myObstacles[z])) {
            console.log("Triggered");
            
        }
    };
    document.getElementById("testing1").innerHTML = "Mouse: (" + (mouseX) + ", " + (mouseY) + ")";
};