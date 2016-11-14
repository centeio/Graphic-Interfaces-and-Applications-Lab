/**
 * MyTexture
 * @constructor
 */
function MyTexture(scene, texture) {	
	
	this.scene = scene;
	this.texture = texture;
	this.lengthS = 1;
	this.lengthT = 1;
};

MyTexture.prototype.setLengthS = function(lengthS) {
	this.lengthS = lengthS;
} 

MyTexture.prototype.setLengthT = function(lengthT) {
	this.lengthT = lengthT;
}