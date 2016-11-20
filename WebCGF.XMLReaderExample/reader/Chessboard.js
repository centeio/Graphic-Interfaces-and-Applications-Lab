function ChessBoard(scene, dU, dV) {
    this.dU = dU;
    this.dV = dV;
    this.scene = scene;
    this.su;
    this.sv;

    this.texture = new CGFtexture(scene, "scenes/resources/spaceship.png");
    this.shader = new CGFshader(this.scene.gl, "shaders/test1.vert", "shaders/test1.frag");
    this.plane = new Plane(scene, 1, 1, dU, dV);

}

ChessBoard.prototype.display = function () {
	this.shader.setUniformsValues({uSampler2: 1});
	

//	this.appearance.apply();

	this.setActiveShader(this.shader);
	this.pushMatrix();

    this.texture.bind(1);
	this.plane.display();
	this.popMatrix();
	this.setActiveShader(this.defaultShader);	

}