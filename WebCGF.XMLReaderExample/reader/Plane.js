function Plane(scene, dX, dY, xDiv, yDiv) {
    this.scene = scene;
    this.xDim = dX;
    this.yDim = dY;
    this.xDivs = xDiv;
    this.yDivs = yDiv;

    var controlvertexes = [];
    var x = [];
    var y = [];

    x.push([-dX/2,-dY/2,0,1]);
    x.push([-dX/2,dY/2,0,1]);
    y.push([dX/2,-dY/2,0,1]);
    y.push([dX/2,dY/2,0,1]);   
    controlvertexes.push(x);
    controlvertexes.push(y);     

	this.surface = this.scene.makeSurface(1, 1, controlvertexes);
	console.log(this.surface);

    this.init();


};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.init = function () {
  	this.vertices = [];
	this.indices = [];
	this.normals = [];
	this.texCoords = [];

	var tmpsurface = this.surface;

   	getSurfacePoint = function(u, v) {
		return tmpsurface.getPoint(u, v);
	};    

    this.plane = new CGFnurbsObject(this.scene, getSurfacePoint, this.xDivs, this.yDivs);

//  CGFnurbsObject.prototype.initBuffers.call(this.scene);
    this.plane.initBuffers(this.scene);
    this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Plane.prototype.display = function () {
    this.plane.display();
};


