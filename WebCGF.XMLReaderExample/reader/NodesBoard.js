/**
 * NodesBoard
 * @constructor
 */

function NodesBoard(scene) {
    this.scene = scene;
    this.board = new MyPolygon(scene, 1, 8);
    this.sphere = new MyRectangle(scene, -0.5, 0.5, -0.5, 0.5, 0, 1, 0, 1);
    this.texture = new CGFtexture(
				this.scene, "scenes/resources/Board2.png");
    this.quads = new Map();
    this.pos = new Map();
    this.init();
    				
}

NodesBoard.prototype.ret = function(minPosX, minPosY, maxPosX, maxPosY, delta){
	var x=minPosX, y=minPosY, id=1;
	do{
		this.quads.set(id, new MyRectangle(this.scene, x-0.2, x+0.2, y-0.2, y+0.2, 0, 1, 0, 1));
		y += delta;
		id++;
	}while (y <= maxPosY);
	return id;
}

NodesBoard.prototype.init = function(){
	this.nRet = this.ret(0.5*2, -0.5*2, 0.5*2, 0.5*2, 1);

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
    this.sphere.display();
    this.scene.popMatrix();
    for(var j=1; j<this.nRet; j++){
   	    this.scene.pushMatrix();
   	    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
		this.scene.translate(0,0,0.05);
    	this.quads.get(j).display();		
   	    this.scene.popMatrix();
    }
}