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
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(0.4, 0.4, 0.4);
    this.sphere.display();
    this.scene.popMatrix();
}