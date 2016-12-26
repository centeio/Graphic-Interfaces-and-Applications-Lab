function XMLscene(myInterface) {
    CGFscene.call(this);
	this.interface = myInterface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

	this.camCounter = 0;
	this.currentTime = 0;

    this.initLights();
	this.enableTextures(true);
	
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);    
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.sceneTagReady = false;
	this.sceneBasicsLoaded = false;

	this.Luz1 = true;
	this.Luz2 = true;
	this.Luz3 = true;
	this.Luz4 = true;

	this.setUpdatePeriod(10);

	this.setPickEnabled(true);

};

XMLscene.prototype.initLights = function () {
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
};

XMLscene.prototype.initCameras = function () {
	this.camera = this.graph.views.get(this.graph.viewsID[this.camCounter]);
	this.interface.setActiveCamera(this.camera);
};

XMLscene.prototype.changeCamera = function() {
	this.camCounter = (this.camCounter + 1) % this.graph.viewsID.length;
	this.camera = this.graph.views.get(this.graph.viewsID[this.camCounter]);
	this.interface.setActiveCamera(this.camera);
}

XMLscene.prototype.changeMaterial = function() {
	for (var component of this.graph.components.values())
		component.changeMaterialCounter();
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
	this.lights[0].setVisible(true);
};

XMLscene.prototype.getKnotsVector = function(degree) {
	
	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}

XMLscene.prototype.makeSurface = function (degree1, degree2, controlvertexes) {
		
	var knots1 = this.getKnotsVector(degree1); 
	var knots2 = this.getKnotsVector(degree2); 

	console.log(knots1);
	console.log(knots2);
	console.log(degree1);
	console.log(degree2);
	console.log(controlvertexes);				
		
	var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes); 

	return nurbsSurface;	
}

XMLscene.prototype.logPicking = function () {
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				console.debug(obj);
				if (obj)
				{
					var customId = this.pickResults[i][1];				
					console.log("Picked object with Row: " + obj.row + " Column: " + obj.column + " id: " + customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

XMLscene.prototype.display = function () {
	this.logPicking();
	this.clearPickRegistration();	

	this.pickedId = 1;

	
	if(this.sceneTagReady && !this.sceneBasicsLoaded) {
		// ---- BEGIN Background, camera and axis setup
		this.axis = new CGFaxis(this, this.graph.axisLength);
		this.initCameras();

		this.sceneBasicsLoaded = true;
		this.interface.addLights();
		// ---- END Background, camera and axis setup

		// it is important that things depending on the proper loading of the graph
		// only get executed after the graph has loaded correctly.
		// This is one possible way to do it
	}

	if(this.sceneBasicsLoaded) {
		this.logPicking();
		this.clearPickRegistration();
		
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
			
			var matrix = mat4.create();
			mat4.identity(matrix);
		
			this.graph.components.get(this.graph.rootName).display(matrix, "null", "null");
		}
	}
};

XMLscene.prototype.update = function(currTime) {
	this.currentTime = currTime;
};

XMLscene.prototype.getPrologRequest = function(requestString, onSuccess, onError, port) {
	var requestPort = port || 8081;
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
}

XMLscene.prototype.makeRequest = function() {
	// Get Parameter Values
	var requestString = document.querySelector("#query_field").value;				
	
	// Make Request
	getPrologRequest(requestString, handleReply);
}

//Handle the Reply
XMLscene.prototype.handleReply = function(data) {
	document.querySelector("#query_result").innerHTML=data.target.response;
}