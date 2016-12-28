/**
 * MyInterface
 * @constructor
 */
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 

	this.gui.add(this.scene, 'PlayerVSPlayer');
	this.gui.add(this.scene, 'PlayerVSPC');
	this.gui.add(this.scene, 'Play');

	// add a group of controls (and open/expand by defult)
	
	this.omni = this.gui.addFolder("Omni Ligths");

	this.spot = this.gui.addFolder("Spot Ligths");

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;
	
	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.speed=3;
	// min and max values can be specified as parameters
	//this.gui.add(this.scene, 'currDroneAppearance', this.scene.droneAppearanceList);

	return true;
};

MyInterface.prototype.addLights = function() {

	for(var i = 0; i < this.scene.graph.lights.length; i++) {
		if(this.scene.graph.lights[i][0] == "omni")
			this.omni.add(this.scene.lights[i], "enabled").name(this.scene.graph.lights[i][1]);
		else
			this.spot.add(this.scene.lights[i], "enabled").name(this.scene.graph.lights[i][1]);
	}
	
};

/**
 * processKeyDown
 * @param event {Event}
 */
MyInterface.prototype.processKeyDown = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyDown.call(this,event);
	
	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars
	
	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	var char = String.fromCharCode(event.keyCode);
	switch (char)
	{
		case('V'):
		case('v'):
			if (this.scene.graph.loadedOk)
				this.scene.changeCamera();
			break;
		case('M'):
		case('m'):
			if (this.scene.graph.loadedOk)
				this.scene.changeMaterial();
			break;
	}
};

/**
 * processKeyUp
 * @param event {Event}
 */
MyInterface.prototype.processKeyUp = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyUp.call(this,event);
};