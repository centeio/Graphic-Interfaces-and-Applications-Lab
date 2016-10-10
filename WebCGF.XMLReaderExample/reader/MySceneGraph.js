
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

	var rootPrimitives =  rootElement.getElementsByTagName('primitives');
	if (rootPrimitives[0].children.length == 0) {
		return "primitives are missing.";
	}

	this.primitives = new Map();
	var nnodes = rootPrimitives[0].children.length;
	for (var i=0; i < nnodes; i++)
	{
		var e = rootPrimitives[0].children[i].children[0];
		var bool;
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


