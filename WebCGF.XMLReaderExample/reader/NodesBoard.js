function NodesBoard(scene) {

    this.board = new MyPolygon(scene, 1, 8);
}

NodesBoard.prototype.display = function () {

	this.board.display();
}