/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, radius_base, radius_top, height, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.radius_base = radius_base;
	this.radius_top = radius_top;
	this.height = height;

	this.top = new MyPolygon(scene, radius_top, slices);
	this.base = new MyPolygon(scene, radius_base, slices);

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/
 	var angle = 2*Math.PI/this.slices;
 	this.radius_dif = (this.radius_base - this.radius_top) / this.stacks;

 	this.vertices = [];
 	this.texCoords = [];
 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			this.vertices.push((this.radius_base - j * this.radius_dif) * Math.cos(i * angle), (this.radius_base - j * this.radius_dif) * Math.sin(i * angle), j * (this.height / this.stacks));
			this.texCoords.push(i/this.slices, j/this.stacks);
		}
	}

 	this.indices = [];
	for(var j = 0; j < this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
		 	var tmp = i + j*this.slices;
		 	if(i != this.slices-1){
 				this.indices.push(tmp, tmp + 1, tmp + this.slices);
 				this.indices.push(tmp + this.slices + 1, tmp + this.slices, tmp + 1);
 			}
 			else{
 				this.indices.push(tmp, j * this.slices, tmp + this.slices);
 				this.indices.push((j+1) * this.slices, tmp + this.slices, j * this.slices);
 			}
		}
	}

 	this.normals = [];
 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			var angle_dif = Math.atan(Math.abs(this.radius_base - this.radius_top) / this.height);	
			this.normals.push(Math.cos(angle_dif) * Math.cos(i * angle), Math.cos(angle_dif) * Math.sin(i * angle), Math.sin(angle_dif));
		}
	}

	/*this.vertices.push(0,0,0);
	this.vertices.push(0,0,this.height);

	for(var i = this.slices; i > 0; i--) {
		this.indices.push((this.vertices.length / 3) - 3, this.stacks * this.slices - i, this.stacks * this.slices - i + 1);
	}*/

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 MyCylinder.prototype.display = function() {
 	this.drawElements(this.primitiveType);

 	//Base and Top
 	this.scene.pushMatrix();
 	this.scene.rotate(Math.PI, 1, 0, 0);
 	this.base.display();
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
	this.scene.translate(0,0,this.height);
	this.top.display();
	this.scene.popMatrix();
 }