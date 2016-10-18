
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;

	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/'+filename, this);  
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseGlobalsExample(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

// Converts degrees to radians
MySceneGraph.prototype.getRadiansAngle = function(angle){
	return Math.PI*angle/180;
}

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */

MySceneGraph.prototype.parseViews = function(rootElement) {
	var rootViews = rootElement.getElementsByTagName('views');
	if(rootViews[0].children.length == 0)
		console.error("Views are missing.");

	else{

	this.viewsID = [];	

	this.views = new Map();
	var nperspectives = rootViews[0].children.length;


	for(var i = 0; i < nperspectives; i++) {
		var element = rootViews[0].children[i];
		var bool;
		var defaultID = -1;
		console.log("Read list item " + element);
		var npositions = rootViews[0].children[i].children.length;

		for(var j = 0; j < npositions; j++) {
			var innerElement = element.children[j];

			switch(innerElement.tagName) {
				case "from":
					var x1 = this.reader.getFloat(innerElement, "x", bool);
					var y1 = this.reader.getFloat(innerElement, "y", bool);
					var z1 = this.reader.getFloat(innerElement, "z", bool);
					break;
				case "to":
					var x2 = this.reader.getFloat(innerElement, "x", bool);
					var y2 = this.reader.getFloat(innerElement, "y", bool);
					var z2 = this.reader.getFloat(innerElement, "z", bool);
					break;
				default:
					break;
			}
		}
		if(this.reader.getString(element, "id", bool) == "default")
			defaultID = viewsID.length;
			
		this.viewsID.push(this.reader.getString(element, "id", bool));
		this.views.set(this.reader.getString(element, "id", bool),
		new CGFcamera(this.getRadiansAngle(this.reader.getString(element, "angle", bool)),
			this.reader.getString(element, "near", bool),
			this.reader.getString(element, "far", bool),
			vec3.fromValues(x1, y1, z1), 
			vec3.fromValues(x2, y2, z2)));
	}
	if(-1 == defaultID)
		console.error("Default view missing not declared");
	}
}

MySceneGraph.prototype.parseLights = function(rootElement) {
	var rootLights = rootElement.getElementsByTagName('lights');
	var nLights = rootLights[0].children.length;

	if(nLights > 8)
		return "WebGL only supports 8 lights."

	var bool;

	for(var i = 0; i < nLights; i++) {
		var child = rootLights[0].children[i];

		switch(child.tagName) {
			case "omni":
				var location = child.getElementsByTagName('location')[0];
				var ambient = child.getElementsByTagName('ambient')[0];
				var diffuse = child.getElementsByTagName('diffuse')[0];
				var specular = child.getElementsByTagName('specular')[0];

				this.scene.lights[i].setPosition(
					this.reader.getFloat(location, "x", bool),
					this.reader.getFloat(location, "y", bool),
					this.reader.getFloat(location, "z", bool),
					this.reader.getFloat(location, "w", bool));
				this.scene.lights[i].setAmbient(
					this.reader.getFloat(ambient, "r", bool),
					this.reader.getFloat(ambient, "g", bool),
					this.reader.getFloat(ambient, "b", bool),
					this.reader.getFloat(ambient, "a", bool));
				this.scene.lights[i].setDiffuse(
					this.reader.getFloat(diffuse, "r", bool),
					this.reader.getFloat(diffuse, "g", bool),
					this.reader.getFloat(diffuse, "b", bool),
					this.reader.getFloat(diffuse, "a", bool));
				this.scene.lights[i].setSpecular(
					this.reader.getFloat(specular, "r", bool),
					this.reader.getFloat(specular, "g", bool),
					this.reader.getFloat(specular, "b", bool),
					this.reader.getFloat(specular, "a", bool));

				this.scene.lights[i].setVisible(true);
				if(this.reader.getBoolean(child, "enabled", bool)) {
					//console.log("Light " + i + " On.");
					this.scene.lights[i].enable();
				}
				else {
					//console.log("Light " + i + " Off.");
					this.scene.lights[i].disable();
				}
				break;

			case "spot":
				var target = child.getElementsByTagName('target')[0];
				var location = child.getElementsByTagName('location')[0];
				var ambient = child.getElementsByTagName('ambient')[0];
				var diffuse = child.getElementsByTagName('diffuse')[0];
				var specular = child.getElementsByTagName('specular')[0];

				this.scene.lights[i].setPosition(
					this.reader.getFloat(location, "x", bool),
					this.reader.getFloat(location, "y", bool),
					this.reader.getFloat(location, "z", bool),
					1);

				this.scene.lights[i].setAmbient(
					this.reader.getFloat(ambient, "r", bool),
					this.reader.getFloat(ambient, "g", bool),
					this.reader.getFloat(ambient, "b", bool),
					this.reader.getFloat(ambient, "a", bool));

				this.scene.lights[i].setDiffuse(
					this.reader.getFloat(diffuse, "r", bool),
					this.reader.getFloat(diffuse, "g", bool),
					this.reader.getFloat(diffuse, "b", bool),
					this.reader.getFloat(diffuse, "a", bool));

				this.scene.lights[i].setSpecular(
					this.reader.getFloat(specular, "r", bool),
					this.reader.getFloat(specular, "g", bool),
					this.reader.getFloat(specular, "b", bool),
					this.reader.getFloat(specular, "a", bool));

				this.scene.lights[i].setSpotCutOff(this.getRadiansAngle(this.reader.getFloat(child, "angle", bool)));
				this.scene.lights[i].setSpotDirection(
					(this.reader.getFloat(target, "x", bool) - this.reader.getFloat(location, "x", bool)),
					(this.reader.getFloat(target, "y", bool) - this.reader.getFloat(location, "y", bool)),
					(this.reader.getFloat(target, "z", bool) - this.reader.getFloat(location, "z", bool)));
				this.scene.lights[i].setSpotExponent(this.reader.getFloat(child, "exponent", bool));
				
				this.scene.lights[i].setVisible(true);
				if(this.reader.getBoolean(child, "enabled", bool))
					this.scene.lights[i].enable();
				else 
					this.scene.lights[i].disable();
				break;
			default:
				break;
		}
	}
}

MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var rootPrimitives =  rootElement.getElementsByTagName('primitives');
	if (rootPrimitives[0].children.length == 0)
		return "Primitives are missing."

	this.primitives = new Map();
	nnodes = rootPrimitives[0].children.length;
	var bool;

	console.log("Parsing Primitives");

	for (var i=0; i < nnodes; i++)
	{
		var element = rootPrimitives[0].children[i].children[0];
		console.log("Read list item " + element);

		switch(element.tagName) {
			case "rectangle":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyRectangle(this.scene, 
						this.reader.getFloat(element, "x1", bool),
						this.reader.getFloat(element, "x2", bool),
						this.reader.getFloat(element, "y1", bool),
						this.reader.getFloat(element, "y2", bool)));
				break;
			case "triangle":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyTriangle(this.scene,
						this.reader.getFloat(element, "x1", bool),
						this.reader.getFloat(element, "y1", bool),
						this.reader.getFloat(element, "z1", bool),
						this.reader.getFloat(element, "x2", bool),
						this.reader.getFloat(element, "y2", bool),
						this.reader.getFloat(element, "z2", bool),
						this.reader.getFloat(element, "x3", bool),
						this.reader.getFloat(element, "y3", bool),
						this.reader.getFloat(element, "z3", bool)));
				break;
			case "cylinder":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyCylinder(this.scene,
						this.reader.getFloat(element, "base", bool),
						this.reader.getFloat(element, "top", bool),
						this.reader.getFloat(element, "height", bool), 
						this.reader.getFloat(element, "slices", bool),
						this.reader.getFloat(element, "stacks", bool)));
				break;
			case "sphere":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MySphere(this.scene,
						this.reader.getFloat(element, "radius", bool),
						this.reader.getFloat(element, "slices", bool),
						this.reader.getFloat(element, "stacks", bool)));
				break;
			case "torus":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyTorus(this.scene,
						this.reader.getFloat(element, "inner", bool),
						this.reader.getFloat(element, "outer", bool),
						this.reader.getFloat(element, "slices", bool),
						this.reader.getFloat(element, "loops", bool)));
				break;
			default:
				break;
		}
	}	
}

MySceneGraph.prototype.parseComponents = function(rootElement) {
	var rootComponents = rootElement.getElementsByTagName('components');
	if(rootComponents[0].children.length == 0)
		return "Components are missing."
	//console.debug(rootComponents[0]);

	this.components = new Map();
	var ncomponents = rootComponents[0].children.length;

	for(var i = 0; i < ncomponents; i++) {
		var component = rootComponents[0].children[i];
		var bool;
		//console.debug(component);

		var id = this.reader.getString(component, "id", bool);
		this.components.set(id, new MyComponent(this.scene));
		//console.log("Component ID: " + id);

		/* Transformation ---------------------- */
		var transformation = component.getElementsByTagName('transformation')[0];
		//console.debug(transformation);

		if(transformation.getElementsByTagName('transformationref')[0] != undefined) {
			//console.debug(transformation.getElementsByTagName('transformationref')[0]);
			/*console.log("Transformationref: " + 
				this.reader.getString(transformation.getElementsByTagName('transformationref')[0],
				"id", bool));*/
			this.components.get(id).addTransformationRef(
				this.reader.getString(
					transformation.getElementsByTagName('transformationref')[0],
					"id", 
					bool));
		}
		else {
			var matrix = mat4.create();
			mat4.identity(matrix);

			var nTransformations = transformation.children.length;
			for(var j = 0; j < nTransformations ; j++) {
				var t = transformation.children[j];

				switch(t.tagName) {
					case 'translate':
						mat4.translate(matrix, matrix,[this.reader.getFloat(t,"x",bool), this.reader.getFloat(t,"y",bool), this.reader.getFloat(t,"z",bool)]);
						break;
					case 'rotate':
						var rotationAxis;
						//console.log("axis " + this.reader.getString(t,"axis",bool));
						switch(this.reader.getString(t,"axis",bool)) {
							case "x":
								rotationAxis = [1,0,0];
								//console.log("angle " + this.reader.getFloat(t,"angle",bool));
								break;
							case "y":
								rotationAxis = [0,1,0];
								break;
							case "z":
								rotationAxis = [0,0,1];
								break;
							default:
								break;
						}
						mat4.rotate(matrix,matrix,this.getRadiansAngle(this.reader.getFloat(t,"angle",bool)),rotationAxis);
						break;
					case 'scale':
						mat4.scale(matrix, matrix,[this.reader.getFloat(t,"x",bool), this.reader.getFloat(t,"y",bool), this.reader.getFloat(t,"z",bool)]);
						break;
					default:
						break;
				}
			}
			//console.log(matrix);
			this.components.get(id).addTransformation(matrix);
		} 
		/* ------------------------------------- */

		/* Materials --------------------------- */
		var materials = component.getElementsByTagName('materials')[0];
		var nMaterials = materials.children.length;
		//console.log("Materials.");
		for(var j = 0; j < nMaterials; j++) {
			//console.log("Id " + j + ": " + this.reader.getString(materials.children[j], "id", bool));
			this.components.get(id).addMaterialRef(
				this.reader.getString(materials.children[j], "id", bool));
		}
		/* ------------------------------------- */

		/* Texture ----------------------------- */
		var texture = component.getElementsByTagName('texture')[0];
		//console.log("Texture ID: " + this.reader.getString(texture, "id", bool));
		this.components.get(id).addTextureRef(
			this.reader.getString(texture, "id", bool));
		/* ------------------------------------- */

		/* Children ---------------------------- */ 
		var componentChildren = component.getElementsByTagName('children')[0];
		var nChildren = componentChildren.children.length;
		//console.debug(componentChildren);
		for(var j = 0; j < nChildren; j++) {
			var c = componentChildren.children[j];
			//console.debug(c);
			switch(c.tagName) {
				case 'componentref':
					//console.log("Child Component ID: " + this.reader.getString(c, "id", bool));
					this.components.get(id).addComponent(
						this.reader.getString(c, "id", bool));
					break;
				case 'primitiveref':
					//console.log("Child Primitive ID: " + this.reader.getString(c, "id", bool));
					this.components.get(id).addPrimitive(
						this.reader.getString(c, "id", bool));
					break;
				default:
					break;
			}
		}
		/* ------------------------------------- */
		console.log("Finished parsing one component.");
	}
}

MySceneGraph.prototype.parseTransformations = function(rootElement) {
	
	var rootTranformations =  rootElement.getElementsByTagName('transformations');
	if (rootTranformations[0].children.length == 0) {
		return "Transformations are missing.";
	}

	this.transformations = new Map();
	nnodes = rootTranformations[0].children.length;
	for (var i=0; i < nnodes; i++)
	{	
		var matrix = mat4.create();

		var snodes = rootTranformations[0].children[i].children.length;
		mat4.identity(matrix);

		for(var j=snodes-1; j >= 0; j--){

			var t = rootTranformations[0].children[i].children[j];
			var bool;

			switch(t.tagName) {
				case "translate":
					mat4.translate(matrix,matrix,[this.reader.getFloat(t,"x",bool), this.reader.getFloat(t,"y",bool), this.reader.getFloat(t,"z",bool)]);
					//console.log("x " + this.reader.getFloat(t,"x",bool) + " y "+this.reader.getFloat(t,"y",bool) + " z " +this.reader.getFloat(t,"z",bool));
					break;
				case "rotate":
					var rotationAxis;
					//console.log("axis " + this.reader.getString(t,"axis",bool));
					switch(this.reader.getString(t,"axis",bool)) {
						case "x":
							rotationAxis = [1,0,0];
							//console.log("angle " + this.reader.getFloat(t,"angle",bool));
							break;
						case "y":
							rotationAxis = [0,1,0];
							break;
						case "z":
							rotationAxis = [0,0,1];
							break;
						default:
							break;
					}
					mat4.rotate(matrix,matrix,this.getRadiansAngle(this.reader.getFloat(t,"angle",bool)),rotationAxis);
					break;		
				case "scale":
					mat4.scale(matrix,matrix,[this.reader.getFloat(t,"x",bool), this.reader.getFloat(t,"y",bool), this.reader.getFloat(t,"z",bool)]);
					//console.log("x " + this.reader.getFloat(t,"x",bool) + " y "+this.reader.getFloat(t,"y",bool) + " z " +this.reader.getFloat(t,"z",bool));
					break;
				default:
					break;				
			}
		}
		this.transformations.set(this.reader.getString(rootTranformations[0].children[i],"id", bool),matrix);
	}
}

MySceneGraph.prototype.parseScene = function(rootElement) {
	
	var bool;
	var sceneInfo = rootElement.getElementsByTagName('scene');
	this.rootName = this.reader.getString(sceneInfo[0], "root", bool);
	this.axisLength = this.reader.getFloat(sceneInfo[0], "axis_length", bool);
}

MySceneGraph.prototype.parseIllumination = function(rootElement) {
	
	var bool;
	var illumination = rootElement.getElementsByTagName('illumination');
	this.doublesided = this.reader.getBoolean(illumination[0], "doublesided", bool);
	this.local = this.reader.getBoolean(illumination[0], "local", bool);	

	this.ambient = [];
	var amb = illumination[0].getElementsByTagName('ambient');
	this.ambient.push(this.reader.getFloat(amb[0], "r", bool));
	this.ambient.push(this.reader.getFloat(amb[0], "g", bool));
	this.ambient.push(this.reader.getFloat(amb[0], "b", bool));
	this.ambient.push(this.reader.getFloat(amb[0], "a", bool));

	this.background = [];
	var backg = illumination[0].getElementsByTagName('ambient');
	this.background.push(this.reader.getFloat(backg[0], "r", bool));
	this.background.push(this.reader.getFloat(backg[0], "g", bool));
	this.background.push(this.reader.getFloat(backg[0], "b", bool));
	this.background.push(this.reader.getFloat(backg[0], "a", bool));
}

MySceneGraph.prototype.parseTextures = function(rootElement) {
	
	var bool, nnodes;
	var rootTextures =  rootElement.getElementsByTagName('textures');
	this.textures = new Map();
	nnodes = rootTextures[0].children.length;
	for (var i=0; i < nnodes; i++)
	{
		var texture = rootTextures[0].children[i];
		var id = this.reader.getString(texture, "id", bool);
		this.textures.set(id, new MyTexture(
			this.scene,
			new CGFtexture(
				this.scene, this.reader.getString(texture, "file", bool))));
		this.textures.get(id).setLengthS(this.reader.getString(texture, "length_s", bool));
		this.textures.get(id).setLengthT(this.reader.getString(texture, "length_t", bool));
		//console.debug("Textures: " + id + " " + this.textures.get(id).texture);
	}
}

MySceneGraph.prototype.parseMaterials = function(rootElement) {
	
	var bool, nnodes;
	var rootMaterials =  rootElement.getElementsByTagName('materials');
	this.materials = new Map();

	nnodes = rootMaterials[0].children.length;
	for(var i=0; i < nnodes; i++)
	{
		var material = rootMaterials[0].children[i];
		var id = this.reader.getString(material, "id", bool);

		this.materials.set(id, new CGFappearance(this.scene));

		var emission = material.getElementsByTagName('emission')[0];
		this.materials.get(id).setEmission(
			this.reader.getFloat(emission,"r",bool),
			this.reader.getFloat(emission,"g",bool),
			this.reader.getFloat(emission,"b",bool),
			this.reader.getFloat(emission,"a",bool)
		);

		var ambient = material.getElementsByTagName('ambient')[0];
		this.materials.get(id).setAmbient(
			this.reader.getFloat(ambient,"r",bool),
			this.reader.getFloat(ambient,"g",bool),
			this.reader.getFloat(ambient,"b",bool),
			this.reader.getFloat(ambient,"a",bool)
		);

		var diffuse = material.getElementsByTagName('diffuse')[0];
		this.materials.get(id).setDiffuse(
			this.reader.getFloat(diffuse,"r",bool),
			this.reader.getFloat(diffuse,"g",bool),
			this.reader.getFloat(diffuse,"b",bool),
			this.reader.getFloat(diffuse,"a",bool)
		);

		var specular = material.getElementsByTagName('specular')[0];
		this.materials.get(id).setSpecular(
			this.reader.getFloat(specular,"r",bool),
			this.reader.getFloat(specular,"g",bool),
			this.reader.getFloat(specular,"b",bool),
			this.reader.getFloat(specular,"a",bool)
		);

		var shininess = material.getElementsByTagName('shininess')[0];
		this.materials.get(id).setShininess(
			this.reader.getFloat(shininess,"value",bool)
		);
	}
}

MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {	

	this.parseScene(rootElement);
	this.parseViews(rootElement);
	this.parseIllumination(rootElement);
	this.parseLights(rootElement);
	this.parseTextures(rootElement);
	this.parseMaterials(rootElement);
	this.parseTransformations(rootElement);
	this.parsePrimitives(rootElement);
	this.parseComponents(rootElement);
};

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


