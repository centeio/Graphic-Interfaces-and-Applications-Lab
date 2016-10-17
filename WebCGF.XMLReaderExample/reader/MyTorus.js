/**
 * MyTorus
 * @constructor
 */
 function MyTorus(scene, inner, outer, slices, loops) {
 	CGFobject.call(this,scene);
	
	this.inner = inner;
	this.outer = outer;
	this.slices = slices;
	this.loops = loops;

 	this.initBuffers();
 };

 MyTorus.prototype = Object.create(CGFobject.prototype);
 MyTorus.prototype.constructor = MyTorus;

 MyTorus.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/
 	var u = 2 * Math.PI / this.loops;
 	var v = 2 * Math.PI / this.slices;

 	this.vertices = [];
 	this.texCoords = [];
 	for(var j = 0; j <= this.loops; j++){
		for (var i = 0; i < this.slices; i++) {
			this.vertices.push((this.outer + this.inner * Math.cos(i * v)) * Math.cos(j * u),
				(this.outer + this.inner * Math.cos(i * v)) * Math.sin(j * u), 
				this.inner * Math.sin(i * v));
			this.texCoords.push(i/this.slices, j/this.loops);
		}
	}

 	this.indices = [];
	for(var j = 0; j < this.loops; j++){
		for (var i = 0; i < this.slices; i++) {
		 	var tmp = i + j*this.slices;
		 	if(i != (this.slices - 1)){
 				this.indices.push(tmp, this.slices + tmp, tmp + 1);
 				this.indices.push(this.slices + tmp, this.slices + tmp + 1, tmp + 1);
 			}
 			else{
 				this.indices.push(tmp, this.slices + tmp, j * this.slices);
 				this.indices.push(this.slices + tmp, (j+1) * this.slices, j * this.slices);
 			}
		}
	}

 	this.normals = [];
 	for(var j = 0; j <= this.loops; j++){
		for (var i = 0; i < this.slices; i++) {
			this.normals.push(Math.cos(j * u) * Math.cos(i * v),
				Math.sin(j * u) * Math.cos(i * v),
				Math.sin(i * v));		
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };