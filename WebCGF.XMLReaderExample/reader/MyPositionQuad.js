function MyPositionQuad(scene, board, x, y, minPosX, maxPosX, minPosY, maxPosY){
    this.scene = scene;
    this.board = board;
    this.column = x + 5;
    this.row = -y + 5;
    this.piece = null;
    this.quad = new MyRectangle(scene, minPosX, maxPosX, minPosY, maxPosY, 0, 1, 0, 1);
    this.circumference = new MyPolygon(scene, 0.3, 20);
    this.pressed = 0;

    //Animation variables
    this.isAnimationActive = 0;
    this.animation = null;
    this.animationInitialTime = 0;
    this.previousAngle = 0;
    this.rowTo = 0;
    this.columnTo = 0;
    this.animationX = 0;
    this.animationY = 0;
    this.animationZ = 0;

    //camera variables
    this.previousCameraTarget = null;

    //Highlight appearance
    this.highlightAppearance = new CGFappearance(this.scene);
    this.highlightAppearance.setAmbient(0.6,0,0,1);
}

MyPositionQuad.prototype.setCoordinates = function(row, column) {
    this.row = row;
    this.column = column;
}

MyPositionQuad.prototype.getPiece = function () {
    return this.piece;
}

MyPositionQuad.prototype.setPiece = function (piece) {
    this.piece = piece;
}

MyPositionQuad.prototype.activateAnimation = function(rowTo, columnTo, span) {
    this.isAnimationActive = 1;
    this.rowTo = rowTo;
    this.columnTo = columnTo;

    this.animation = new ComplexAnimation(span);
    var centerx = ((this.column - 5) + (columnTo - 5)) / 2;
    var centery = 0;
    var centerz = ((this.row - 5) + (rowTo - 5)) / 2;
    this.animation.addCenter(centerx, centery, centerz);

    var radius = Math.sqrt(Math.pow(columnTo - this.column, 2) +  Math.pow(rowTo - this.row, 2)) / 2;
    this.animation.addRadius(radius);

    this.animation.addInitialAngle(0);

    this.animation.addAngle(180 / span);

    this.animation.velocityX = ((columnTo - 5) - (this.column - 5)) / span;
    this.animation.velocityZ = ((rowTo - 5) - (this.row - 5)) / span;

    this.animationInitialTime = this.scene.currentTime;
}

MyPositionQuad.prototype.displayHighlighted = function() {
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
	this.scene.translate((this.column - 5) , -(this.row - 5), 0.05);
    this.highlightAppearance.apply();
    this.circumference.display();
}

MyPositionQuad.prototype.display = function () {
    if(this.piece == null)
        this.quad.display();
    else {
        this.scene.pushMatrix();
        if(this.isAnimationActive == 1) {
            var ret = this.animation.position(this.animationInitialTime, this.scene.currentTime, this.previousAngle);
            var point = ret[0];
			this.previousAngle = ret[1];
            if(point != "done") {
                this.animationX = point.x;
                this.animationY = point.y;
                this.animationZ = point.z;
			}
			else {
				this.isAnimationActive = 0;
			}
        }
        this.scene.translate(this.column - 5 + this.animationX, 0 + this.animationY, this.row - 5 + this.animationZ);
        this.piece.display();
        this.scene.popMatrix();
        if(point == "done") {
            this.animationX = 0;
            this.animationY = 0;
            this.animationZ = 0;
            this.board.move(this.row, this.column, this.rowTo, this.columnTo);
        }
    }
}