
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

MySceneGraph.prototype.parseViews = function(rootElement) {
	var rootViews = rootElement.getElementsByTagName('views');
	if(rootViews[0].children.length == 0)
		return "Views are missing."

	this.views = new Map();
	var nperspectives = rootViews[0].children.length;
	for(var i = 0; i < nperspectives; i++) {
		var element = rootViews[0].children[i];
		var bool;
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
		
		this.views.set(this.reader.getString(element, "id", bool),
			new MyView(this.reader.getString(element, "near", bool),
				this.reader.getString(element, "far", bool),
				this.reader.getString(element, "angle", bool), x1, y1, z1, x2, y2, z2));
	}
}

MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var rootPrimitives =  rootElement.getElementsByTagName('primitives');
	if (rootPrimitives[0].children.length == 0)
		return "Primitives are missing."

	this.primitives = new Map();
	var nnodes = rootPrimitives[0].children.length;
	for (var i = 0; i < nnodes; i++) {
		var element = rootPrimitives[0].children[i].children[0];
		var bool;
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

MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {	

	this.parseViews(rootElement);
	
	this.parsePrimitives(rootElement);

	//reading tranformations

	var rootTranformations =  rootElement.getElementsByTagName('transformations');
	if (rootTranformations[0].children.length == 0) {
		return "transformations are missing.";
	}

	this.transformations = [];
	nnodes = rootTranformations[0].children.length;
	for (var i=0; i < nnodes; i++)
	{	
		var trans = [];

		trans.push(rootTranformations[0].children[i].attributes.getNamedItem("id").value);

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
		trans.push(matrix);
		this.transformations.push(trans);
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


