
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

	this.camCounter = 0;

    this.initLights();
	this.enableTextures(true);
	
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
	this.sceneTagReady = false;
	this.sceneBasicsLoaded = false;

};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
	//this.camera = this.graph.views.get(this.graph.viewsID[this.camCounter]);
	this.updateProjectionMatrix();
};

XMLscene.prototype.changeCamera = function() {
	this.camCounter = (this.camCounter + 1) % this.graph.viewsID.length;
	this.camera = this.graph.views.get(this.graph.viewsID[this.camCounter]);
	console.log("Changing Camera.");
}

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.gl.clearColor(0,0,0,1);
	//this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    //this.lights[0].enable();
};

XMLscene.prototype.display = function () {
	if(this.sceneTagReady && !this.sceneBasicsLoaded) {
		// ---- BEGIN Background, camera and axis setup
		this.axis = new CGFaxis(this, this.graph.axisLength);
		this.camCounter = this.graph.viewDefaultID;
		this.initCameras();
		
		console.log("Initializing scene.");
		this.sceneBasicsLoaded = true;
		// ---- END Background, camera and axis setup

		// it is important that things depending on the proper loading of the graph
		// only get executed after the graph has loaded correctly.
		// This is one possible way to do it
	}

	if(this.sceneBasicsLoaded) {
		console.log("Scene display!");
		//console.log(this.camera);
		// Clear image and depth buffer everytime we update the scene
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		// Initialize Model-View matrix as identity (no transformation
		//console.log(this.camera);
		this.updateProjectionMatrix();
		this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		// Draw axis
		this.axis.display();

		this.setDefaultAppearance();

		if (this.graph.loadedOk) {	
			for(var i = 0; i < this.lights.length; i++)
				this.lights[i].update();
				
			/*for(var [key, value] of this.graph.views.entries()) {
				console.log(key + " near: " + value.near + " far: " + value.far + " angle: " + value.angle + " from ["
					+ value.fromX + "," + value.fromY + "," + value.fromZ + "] to [" + value.toX + "," + value.toY + ","
					+ value.toZ + "]");		
			}*/
			
			var matrix = mat4.create();
			mat4.identity(matrix);

			//console.log("cam counter: " + this.camCounter);
			//console.log("cam :" + this.graph.views.get(this.graph.viewsID[this.camCounter]));
		
			this.graph.components.get(this.graph.rootName).display(matrix, "null", "null");
		}
	}	
};