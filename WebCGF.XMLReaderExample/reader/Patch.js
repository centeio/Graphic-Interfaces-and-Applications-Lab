function Patch(scene, dU, dV, uDiv, vDiv) {
    if(dU < 1 || dU > 3){
    	console.error("u divisions invalid");
    }

    if(dV < 1 || dV > 3){
    	console.error("v divisions invalid");
    }
        
    this.scene = scene;
    this.dU = dU -1;
    this.dV = dV -1;
    this.uDiv = uDiv;
    this.vDiv = vDiv;
//	this.controlvertexes = controlvertexes;

	var cv =       [	// U = 0
						[ // V = 0..1;
							 [ -1.5, -1.5, 0.0, 1 ],
							 [ -1.5,  1.5, 0.0, 1 ]
							
						],
						// U = 1
						[ // V = 0..1
							 [ 0, -1.5, 3.0, 1 ],
							 [ 0,  1.5, 3.0, 1 ]							 
						],
						// U = 2
						[ // V = 0..1							 
							[ 1.5, -1.5, 0.0, 1 ],
							[ 1.5,  1.5, 0.0, 1 ]
						]
					];
	
	this.surface = this.scene.makeSurface(this.dU, this.dV, cv);
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
