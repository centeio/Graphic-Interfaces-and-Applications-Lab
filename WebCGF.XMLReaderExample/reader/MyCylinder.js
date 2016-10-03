/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, radius_bottom, radius_top, height, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
	this.radius_bottom = radius_bottom;
	this.radius_top = radius_top;
	this.height = height;

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
 	this.radius_dif = (this.radius_bottom - this.radius_top) / this.stacks;

 	this.vertices = [];
 	this.texCoords = [];
 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			this.vertices.push((this.radius_bottom - j * this.radius_dif) * Math.cos(i * angle), (this.radius_bottom - j * this.radius_dif) * Math.sin(i * angle), j * (this.height / this.stacks));
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
			var angle_dif = Math.atan(Math.abs(this.radius_bottom - this.radius_top) / this.height);	
			this.normals.push(Math.cos(angle_dif) * Math.cos(i * angle), Math.cos(angle_dif) * Math.sin(i * angle), Math.sin(angle_dif));
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };