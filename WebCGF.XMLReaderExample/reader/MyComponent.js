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
	this.components.push(primitive);
}

MyComponent.prototype.display = function(oldMatrix) {

	var matrix = mat4.create();
	if(this.transformationRef != "null") {
		mat4.multiply(matrix, oldMatrix, this.scene.graph.transformations.get(this.transformationRef));
	}
	else {
		mat4.multiply(matrix, oldMatrix, this.transformation);	
	}

	for(var i = 0; i < this.components.length; i++) {
		this.scene.graph.components.get(this.components[i]).display(matrix);
	}

	this.scene.pushMatrix();
	this.scene.multMatrix(matrix);
	for(var i = 0; i < this.primitives.length; i++)
		this.scene.graph.primitives.get(this.primitives[i]).display();
	this.scene.popMatrix();
}  

