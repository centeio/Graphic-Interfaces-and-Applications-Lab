/**
 * MyCylinder
 * @constructor
 */
 function MyCylinder(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

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
 	var ang = 2*Math.PI/this.slices;

 	this.vertices = [];
 	this.texCoords = [];
 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			var height = (1/this.stacks);
			this.vertices.push(Math.cos(i*ang),Math.sin(i*ang),j*height);
			this.texCoords.push(i/this.slices, j/this.stacks);
		}
	}
		
	/*this.indices = [0, 1, 8,
					9, 8, 1];*/

 	this.indices = [];
	for(var j = 0; j < this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
		 	var tmp = i + j*this.slices;
		 	if(i != this.slices-1){
 				this.indices.push(tmp,tmp+1, tmp+this.slices);
 				this.indices.push(tmp+this.slices+1,tmp+this.slices,tmp+1);
 			}
 			else{
 				this.indices.push(tmp,j*this.slices, tmp+this.slices);
 				this.indices.push((j+1)*this.slices,tmp+this.slices,j*this.slices);
 			}
		}
	}

 	this.normals = [];
 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			this.normals.push(Math.cos(i*ang), Math.sin(i*ang), 0);
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };