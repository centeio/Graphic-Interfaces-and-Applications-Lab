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
 	
	var angle = 2 * Math.PI / this.slices;
	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];
	this.radius_dif = Math.abs(this.radius_bottom - this.radius_top) / this.stacks;

	/*for(j = 0; j < this.stacks; j++){
		for( i = 0; i < this.slices; i++ ){
			
			this.vertices.push((this.radius_bottom - j * this.radius_dif) * Math.cos(i * angle), (this.radius_bottom - j * this.radius_dif) * Math.sin(i * angle), j * (1 / this.stacks));
			
			//this.angle_dif = Math.atan(Math.abs(this.radius_bottom - this.radius_top) / this.height);	
			//this.normals.push(Math.cos(this.angle_dif) * Math.cos(i * angle), Math.cos(this.angle_dif) * Math.sin(i * angle), Math.sin(this.angle_dif));			
		
	 		 /*var tmp = i + j * this.slices;
			 if(i != this.slices - 1){
	 			this.indices.push(tmp, tmp + 1, tmp + this.slices);
	 			this.indices.push(tmp + this.slices + 1, tmp + this.slices, tmp + 1);
	 		}
	 		else{
	 			this.indices.push(tmp, j * this.slices, tmp + this.slices);
	 			this.indices.push((j+1) * this.slices, tmp + this.slices, j * this.slices);
	 		}*/

			/*this.texCoords.push(i / this.slices, j / this.stacks);
		}
	}

	for(var j = 0; j < this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
		 	/*var tmp = i + j*this.slices;
		 	if(i != this.slices-1){
 				this.indices.push(tmp,tmp+1, tmp+this.slices);
 				this.indices.push(tmp+this.slices+1,tmp+this.slices,tmp+1);
 			}
 			else{
 				this.indices.push(tmp,j*this.slices, tmp+this.slices);
 				this.indices.push((j+1)*this.slices,tmp+this.slices,j*this.slices);
 			}*/
	//}

	/*for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			this.angle_dif = Math.atan(Math.abs(this.radius_bottom - this.radius_top) / this.height);	
			this.normals.push(Math.cos(this.angle_dif) * Math.cos(i * angle), Math.cos(this.angle_dif) * Math.sin(i * angle), Math.sin(this.angle_dif));
		}
	}*/

 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			var height = (1/this.stacks);
			this.vertices.push(Math.cos(i*angle),Math.sin(i*angle),j*height);
			this.texCoords.push(i/this.slices, j/this.stacks);
		}
	}
		
	/*this.indices = [0, 1, 8,
					9, 8, 1];*/
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

 	for(var j = 0; j <= this.stacks; j++){
		for (var i = 0; i < this.slices; i++) {
			this.normals.push(Math.cos(i*angle), Math.sin(i*angle), 0);
		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
