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

MyComponent.prototype.display = function(oldMatrix, oldMaterial, oldTexture) {

	var matrix = mat4.create();
	if(this.transformationRef != "null") {
		mat4.multiply(matrix, oldMatrix, this.scene.graph.transformations.get(this.transformationRef));
	}
	else {
		mat4.multiply(matrix, oldMatrix, this.transformation);	
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

	for(var i = 0; i < this.components.length; i++) {
		this.scene.graph.components.get(this.components[i]).display(matrix, materialRef, textureRef);
	}

	this.scene.pushMatrix();
	this.scene.multMatrix(matrix);
	for(var i = 0; i < this.primitives.length; i++) {
		if((this.scene.graph.primitives.get(this.primitives[i]) instanceof MyRectangle) &&
				textureRef != "none" && material.texture != null) {
					
					var lengthH = this.scene.graph.primitives.get(this.primitives[i]).maxX
						- this.scene.graph.primitives.get(this.primitives[i]).minX;
					var lengthV = this.scene.graph.primitives.get(this.primitives[i]).maxY
						- this.scene.graph.primitives.get(this.primitives[i]).minY; 
					
					this.scene.graph.primitives.get(this.primitives[i]).updateTexCoords(
						0,
						lengthH / this.scene.graph.textures.get(String(textureRef)).lengthS,
						0,
						lengthV / this.scene.graph.textures.get(String(textureRef)).lengthT
					);
					material.setTextureWrap('REPEAT', 'REPEAT');
		}

		if((this.scene.graph.primitives.get(this.primitives[i]) instanceof MyTriangle) &&
				textureRef != "none" && material.texture != null) {
					
					var lengthH = Math.max(this.scene.graph.primitives.get(this.primitives[i]).x1,
						this.scene.graph.primitives.get(this.primitives[i]).x2,
						this.scene.graph.primitives.get(this.primitives[i]).x3)
						-
						Math.min(this.scene.graph.primitives.get(this.primitives[i]).x1,
						this.scene.graph.primitives.get(this.primitives[i]).x2,
						this.scene.graph.primitives.get(this.primitives[i]).x3);
					var lengthV = Math.max(this.scene.graph.primitives.get(this.primitives[i]).y1,
						this.scene.graph.primitives.get(this.primitives[i]).y2,
						this.scene.graph.primitives.get(this.primitives[i]).y3)
						-
						Math.min(this.scene.graph.primitives.get(this.primitives[i]).y1,
						this.scene.graph.primitives.get(this.primitives[i]).y2,
						this.scene.graph.primitives.get(this.primitives[i]).y3);
					
					this.scene.graph.primitives.get(this.primitives[i]).updateTexCoords(
						0,
						lengthH / this.scene.graph.textures.get(String(textureRef)).lengthS,
						0,
						lengthV / this.scene.graph.textures.get(String(textureRef)).lengthT
					);
					material.setTextureWrap('REPEAT', 'REPEAT');
		}
		material.apply();
		this.scene.graph.primitives.get(this.primitives[i]).display();
	}
	
	this.scene.popMatrix();
}  

