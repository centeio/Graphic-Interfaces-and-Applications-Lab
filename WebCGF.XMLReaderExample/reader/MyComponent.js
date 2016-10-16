/**
 * MyComponent
 * @constructor
 */
function MyComponent(id) {	
	
	this.id = id;
	this.transformationRef = "null";
	this.transformation = [];
	this.materialRef = "null";
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
	this.materialRef = materialRef;
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

