function ChessBoard(scene, dU, dV, texture, su, sv, colors) {
    this.dU = dU;
    this.dV = dV;
    this.scene = scene;
	this.sU = su;
	this.sV = sv;

    this.texture = texture.texture;

    this.setColors(colors);
	    
    this.shader = new CGFshader(this.scene.gl, "shaders/test1.vert", "shaders/test1.frag");
 
	this.shader.setUniformsValues({uSampler: 1.0});
	this.shader.setUniformsValues({du: this.dU});
	this.shader.setUniformsValues({dv: this.dV});	
	this.shader.setUniformsValues({su: this.sU});
	this.shader.setUniformsValues({sv: this.sV});
	this.shader.setUniformsValues({c1: this.c1});
	this.shader.setUniformsValues({c2: this.c2});
	this.shader.setUniformsValues({cs: this.cs});

    this.plane = new Plane(scene, 1, 1, this.dU*10, this.dV*10);

    this.init();

}

ChessBoard.prototype.init = function() {
	this.appearance = new CGFappearance(this.scene);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(50);
		
}

ChessBoard.prototype.setColors = function(colors) {
		this.cs = vec4.fromValues(colors[0][0],colors[0][1],colors[0][2],colors[0][3]);
		this.c1 = vec4.fromValues(colors[1][0],colors[1][1],colors[1][2],colors[1][3]);
		this.c2 = vec4.fromValues(colors[2][0],colors[2][1],colors[2][2],colors[2][3]); 

}

ChessBoard.prototype.display = function () {

	this.appearance.apply();

	this.scene.pushMatrix();
	this.scene.scale(6,6,6);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.scene.setActiveShader(this.shader);
    this.texture.bind(0);
	this.plane.display();
	this.scene.popMatrix();
	this.scene.setActiveShader(this.scene.defaultShader);	

    this.texture.unbind(0);


}