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
    this.init();
    				
}

NodesBoard.prototype.ret = function(posX, minPosY, maxPosY, delta){
	var x=posX, y=minPosY;
	do{
		this.quads.set(this.id, new MyPositionQuad(this.scene, this, x, y, x-0.3, x+0.3, y-0.3, y+0.3, 0, 1, 0, 1));
		console.debug(this.quads.get(this.id));
		y += delta;
		this.id++;
	}while (y <= maxPosY);
	console.log(this.id);
	return this.id;
}

NodesBoard.prototype.getTile= function(row, column) {
	for(var j=1; j<this.id; j++){
		if(this.quads.get(j).row == row && this.quads.get(j).column == column)
			return this.quads.get(j);
	}

	return null;
}

NodesBoard.prototype.init = function(){
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

	this.invisAppearance = new CGFappearance(this.scene);
	this.invisAppearance.setAmbient(0.3,0.3,0.3,0.1);
	//this.invisAppearance.setDiffuse(0,0,0,0.1);
	//this.invisAppearance.setSpecular(0,0,0,0.1);
	//this.invisAppearance.setEmission(0,0,0,0.1);	
	//this.invisAppearance.setShininess(1);
	//this.invisAppearance.setTexture(null);
	
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
 //   this.sphere.display();
    this.scene.popMatrix();    

	if(this.scene.pickMode == true){

		for(var j=1; j<this.id; j++){
			this.scene.pushMatrix();
			this.invisAppearance.apply();
			this.scene.rotate(-Math.PI / 2, 1, 0, 0);
			this.scene.translate(0,0,0.05);
			this.scene.registerForPick(this.scene.pickedId, this.quads.get(j));
			this.quads.get(j).display();		
			this.scene.popMatrix();

			this.scene.pickedId++;
		}

    }    
}