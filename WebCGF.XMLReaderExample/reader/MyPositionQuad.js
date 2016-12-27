function MyPositionQuad(scene, board, x, y, minPosX, maxPosX, minPosY, maxPosY){
    this.scene = scene;
    this.board = board;
    this.column = x + 5;
    this.row = -y + 5;
    this.piece = null;
    this.quad = new MyRectangle(scene, minPosX, maxPosX, minPosY, maxPosY, 0, 1, 0, 1);
    this.pressed = 0;
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

MyPositionQuad.prototype.display = function () {
    if(this.piece == null)
        this.quad.display();
    else {
        this.scene.pushMatrix();
        this.scene.translate(this.column - 5, 0, this.row - 5);
        this.piece.display();
        this.scene.popMatrix();
    }
}