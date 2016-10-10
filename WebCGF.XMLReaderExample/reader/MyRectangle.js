/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyRectangle(scene, minX, maxX, minY, maxY, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);

	this.materialDefault = new CGFappearance(this);
	
	this.minX = minX || -0.5;
	this.minY = minY || -0.5;
	this.maxX = maxX || 0.5;
	this.maxY = maxY || 0.5;

	this.minS = minS || 0;
	this.maxS = maxS || 1;
	this.minT = minT || 0;
	this.maxT = maxT || 1;

	this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.minX, this.minY, 0,
            this.maxX, this.minY, 0,
            this.minX, this.maxY, 0,
            this.maxX, this.maxY, 0
			];

	this.indices = [
            0, 1, 2, 
			3, 2, 1
        ];

    this.normals = [
    0,0,1,
    0,0,1,
    0,0,1,
    0,0,1
    ];

    this.texCoords = [
    	this.minS, this.maxT,
    	this.maxS, this.maxT,
    	this.minS, this.minT,
   		this.maxS, this.minT  
    ];
	
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
