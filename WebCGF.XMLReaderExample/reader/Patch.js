function Patch(scene, dU, dV, uDiv, vDiv, controlvertexes) {
    if(dU < 1 || dU > 3){
    	console.error("u divisions invalid");
    }

    if(dV < 1 || dV > 3){
    	console.error("v divisions invalid");
    }
        
    this.scene = scene;
    this.dU = dU;
    this.dV = dV;
    this.uDiv = uDiv;
    this.vDiv = vDiv;
	this.controlvertexes = controlvertexes;

	
	this.surface = this.scene.makeSurface(this.dU, this.dV, controlvertexes);
	console.log(this.surface);

    this.init();

//    CGFnurbsObject.call(this.scene, getSurfacePoint, this.xDiv, this.yDiv);

};

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.init = function () {
  	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var tmpsurface = this.surface;

   	getSurfacePoint = function(u, v) {
		return tmpsurface.getPoint(u, v);
	};    

    this.patch = new CGFnurbsObject(this.scene, getSurfacePoint, this.uDiv, this.vDiv);

//  CGFnurbsObject.prototype.initBuffers.call(this.scene);
    this.patch.initBuffers(this.scene);
    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Patch.prototype.display = function () {
    this.patch.display();
};
