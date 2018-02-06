// myJavaScriptFile.js
// Version: 3.0.
// Loading a 3D Model. Collada File Format.

// Set the initialise function to be called when the page has loaded.
window.onload = init;

// set the size of our canvas / view onto the scene.
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

// set camera properties / attributes.
var VIEW_ANGLE = 45;
var ASPECT_RATIO = WIDTH / HEIGHT;
var NEAR_CLIPPING_PLANE = 0.1;
var FAR_CLIPPING_PLANE = 10000;

// Declare the variables we will need for three.js.
var renderer;
var scene;
var camera;

// Stats information for our scene.
var stats;

// Declare the variables for items in our scene.
var clock = new THREE.Clock();

// Handles the mouse events.
var mouseOverCanvas;
var mouseDown;

// Manages controls.
var controls;

// Stores graphical meshes.
var seaMesh;
var landMesh;

// Stores variables for Animation and 3D model.
// Stores the model loader.
var myColladaLoader;

// Store the model.
var myDaeFile;

// Initialise three.js.
function init() {
	// Renderer.
	// ---------

	// create a WebGL renderer.
	renderer = new THREE.WebGLRenderer();

	// Set the renderer size.
	renderer.setSize(WIDTH, HEIGHT);

	// Get element from the document (our div) and append the domElement (the canvas) to it.
	var docElement = document.getElementById('myDivContainer');
	docElement.appendChild(renderer.domElement);

	window.addEventListener('resize', function(){ resizeViewport(renderer); })
	// Set the clear colour.
	renderer.setClearColor("rgb(135,206,250)");

	// Add an event to set if the mouse is over our canvas.
	renderer.domElement.onmouseover = function(e) {
		mouseOverCanvas = true;
	}
	renderer.domElement.onmousemove = function(e) {
		mouseOverCanvas = true;
	}
	renderer.domElement.onmouseout = function(e) {
		mouseOverCanvas = false;
	}

	renderer.domElement.onmousedown = function(e) {
		mouseDown = true;
	}
	renderer.domElement.onmouseup = function(e) {
		mouseDown = false;
	}

	// Stats.
	// ------
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	docElement.appendChild(stats.domElement);

	// Scene.
	// ------

	// Create a WebGl scene.
	scene = new THREE.Scene();

	// Camera.
	// -------

	// Create a WebGl camera.
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO,
		NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

	// Set the position of the camera.
	// The camera starts at 0,0,0 ...so pull it back.
	camera.position.set(0, 3, 30);

	// Set up the camera controls.
	controls = new THREE.FirstPersonControls( camera, document.getElementById('myDivContainer') );
	controls.movementSpeed = 200;
	controls.lookSpeed = 0.06;
	controls.activeLook = false;

	// Start the scene.
	// ----------------

	// Now lets initialise the scene. Put things in it, such as meshes and lights.
	initScene();

	// Start rendering the scene.
	render();
}

// Initialise the scene.
function initScene() {
	// A simple mesh.
	// --------------
	// Lets now create a simple scene that contains land and sea.

	// First lets create some sea.
	/*var seaGeometry = new THREE.PlaneGeometry(10000, 10000, 100, 100);
	seaGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

	// Next, create a material.
	var seaMaterial = new THREE.MeshBasicMaterial({
		color: 0x1e90ff
	});

	// Then create the sea mesh and add to the scene.
	seaMesh = new THREE.Mesh(seaGeometry, seaMaterial);

	// Set the sea position.
	seaMesh.position.y = -20;

	// Add the mesh to the scene.
	scene.add(seaMesh);

	// Next, create some land.
	var landGeometry = new THREE.PlaneGeometry(1500, 1500, 100, 100);
	landGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

	// From example.
	for (var i = 0; i < landGeometry.vertices.length; i++) {
		var vertex = landGeometry.vertices[i];
		vertex.x += Math.random() * 20 - 10;
		vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;
	}

	for (var i = 0; i < landGeometry.faces.length; i++) {
		var face = landGeometry.faces[i];
		face.vertexColors[0] =
			new THREE.Color("rgb(0,255,0)").setHSL(Math.random() * 0.2 + 0.25, 0.75, 0.75);
		face.vertexColors[1] =
			new THREE.Color("rgb(0,255,0)").setHSL(Math.random() * 0.2 + 0.25, 0.75, 0.75);
		face.vertexColors[2] =
			new THREE.Color("rgb(0,255,0)").setHSL(Math.random() * 0.2 + 0.25, 0.75, 0.75);
	}

	var landMaterial = new THREE.MeshBasicMaterial({
		vertexColors: THREE.VertexColors
	});

	landMesh = new THREE.Mesh(landGeometry, landMaterial);

	landMesh.position.y = -5;

	scene.add(landMesh);
	*/
	setSkyBox(scene);

	//------------------------------- LIGHTING ---------------------------------

	//Light from a position
	var light = new THREE.PointLight( 0xffffff, 1.5, 200);
	light.position.set(50, 50, 25);			//x : forward/backward, y: top/bottom, z: right/left
	scene.add(light);

	var sphereSize = 1;
	var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
	scene.add( pointLightHelper );

	var light2 = new THREE.PointLight( 0xffffff, 1.5, 200);
	light2.position.set(20, 30, -40);			//x : forward/backward, y: top/bottom, z: right/left
	scene.add(light2);

	var sphereSize2 = 1;
	var pointLightHelper2 = new THREE.PointLightHelper( light2, sphereSize2 );
	scene.add( pointLightHelper2 );

	var light3 = new THREE.PointLight( 0xffffff, 1.5, 200);
	light3.position.set(-50, 50, 25);			//x : forward/backward, y: top/bottom, z: right/left
	scene.add(light3);

	var sphereSize3 = 1;
	var pointLightHelper3 = new THREE.PointLightHelper( light3, sphereSize3 );
	scene.add( pointLightHelper3 );

	var light4 = new THREE.PointLight( 0xffffff, 1.5, 10);
	light4.position.set(-30, 30, -45);			//x : forward/backward, y: top/bottom, z: right/left
	scene.add(light4);

	var sphereSize4 = 1;
	var pointLightHelper4 = new THREE.PointLightHelper( light4, sphereSize4 );
	scene.add( pointLightHelper4 );
	//var light = new THREE.AmbientLight(0xffffff , 0.65);
	//light.position.set(-1, -0.5, -1);
	//\scene.add(light);

	// Add a model to the scene.
	// -------------------------
	myColladaLoader = new THREE.ColladaLoader();
	myColladaLoader.options.convertUpAxis = true;

	myColladaLoader.load('models/desk.dae', function(collada) {
		// Here we store the dae in a global variable.
		myDaeFile = collada.scene;

		// Position your model in the scene (world space).
		myDaeFile.position.x = 0;
		myDaeFile.position.y = 5;
		myDaeFile.position.z = 0;

		// Scale your model to the correct size.
		myDaeFile.scale.x = myDaeFile.scale.y = myDaeFile.scale.z = 10.0;
		myDaeFile.updateMatrix();

		// Add the model to the scene.
		scene.add(myDaeFile);
	});

}

// The game timer (aka game loop). Called x times per second.
function render() {
	// Here we control how the camera looks around the scene.
	controls.activeLook = false;
	if (mouseOverCanvas) {
		if (mouseDown) {
			controls.activeLook = true;
		}
	}

	// Get the time since this method was called.
	var deltaTime = clock.getDelta();

	// Update the controls.
	controls.update(deltaTime);

	// Render the scene.
	renderer.render(scene, camera);

	// Update the stats.
	stats.update();

	// Request the next frame.
	/* The "requestAnimationFrame()" method tells the browser that you
	   wish to perform an animation and requests that the browser call a specified
	   function to update an animation before the next repaint. The method takes
	   as an argument a callback to be invoked before the repaint. */
	requestAnimationFrame(render);
}

function setSkyBox(scene) {
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'models/skybox/Yokohama2/posx.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'models/skybox/Yokohama2/negx.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'models/skybox/Yokohama2/posy.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'models/skybox/Yokohama2/negy.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'models/skybox/Yokohama2/posz.jpg' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'models/skybox/Yokohama2/negz.jpg' ) }));
	for (var i = 0; i < 6; i++)
	   materialArray[i].side = THREE.BackSide;
	var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyboxGeom = new THREE.CubeGeometry( 10000, 10000, 10000, 1, 1, 1 );
	var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
	scene.add( skybox );
	/*var geometry = new THREE.CubeGeometry( 15000, 15000, 15000);
	var texture1 =
	var cubeMaterials = [
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/skybox/Yokohama2/front.jpg"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/skybox/Yokohama2/back.jpg"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/skybox/Yokohama2/up.jpg"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/skybox/Yokohama2/down.jpg"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/skybox/Yokohama2/right.jpg"), side: THREE.DoubleSide}),
		new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("models/skybox/Yokohama2/left.jpg"), side: THREE.DoubleSide})

	];
	var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
	var cube = new THREE.Mesh(geometry, cubeMaterial);
	scene.add(cube);*/

}

function resizeViewport(renderer) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize( width, height );
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}