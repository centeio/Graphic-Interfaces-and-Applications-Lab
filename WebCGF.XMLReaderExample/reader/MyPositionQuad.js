function MyPositionQuad(scene, board, x, y, minPosX, maxPosX, minPosY, maxPosY){
    this.scene = scene;
    this.board = board;
    this.column = x + 5;
    this.row = -y + 5;
    this.piece = null;
    this.quad = new MyRectangle(scene, minPosX, maxPosX, minPosY, maxPosY, 0, 1, 0, 1);

}

MyPositionQuad.prototype.getPiece = function () {
    return this.piece;
}

MyPositionQuad.prototype.setPiece = function (piece) {
    this.piece = piece;
}

MyPositionQuad.prototype.display = function () {
    this.quad.display();
}