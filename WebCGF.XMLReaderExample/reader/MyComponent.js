/**
 * MyComponent
 * @constructor
 */
function MyComponent(scene) {	
	
	this.scene = scene;
	this.ID = "null";
	this.transformationRef = "null";
	this.transformation = [];
	this.materialsRef = [];
	this.textureRef = "null";
	this.components = [];
	this.primitives = [];
	this.materialCounter = 0;
	this.animations = [];
	this.currentAnimation = 0;
	this.initialAnimationTime = 0;
	this.lastX = 0;
	this.lastY = 0;
	this.lastZ = 0;
	this.angle = 0;
};

MyComponent.prototype.addTransformationRef = function(transformationRef) {
	this.transformationRef = transformationRef;
}

MyComponent.prototype.addID = function(ID) {
	this.ID = ID;
}

MyComponent.prototype.changeMaterialCounter = function() {
	this.materialCounter = (this.materialCounter + 1) % this.materialsRef.length;
}  

MyComponent.prototype.addTransformation = function(transformation) {
	this.transformation = transformation;
} 

MyComponent.prototype.addMaterialRef = function(materialRef) {
	this.materialsRef.push(materialRef);
} 

MyComponent.prototype.addTextureRef = function(textureRef) {
	this.textureRef = textureRef;
} 

MyComponent.prototype.addComponent = function(component) {
	this.components.push(component);
}

MyComponent.prototype.addPrimitive = function(primitive) {
	this.primitives.push(primitive);
}

MyComponent.prototype.addAnimation = function(animation) {
	this.animations.push(animation);
}

MyComponent.prototype.display = function(oldMatrix, oldMaterial, oldTexture) {

	var matrix = mat4.create();
	if(this.transformationRef != "null") {
		mat4.multiply(matrix, oldMatrix, this.scene.graph.transformations.get(this.transformationRef));
	}
	else {
		mat4.multiply(matrix, oldMatrix, this.transformation);	
	}

	if(this.animations.length != 0) {
		if(this.initialAnimationTime == 0)
			this.initialAnimationTime = this.scene.currentTime;
		
		if(this.currentAnimation < this.animations.length) {
			
			var ret = this.scene.graph.animations.get(this.animations[this.currentAnimation]).position(this.initialAnimationTime, this.scene.currentTime, this.angle);
			var point = ret[0];
			this.angle = ret[1];

			if(point != "done") {
				this.lastX = point.x;
				this.lastY = point.y;
				this.lastZ = point.z;
				mat4.translate(matrix, matrix, [point.x, point.y, point.z]);
			}
			else {
				mat4.translate(matrix, matrix, [this.lastX, this.lastY, this.lastZ]);
				this.currentAnimation++;
				this.initialAnimationTime = 0;
			}
			mat4.rotate(matrix, matrix, Math.PI / 2 - this.angle, [0,1,0]);
		} else { 
			mat4.translate(matrix, matrix, [this.lastX, this.lastY, this.lastZ]);
			mat4.rotate(matrix, matrix, Math.PI / 2 - this.angle, [0,1,0]);
		}
	}

	var material = new CGFappearance(this.scene);
	var materialRef, textureRef;

	if(this.materialsRef[this.materialCounter] == "inherit") {
		material = this.scene.graph.materials.get(oldMaterial);
		materialRef = oldMaterial;
	}
	else {
		material = this.scene.graph.materials.get(this.materialsRef[this.materialCounter]);
		materialRef = this.materialsRef[this.materialCounter];
	}

	if(this.textureRef == "inherit")
		textureRef = oldTexture;
	else
		textureRef = this.textureRef;
	
	if(textureRef != "none")
		material.setTexture(this.scene.graph.textures.get(String(textureRef)).texture);
	else
		material.setTexture(null);

	for(var i = 0; i < this.components.length; i++) {
		this.scene.graph.components.get(this.components[i]).display(matrix, materialRef, textureRef);
	}

	this.scene.pushMatrix();
	this.scene.multMatrix(matrix);
	for(var i = 0; i < this.primitives.length; i++) {
		if((this.scene.graph.primitives.get(this.primitives[i]) instanceof MyRectangle || 
			this.scene.graph.primitives.get(this.primitives[i]) instanceof MyTriangle) &&
				textureRef != "none" && material.texture != null) {
					
					this.scene.graph.primitives.get(this.primitives[i]).updateTexCoords(
						0,
						this.scene.graph.primitives.get(this.primitives[i]).lengthH / this.scene.graph.textures.get(String(textureRef)).lengthS,
						0,
						this.scene.graph.primitives.get(this.primitives[i]).lengthV / this.scene.graph.textures.get(String(textureRef)).lengthT
					);
					material.setTextureWrap('REPEAT', 'REPEAT');
		}
		material.apply();
		this.scene.graph.primitives.get(this.primitives[i]).display();
	}
	
	this.scene.popMatrix();
}

