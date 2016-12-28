function MyPositionQuad(scene, board, x, y, minPosX, maxPosX, minPosY, maxPosY){
    this.scene = scene;
    this.board = board;
    this.column = x + 5;
    this.row = -y + 5;
    this.piece = null;
    this.quad = new MyRectangle(scene, minPosX, maxPosX, minPosY, maxPosY, 0, 1, 0, 1);
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

MyPositionQuad.prototype.activateAnimation = function(rowTo, columnTo) {
    this.isAnimationActive = 1;
    this.rowTo = rowTo;
    this.columnTo = columnTo;

    this.animation = new ComplexAnimation(2);
    var centerx = ((this.column - 5) + (columnTo - 5)) / 2;
    var centery = 0;
    var centerz = ((this.row - 5) + (rowTo - 5)) / 2;
    this.animation.addCenter(centerx, centery, centerz);

    var radius = Math.sqrt(Math.pow(columnTo - this.column, 2) +  Math.pow(rowTo - this.row, 2)) / 2;
    this.animation.addRadius(radius);

    this.animation.addInitialAngle(0);

    this.animation.addAngle(90);

    this.animation.velocityX = ((columnTo - 5) - (this.column - 5)) / 2;
    this.animation.velocityZ = ((rowTo - 5) - (this.row - 5)) / 2;

    this.animationInitialTime = this.scene.currentTime;
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
                this.animationX = 0;
                this.animationY = 0;
                this.animationZ = 0;
                this.board.move(this.row, this.column, this.rowTo, this.columnTo);
			}
        }
        this.scene.translate(this.column - 5 + this.animationX, 0 + this.animationY, this.row - 5 + this.animationZ);
        if(this.piece != null)
            this.piece.display();
        this.scene.popMatrix();
    }
}