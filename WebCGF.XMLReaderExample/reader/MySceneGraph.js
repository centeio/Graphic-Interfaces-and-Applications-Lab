
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	

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
	
	if(rootViews.length <= 0)
		console.error("Views tag is missing.");
	if(rootViews[0].children.length == 0)
		console.error("Views are missing.");

	else {
		this.viewsID = [];	
		this.views = new Map();
		var nperspectives = rootViews[0].children.length;
		var defaultView = this.reader.getString(rootViews[0], "default", bool);
		this.viewDefaultID = -1;

		for(var i = 0; i < nperspectives; i++) {
			var element = rootViews[0].children[i];
			var bool;
			
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
			
			this.viewsID.push(this.reader.getString(element, "id", bool));
			
			if(this.reader.getString(element, "id", bool) == String(defaultView))
				this.viewDefaultID = this.viewsID.length - 1;

			this.views.set(this.reader.getString(element, "id", bool),
			new CGFcamera(this.getRadiansAngle(this.reader.getString(element, "angle", bool)),
				this.reader.getFloat(element, "near", bool),
				this.reader.getFloat(element, "far", bool),
				vec3.fromValues(x1, y1, z1), 
				vec3.fromValues(x2, y2, z2)));
		}

		if(-1 == this.viewDefaultID)
			console.warn("Default view missing.");
		else
			this.scene.camCounter = this.viewDefaultID;
	}
}

function find(lights, id){
	for(var i = 0; i < lights.length; i++){
		if(lights[i][1] == id)
			return 1;
	}

	return 0;
}

MySceneGraph.prototype.parseLights = function(rootElement) {
	var rootLights = rootElement.getElementsByTagName('lights');
	
	if(rootLights.length <= 0)
		console.error("Lights tag is missing.");
	var nLights = rootLights[0].children.length;		
	this.lights = [];

	if(nLights > 8)
		return "WebGL only supports 8 lights."

	var bool;

	for(var i = 0; i < nLights; i++) {
		var child = rootLights[0].children[i];
		var light = [];	

		if(1 == find(this.lights, this.reader.getString(child, "id", bool)))
			console.error("Lights ID repeated.");		

		switch(child.tagName) {
			case "omni":
				light.push("omni");
				light.push(this.reader.getString(child, "id", bool));
				this.lights.push(light);

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
					this.scene.lights[i].enable();
				}
				else {
					this.scene.lights[i].disable();
				}
				break;

			case "spot":
				light.push("spot");
				light.push(this.reader.getString(child, "id", bool));
				this.lights.push(light);

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

	this.scene.sceneTagReady = true;
}

MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var rootPrimitives =  rootElement.getElementsByTagName('primitives');
	
	if(rootPrimitives.length <= 0)
		console.error("Primitives tag is missing.");	
	if (rootPrimitives[0].children.length == 0)
		console.error("Primitives are missing.");

	this.primitives = new Map();
	nnodes = rootPrimitives[0].children.length;
	var bool;

	for (var i=0; i < nnodes; i++) {

		if(rootPrimitives[0].children[i].children.length != 1)
			console.error("One and only one tag per primitive.");

		var element = rootPrimitives[0].children[i].children[0];

		if(this.primitives.get(this.reader.getString(rootPrimitives[0].children[i], "id", bool)) != undefined)
			console.error("Primitives ID repeated.");

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
			case "plane":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new Plane(this.scene,
						this.reader.getFloat(element, "dimX", bool),
						this.reader.getFloat(element, "dimY", bool),
						this.reader.getFloat(element, "partsX", bool),
						this.reader.getFloat(element, "partsY", bool)));
				break;
			case "patch":
						var orderU = this.reader.getFloat(element, "orderU", bool);
						var orderV = this.reader.getFloat(element, "orderV", bool);
						var partsU = this.reader.getFloat(element, "partsU", bool);
						var partsV = this.reader.getFloat(element, "partsV", bool);
						
						var controlvx = [];
						ncontrolpoints = element.children.length;
						console.log("CONTROL POINTS "+ncontrolpoints);

						if(ncontrolpoints != (orderU+1)*(orderV+1))
							console.error("Control Points wrong in number in " + this.reader.getString(rootPrimitives[0].children[i], "id", bool));
						
						for(var n = 0; n < orderU+1; n++){
							var tmp = [];
							controlvx.push(tmp);
						}

						for(var k = 0; k < ncontrolpoints; k++){
							var point = [];
							point.push(this.reader.getFloat(element.children[k], "x", bool));
							point.push(this.reader.getFloat(element.children[k], "y", bool));
							point.push(this.reader.getFloat(element.children[k], "z", bool));
							point.push(1);
							console.log("ind: " + k % (orderU+1));
							console.log(point);
							controlvx[k % (orderU+1)].push(point);

						}

						console.log(controlvx);

						this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool),
							new Patch(this.scene, orderU, orderV, partsU, partsV, controlvx));
				break;
			case 'vehicle':
					this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new Vehicle(this.scene));
					break;
			case 'chessboard':
					if(rootPrimitives[0].children[i].children[0].children.length != 3)
						console.error("Wrong amount of colors in "+ this.reader.getString(rootPrimitives[0].children[i], "id", bool));
					else{
						var colorcs = rootPrimitives[0].children[i].children[0].getElementsByTagName('cs');
						var color1 = rootPrimitives[0].children[i].children[0].getElementsByTagName('c1');
						var color2 = rootPrimitives[0].children[i].children[0].getElementsByTagName('c2');

						var colorcstemp = [];
						colorcstemp.push(this.reader.getFloat(colorcs[0], "r", bool));
						colorcstemp.push(this.reader.getFloat(colorcs[0], "g", bool));
						colorcstemp.push(this.reader.getFloat(colorcs[0], "b", bool));
						colorcstemp.push(this.reader.getFloat(colorcs[0], "a", bool));

						var color1temp = [];
						color1temp.push(this.reader.getFloat(color1[0], "r", bool));
						color1temp.push(this.reader.getFloat(color1[0], "g", bool));
						color1temp.push(this.reader.getFloat(color1[0], "b", bool));
						color1temp.push(this.reader.getFloat(color1[0], "a", bool));

						var color2temp = [];
						color2temp.push(this.reader.getFloat(color2[0], "r", bool));
						color2temp.push(this.reader.getFloat(color2[0], "g", bool));
						color2temp.push(this.reader.getFloat(color2[0], "b", bool));
						color2temp.push(this.reader.getFloat(color2[0], "a", bool));	

						var colors = [];
						colors.push(colorcstemp);									
						colors.push(color1temp);
						colors.push(color2temp);
						
					}
					var su = -1, sv = -1;

					if(this.reader.hasAttribute(element,"su"))
						su = this.reader.getFloat(element, "su", bool);
					if(this.reader.hasAttribute(element,"sv"))
						sv = this.reader.getFloat(element, "sv", bool);						

					this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new ChessBoard(this.scene,this.reader.getFloat(element, "du", bool),
					this.reader.getFloat(element, "dv", bool),
					this.textures.get(this.reader.getString(element, "textureref", bool)),
					su,
					sv,
					colors));									

					break;	
			case 'unit':			
					this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyUnit(this.scene));
					break;
			case 'node':
					this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyNode(this.scene));
					break;					
			case 'nodesboard':
					this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new NodesBoard(this.scene));
					break;				

			default:
				console.error("Primitive tag unknown.");
				break;
		}
	}	
}

MySceneGraph.prototype.parseComponents = function(rootElement) {
	var rootComponents = rootElement.getElementsByTagName('components');
	
	if(rootComponents.length <= 0)
		console.error("Components tag is missing.");

	if(rootComponents[0].children.length == 0)
		console.error("Components are missing.");

	this.components = new Map();
	var ncomponents = rootComponents[0].children.length;

	for(var i = 0; i < ncomponents; i++) {
		var component = rootComponents[0].children[i];
		var bool;

		var id = this.reader.getString(component, "id", bool);
		this.components.set(id, new MyComponent(this.scene));
		this.components.get(id).addID(id);

		/* Transformation ---------------------- */
		if(component.getElementsByTagName('transformation').length != 1)
			console.error("One and only one transformation tag in each component.");
			
		var transformation = component.getElementsByTagName('transformation')[0];

		if(transformation.getElementsByTagName('transformationref')[0] != undefined) {
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
						switch(this.reader.getString(t,"axis",bool)) {
							case "x":
								rotationAxis = [1,0,0];
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
			this.components.get(id).addTransformation(matrix);
		} 
		/* ------------------------------------- */

		/* Animations -------------------------- */
		if(component.getElementsByTagName('animationref').length != 0) {
			var animations = component.getElementsByTagName('animationref');
			var nAnimations = animations.length;

			for(j = 0; j < nAnimations; j++) {
				this.components.get(id).addAnimation(
					this.reader.getString(animations[j], "id", bool));
			}
		}
		/* ------------------------------------- */

		/* Materials --------------------------- */
		if(component.getElementsByTagName('materials').length != 1)
			console.error("One and only one materials tag in each component.");

		var materials = component.getElementsByTagName('materials')[0];
		var nMaterials = materials.children.length;

		if(nMaterials <= 0)
			console.error("No material in one of the components.");

		for(var j = 0; j < nMaterials; j++) {
			this.components.get(id).addMaterialRef(
				this.reader.getString(materials.children[j], "id", bool));
		}
		/* ------------------------------------- */

		/* Texture ----------------------------- */
		if(component.getElementsByTagName('texture').length != 1)
			console.error("One and only one texture tag in each component.");

		var texture = component.getElementsByTagName('texture')[0];
		
		this.components.get(id).addTextureRef(
			this.reader.getString(texture, "id", bool));
		/* ------------------------------------- */

		/* Children ---------------------------- */
		if(component.getElementsByTagName('children').length != 1)
			console.error("One and only one children tag in each component.");

		var componentChildren = component.getElementsByTagName('children')[0];
		var nChildren = componentChildren.children.length;

		if(nChildren <= 0)
			console.error("Children missing in one of the components.");

		for(var j = 0; j < nChildren; j++) {
			var c = componentChildren.children[j];
			switch(c.tagName) {
				case 'componentref':
					this.components.get(id).addComponent(
						this.reader.getString(c, "id", bool));
					break;
				case 'primitiveref':
					this.components.get(id).addPrimitive(
						this.reader.getString(c, "id", bool));
					break;
				default:
					console.error("Reference unknown.");
					break;
			}
		}
		/* ------------------------------------- */
	}
}

MySceneGraph.prototype.parseTransformations = function(rootElement) {
	
	var rootTranformations =  rootElement.getElementsByTagName('transformations');
	
	if(rootTranformations.length <= 0)
		console.error("Transformations tag is missing.");

	if (rootTranformations[0].children.length == 0)
		console.error("Transformations are missing.");

	this.transformations = new Map();
	nnodes = rootTranformations[0].children.length;
	for (var i=0; i < nnodes; i++)
	{	
		var matrix = mat4.create();

		var snodes = rootTranformations[0].children[i].children.length;
		if(snodes <= 0)
			console.error("Tranformation instruction is missing.");
		
		mat4.identity(matrix);

		for(var j = 0; j < snodes; j++){

			var t = rootTranformations[0].children[i].children[j];
			var bool;

			switch(t.tagName) {
				case "translate":
					mat4.translate(matrix,matrix,[this.reader.getFloat(t,"x",bool), this.reader.getFloat(t,"y",bool), this.reader.getFloat(t,"z",bool)]);
					break;
				case "rotate":
					var rotationAxis;
					switch(this.reader.getString(t,"axis",bool)) {
						case "x":
							rotationAxis = [1,0,0];
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
	
	if(sceneInfo.length <= 0)
		console.error("Scene tag is missing.");
		
	this.rootName = this.reader.getString(sceneInfo[0], "root", bool);
	this.axisLength = this.reader.getFloat(sceneInfo[0], "axis_length", bool);
}

MySceneGraph.prototype.parseIllumination = function(rootElement) {
	
	var bool;
	var illumination = rootElement.getElementsByTagName('illumination');

	if(illumination.length <= 0)
		console.error("Illumination tag is missing.");

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
	
	if(rootTextures.length <= 0)
		console.error("Textures tag is missing.");

	this.textures = new Map();
	nnodes = rootTextures[0].children.length;
	
	if(nnodes <= 0)
		console.error("At least one texture is needed.");
	
	for (var i=0; i < nnodes; i++) {
		var texture = rootTextures[0].children[i];
		var id = this.reader.getString(texture, "id", bool);

		if(this.textures.get(id) != undefined)
			console.error("Texture ID repeated.");

		this.textures.set(id, new MyTexture(
			this.scene,
			new CGFtexture(
				this.scene, this.reader.getString(texture, "file", bool))));
		this.textures.get(id).setLengthS(this.reader.getString(texture, "length_s", bool));
		this.textures.get(id).setLengthT(this.reader.getString(texture, "length_t", bool));
	}
}

MySceneGraph.prototype.parseMaterials = function(rootElement) {
	
	var bool, nnodes;
	var rootMaterials =  rootElement.getElementsByTagName('materials');
	
	if(rootMaterials.length <= 0)
		console.error("Materials tag is missing.");

	this.materials = new Map();

	nnodes = rootMaterials[0].children.length;
	
	if(nnodes <= 0)
		console.error("Materials not declared.");

	for(var i=0; i < nnodes; i++)
	{
		var material = rootMaterials[0].children[i];
		var id = this.reader.getString(material, "id", bool);
		
		if(this.materials.get(id) != undefined)
			console.error("Material ID repeated.");

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

MySceneGraph.prototype.parseAnimations = function(rootElement) {
	var bool, nnodes;
	var rootAnimations =  rootElement.getElementsByTagName('animations');
	
	if(rootAnimations.length <= 0)
		console.error("Animations tag is missing.");

	this.animations = new Map();

	nnodes = rootAnimations[0].children.length;
	
	if(nnodes <= 0)
		console.error("Animations not declared.");

	for(var i=0; i < nnodes; i++) {
		var animation = rootAnimations[0].children[i];
		var id = this.reader.getString(animation, "id", bool);
		
		if(this.animations.get(id) != undefined)
			console.error("Animation ID repeated.");

		var span = this.reader.getFloat(animation, "span", bool);

		if(this.reader.getString(animation, "type", bool) == "linear") {
			this.animations.set(id, new MyLinearAnimation(span));

			var controlPoints = animation.getElementsByTagName('controlpoint');
			var nControlPoints = controlPoints.length;

			if(nControlPoints == 0)
				console.error('Missing control points in linear animation.');


			for(var j = 0; j < nControlPoints; j++) {
				var controlPoint = controlPoints[j];

				var x = this.reader.getFloat(controlPoint, "xx", bool);
				var y = this.reader.getFloat(controlPoint, "yy", bool);
				var z = this.reader.getFloat(controlPoint, "zz", bool);

				this.animations.get(id).addControlPoint(x,y,z);
			}

			this.animations.get(id).calculateSegmentDurations();
		}
		else if(this.reader.getString(animation, "type", bool) == 'circular') {
			this.animations.set(id, new MyCircularAnimation(span));
			
			var centerX = this.reader.getFloat(animation, "centerx", bool);
			var centerY = this.reader.getFloat(animation, "centery", bool);
			var centerZ = this.reader.getFloat(animation, "centerz", bool);
			this.animations.get(id).addCenter(centerX, centerY, centerZ);

			var radius = this.reader.getFloat(animation, "radius", bool);
			this.animations.get(id).addRadius(radius);

			var initialAngle = this.reader.getFloat(animation, "startang", bool);
			this.animations.get(id).addInitialAngle(initialAngle);

			var angle = this.reader.getFloat(animation, "rotang", bool);
			this.animations.get(id).addAngle(angle);
		}
		else
			console.error('Invalid animation type');	
	}
}

MySceneGraph.prototype.parseGlobalsExample = function(rootElement) {	
			
	if(rootElement.children[0].tagName != "scene" || rootElement.children[1].tagName != "views" ||
	rootElement.children[2].tagName != "illumination" || rootElement.children[3].tagName != "lights" ||
	rootElement.children[4].tagName != "textures" || rootElement.children[5].tagName != "materials" ||
	rootElement.children[6].tagName != "transformations" || rootElement.children[7].tagName != "animations" ||
	rootElement.children[8].tagName != "primitives" ||	rootElement.children[9].tagName != "components")
		console.error("Tags unordered.");

	this.parseScene(rootElement);
	this.parseViews(rootElement);
	this.parseIllumination(rootElement);
	this.parseLights(rootElement);
	this.parseTextures(rootElement);
	this.parseMaterials(rootElement);
	this.parseTransformations(rootElement);
	this.parseAnimations(rootElement);
	this.parsePrimitives(rootElement);
	this.parseComponents(rootElement);
};

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError = function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};

MySceneGraph.prototype.update = function(currTime) {

	this.animations.get("linearAnim").position(currTime);

};


