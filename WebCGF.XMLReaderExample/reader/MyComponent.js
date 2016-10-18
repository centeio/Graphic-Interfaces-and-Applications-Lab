/**
 * MyComponent
 * @constructor
 */
function MyComponent(scene) {	
	
	this.scene = scene;
	this.transformationRef = "null";
	this.transformation = [];
	this.materialsRef = [];
	this.textureRef = "null";
	this.components = [];
	this.primitives = [];
};

MyComponent.prototype.addTransformationRef = function(transformationRef) {
	this.transformationRef = transformationRef;
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
	/*material.setAmbient(0.4,0.4,0.4,1);
	console.log(this.scene.graph.textures.get(String("cone")));*/
	var materialRef, textureRef;

	if(this.materialsRef == "inherit") {
		//console.log("Old material: " + oldMaterial);
		//console.log(this.scene.graph.materials.get(oldMaterial));
		material = this.scene.graph.materials.get(oldMaterial);
		materialRef = oldMaterial;
		//console.log("Material: " + material);
	}
	else {
		//console.log("New Material: " + this.materialsRef[0]);
		//console.log(this.scene.graph.materials.get(this.materialsRef[0]));
		material = this.scene.graph.materials.get(this.materialsRef[0]);
		materialRef = this.materialsRef[0];
		//console.log("Material: " + material);
	}
	//material.setTextureWrap('REPEAT','REPEAT');	
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
	//console.debug("Material: " + material);
	this.scene.multMatrix(matrix);
	for(var i = 0; i < this.primitives.length; i++) {
		if((this.scene.graph.primitives.get(this.primitives[i]) instanceof MyRectangle
				|| this.scene.graph.primitives.get(this.primitives[i]) instanceof MyTriangle) &&
				textureRef != "none") {
					this.scene.graph.primitives.get(this.primitives[i]).updateTexCoords(
						0,
						1 / this.scene.graph.textures.get(String(textureRef)).lengthS,
						0,
						1 / this.scene.graph.textures.get(String(textureRef)).lengthT
					);
					material.setTextureWrap('REPEAT', 'REPEAT');
		}
		material.apply();
		this.scene.graph.primitives.get(this.primitives[i]).display();
	}
	
	this.scene.popMatrix();
}  

