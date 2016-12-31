/**
 * NodesBoard
 * @constructor
 */
function NodesBoard(scene) {
    this.scene = scene;
    this.board = new MyPolygon(scene, 1, 8);
    this.texture = new CGFtexture(this.scene, "scenes/resources/Board2.png");
    this.quads = new Map();
	this.state = 1; // 1- Espera da peça de origem | 2- Espera da peça de destino
    this.moves = [];

    if(this.scene.firstTheme)
		this.init();
}

NodesBoard.prototype.ret = function(posX, minPosY, maxPosY, delta){
	var x=posX, y=minPosY;
	do {
		this.quads.set(this.id, new MyPositionQuad(this.scene, this, x, y, x-0.3, x+0.3, y-0.3, y+0.3, 0, 1, 0, 1));
		y += delta;
		this.id++;
	} while (y <= maxPosY);
	return this.id;
}

NodesBoard.prototype.getTile = function(row, column) {
	for(var i = 1; i <= this.quads.size; i++) {
		if(this.quads.get(i).row == row && this.quads.get(i).column == column)
			return this.quads.get(i);
	}

	return null;
}

NodesBoard.prototype.init = function(){
	this.scene.firstTheme = false;
	if(this.scene.graph.primitives.get("unit1") == undefined || this.scene.graph.primitives.get("unit2") == undefined ||
	this.scene.graph.primitives.get("node1") == undefined || this.scene.graph.primitives.get("node2") == undefined)
		console.error("Pieces declaration missing for board construction.");

	this.id = 1;
	this.ret(1*4, -1*2, 1*2, 1);
	this.ret(1*3, -1*3, 1*3, 1);
	this.ret(1*2, -1*4, 1*4, 1);
	this.ret(1*1, -1*4, 1*4, 1);
	this.ret(1*0, -1*4, 1*4, 1);
	this.ret(-1*1, -1*4, 1*4, 1);
	this.ret(-1*2, -1*4, 1*4, 1);	
	this.ret(-1*3, -1*3, 1*3, 1);			
	this.ret(-1*4, -1*2, 1*2, 1);

	var rows1 = [1,1,1,1,2,2,2,3];
	var columns = [3,4,6,7,4,5,6,5];
	var rows2 = [9,9,9,9,8,8,8,7];

	for(var i = 0; i < 8; i++) {		
		this.getTile(rows1[i], columns[i]).piece = new MyPiece(this.scene, 1, "unit1", this.scene.graph.primitives.get("unit1"));
		this.getTile(rows2[i], columns[i]).piece = new MyPiece(this.scene, 2, "unit2", this.scene.graph.primitives.get("unit2"));
	}
	
	this.getTile(1, 5).piece = new MyPiece(this.scene, 1, "node1", this.scene.graph.primitives.get("node1"));
	this.getTile(9, 5).piece = new MyPiece(this.scene, 2, "node2", this.scene.graph.primitives.get("node2"));

}

NodesBoard.prototype.displayPiece = function(pieceID) {
	var ret = false;
	for(var i = 1; i <= this.quads.size; i++) {
		if(this.quads.get(i).piece != null && this.quads.get(i).piece.name == pieceID) {
			if(this.scene.isFinished == 0 && this.scene.gameFilm == 0)
				this.scene.registerForPick(this.scene.pickedId, this.quads.get(i));

			this.quads.get(i).display();

			this.scene.pickedId++;
			ret = true;
		}
	}
	return ret;
}

NodesBoard.prototype.display = function () {
    this.scene.pushMatrix();
    this.scene.scale(5,5,5);
    this.scene.rotate(Math.PI / 8, 0, 1, 0);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.texture.bind();
	this.board.display();
    this.texture.unbind();
    this.scene.popMatrix();
    this.scene.pushMatrix();
    this.scene.translate(1,0.01,0);
    this.scene.scale(0.4, 0.4, 0.4);
    this.scene.popMatrix();    

	if(this.scene.pickMode == true) {
		for(var i = 1; i <= this.quads.size; i++) {
			if(this.quads.get(i).piece == null) {
				this.scene.pushMatrix();
				this.scene.rotate(-Math.PI / 2, 1, 0, 0);
				this.scene.translate(0,0,0.05);
				this.scene.registerForPick(this.scene.pickedId, this.quads.get(i));
				this.quads.get(i).display();		
				this.scene.popMatrix();

				this.scene.pickedId++;
			}
		}
    }

	if(this.scene.isEasy == 1 && this.scene.possibleMoves && !this.scene.pickMode) {
		for(var i = 0; i < this.scene.possibleMoves.length; i++) {
			this.scene.pushMatrix();
			this.getTile(this.scene.possibleMoves[i][0], this.scene.possibleMoves[i][1]).displayHighlighted();
			this.scene.popMatrix();
			this.scene.pickedId++;
		}
	}
	
}

NodesBoard.prototype.activateAnimation = function(rowFrom, columnFrom, rowTo, columnTo, span) {
	this.getTile(rowFrom, columnFrom).activateAnimation(rowTo, columnTo, span);
	this.scene.animationRunning = 1;
}

NodesBoard.prototype.move = function(rowFrom, columnFrom, rowTo, columnTo) {
	var piece = this.getTile(rowFrom, columnFrom).piece;
	this.getTile(rowFrom, columnFrom).piece = null;
	this.getTile(rowTo, columnTo).piece = piece;
	this.scene.animationRunning = 0;
}

NodesBoard.prototype.restartBoard = function() {
	this.quads = new Map();
	this.state = 1; // 1- Espera da peça de origem | 2- Espera da peça de destino
    this.moves = [];
	this.redo = [];
	this.init();
}

NodesBoard.prototype.restartForFilm = function() {
	this.quads = new Map();
	this.init();
}