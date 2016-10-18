/**
 * MyObject
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTriangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3, minS, maxS, minT, maxT) {
	CGFobject.call(this,scene);

	this.materialDefault = new CGFappearance(this);
	
	this.x1 = x1 || 0;
	this.y1 = y1 || 0;
	this.z1 = z1 || 0;
	this.x2 = x2 || 1;
	this.y2 = y2 || 0;
	this.z2 = z2 || 0;
	this.x3 = x3 || 0;
	this.y3 = y3 || 1;
	this.z3 = z3 || 0;

	this.minS = minS || 0;
	this.maxS = maxS || 1;
	this.minT = minT || 0;
	this.maxT = maxT || 1;

	this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers = function () {
	this.vertices = [
		this.x1, this.y1, this.z1,
		this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3
	];

	this.indices = [
            0, 1, 2
        ];

    this.normals = [
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
		
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

MyTriangle.prototype.updateTexCoords = function (minS, maxS, minT, maxT) {

	this.minS = minS;
	this.maxS = maxS;
	this.minT = minT;
	this.maxT = maxT;
	
    this.texCoords = [
    	this.minS, this.maxT,
    	this.maxS, this.maxT,
    	this.minS, this.minT,
   		this.maxS, this.minT  
    ];
	
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};