
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



/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */

function multiplyMatrices(m1, m2) {
   var result = [];
   for (var i = 0; i < m1.length; i++) {
       result[i] = [];
       for (var j = 0; j < m2[0].length; j++) {
           var sum = 0;
           for (var k = 0; k < m1[0].length; k++) {
               sum += m1[i][k] * m2[k][j];
           }
           result[i][j] = sum;
       }
   }
   return result;
}

MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	var bool, nnodes;

	//read root and axis
	var sceneInfo = rootElement.getElementsByTagName('scene');
	this.rootName = this.reader.getString(sceneInfo[0], "root", bool);
	this.axisLength = this.reader.getFloat(sceneInfo[0], "axis_length", bool);

//	console.log("scene " + this.rootName + " axis " + this.axisLength);

	//ilumination
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

	//textures
	var rootTextures =  rootElement.getElementsByTagName('textures');
	this.textures = new Map();
	nnodes = rootTextures[0].children.length;
	for (var i=0; i < nnodes; i++)
	{
		var texture = [];
		var t = rootTextures[0].children[i];
		texture.push(this.reader.getString(t[0], "file", bool));
		texture.push(this.reader.getFloat(t[0], "length_s", bool));
		texture.push(this.reader.getFloat(t[0], "length_t", bool));
		this.textures.set(this.reader.getString(t[0], "id", bool),texture);		
	}

	//materials
	var rootMaterials =  rootElement.getElementsByTagName('materials');
	this.materials = new Map();
	nnodes = rootMaterials[0].children.length;
	for(var i=0; i < nnodes; i++)
	{
		var emission = [];
		var ambient = [];
		var diffuse = [];
		var specular = [];
		var shininess = [];
		var all = [];

		emission.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"r",bool));
		emission.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"g",bool));
		emission.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"b",bool));
		emission.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"a",bool));

		ambient.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"r",bool));
		ambient.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"g",bool));
		ambient.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"b",bool));
		ambient.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"a",bool));

		diffuse.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"r",bool));
		diffuse.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"g",bool));
		diffuse.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"b",bool));
		diffuse.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"a",bool));

		specular.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"r",bool));
		specular.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"g",bool));
		specular.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"b",bool));
		specular.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"a",bool));

		shininess.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"r",bool));
		shininess.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"g",bool));
		shininess.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"b",bool));
		shininess.push(this.reader.getFloat(rootMaterials[0].children[i].children[0],"a",bool));

		all.push(emission);		
		all.push(ambient);		
		all.push(diffuse);		
		all.push(specular);		
		all.push(shininess);		

		this.materials.set(this.reader.getString(rootMaterials[0].children[i], "id", bool),all);

	}




	//primitives

	var rootPrimitives =  rootElement.getElementsByTagName('primitives');
	if (rootPrimitives[0].children.length == 0) {
		return "primitives are missing.";
	}

	this.primitives = new Map();
	nnodes = rootPrimitives[0].children.length;
	for (var i=0; i < nnodes; i++)
	{
		var e = rootPrimitives[0].children[i].children[0];
		console.log("Read list item " + e);

		switch(e.tagName) {
			case "rectangle":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyRectangle(this.scene, 
						this.reader.getFloat(e, "x1", bool),
						this.reader.getFloat(e, "x2", bool),
						this.reader.getFloat(e, "y1", bool),
						this.reader.getFloat(e, "y2", bool)));
				break;
			case "triangle":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyTriangle(this.scene,
						this.reader.getFloat(e, "x1", bool),
						this.reader.getFloat(e, "y1", bool),
						this.reader.getFloat(e, "z1", bool),
						this.reader.getFloat(e, "x2", bool),
						this.reader.getFloat(e, "y2", bool),
						this.reader.getFloat(e, "z2", bool),
						this.reader.getFloat(e, "x3", bool),
						this.reader.getFloat(e, "y3", bool),
						this.reader.getFloat(e, "z3", bool)));
				break;
			case "cylinder":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyCylinder(this.scene,
						this.reader.getFloat(e, "base", bool),
						this.reader.getFloat(e, "top", bool),
						this.reader.getFloat(e, "height", bool), 
						this.reader.getFloat(e, "slices", bool),
						this.reader.getFloat(e, "stacks", bool)));
				break;
			case "sphere":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MySphere(this.scene,
						this.reader.getFloat(e, "radius", bool),
						this.reader.getFloat(e, "slices", bool),
						this.reader.getFloat(e, "stacks", bool)));
				break;
			case "torus":
				this.primitives.set(this.reader.getString(rootPrimitives[0].children[i], "id", bool), 
					new MyTorus(this.scene,
						this.reader.getFloat(e, "inner", bool),
						this.reader.getFloat(e, "outer", bool),
						this.reader.getFloat(e, "slices", bool),
						this.reader.getFloat(e, "loops", bool)));
				break;
			default:
				break;
		}
	}

	//tranformations

	var rootTranformations =  rootElement.getElementsByTagName('transformations');
	if (rootTranformations[0].children.length == 0) {
		return "transformations are missing.";
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

			console.log("Read list item " + t);


	//this.reader.getFloat(e, "x1", bool),
			switch(t.tagName) {
				case "translate":
				mat4.translate(matrix,matrix,[this.reader.getFloat(t,"x",bool), this.reader.getFloat(t,"y",bool), this.reader.getFloat(t,"z",bool)]);
				console.log("x " + this.reader.getFloat(t,"x",bool) + " y "+this.reader.getFloat(t,"y",bool) + " z " +this.reader.getFloat(t,"z",bool));


				break;
				case "rotate":
					
					console.log("axis " + this.reader.getString(t,"axis",bool));
//mat4.translate(matrix,[x,y,z];)
					switch(this.reader.getString(t,"axis",bool)) {
						case "x":
						mat4.rotate(matrix,matrix,this.reader.getFloat(t,"angle",bool),[1,0,0]);
						console.log("angle " + this.reader.getFloat(t,"angle",bool));
						break;
						case "y":
						mat4.rotate(matrix,matrix,this.reader.getFloat(t,"angle",bool),[0,1,0]);
						break;
						case "z":
						mat4.rotate(matrix,matrix,this.reader.getFloat(t,"angle",bool),[0,0,1]);
						break;
						default:
						break;
					}
				break;		
				case "scale":
					mat4.scale(matrix,matrix,[this.reader.getFloat(t,"x",bool), this.reader.getFloat(t,"y",bool), this.reader.getFloat(t,"z",bool)]);
					console.log("x " + this.reader.getFloat(t,"x",bool) + " y "+this.reader.getFloat(t,"y",bool) + " z " +this.reader.getFloat(t,"z",bool));
				break;
				default:
				break;				
		}

		//mat4.multiply(m,m,matrix);
		}
		this.transformations.set(this.reader.getString(rootTranformations[0].children[i],"id", bool),matrix);
	}


	//reading components
/*
	var rootComponents =  rootElement.getElementsByTagName('components');
	if (rootComponents[0].children.length == 0) {
		return "primitives are missing.";
	}

	this.primitives = [];
	nnodes = rootComponents[0].children.length;
	console.log(nnodes);
	for (var i=0; i < nnodes; i++){

	}*/

	/*if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}

	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};*/

};

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


