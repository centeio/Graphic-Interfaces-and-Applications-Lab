function ChessBoard(scene, dU, dV) {
    this.dU = dU;
    this.dV = dV;
    this.scene = scene;
    this.su;
    this.sv;

    this.texture = new CGFtexture(scene, "scenes/resources/wood.jpg");
	    
    console.log(this.texture);
    this.shader = new CGFshader(this.scene.gl, "shaders/test1.vert", "shaders/test1.frag");

	this.sU = 3.0;
	this.sV = 3.0;

	this.cs = vec4.fromValues(1.0,0.0,0.0,1.0);
	this.c1 = vec4.fromValues(0.0,0.0,1.0,1.0);
	this.c2 = vec4.fromValues(0.0,1.0,1.0,1.0);    

	this.shader.setUniformsValues({uSampler: 1.0});
	this.shader.setUniformsValues({du: this.dU});
	this.shader.setUniformsValues({dv: this.dV});	
	this.shader.setUniformsValues({su: this.sU});
	this.shader.setUniformsValues({sv: this.sV});
	this.shader.setUniformsValues({c1: this.c1});
	this.shader.setUniformsValues({c2: this.c2});
	this.shader.setUniformsValues({cs: this.cs});

    this.plane = new Plane(scene, 1, 1, 8*8, 8*8);

    this.init();

}

ChessBoard.prototype.init = function() {
	this.appearance = new CGFappearance(this.scene);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(50);
		
	
//	this.texture = new CGFtexture(scene, "scenes/resources/wood.jpg");
//	this.appearance.setTexture(this.texture);
}

ChessBoard.prototype.display = function () {

	this.appearance.apply();

	this.scene.pushMatrix();
	this.scene.setActiveShader(this.shader);
    this.texture.bind(0);
	this.plane.display();
	this.scene.popMatrix();
	this.scene.setActiveShader(this.scene.defaultShader);	

    this.texture.unbind(0);


}