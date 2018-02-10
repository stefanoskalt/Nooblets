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
	var mouse = new THREE.Vector2();

// Declare the variables we will need for three.js.
var renderer;
var scene;
var camera;
var raycaster;
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

//store array of models for collision
var modelsCollision = [];

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

	window.addEventListener('resize', function() {
		resizeViewport(renderer);
	})
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
	controls = new THREE.FirstPersonControls(camera, document.getElementById('myDivContainer'));
	controls.movementSpeed = 200;
	controls.lookSpeed = 0.06;
	controls.activeLook = true;



	// Start the scene.
	// ----------------

	// Now lets initialise the scene. Put things in it, such as meshes and lights.
	initScene();

	// Start rendering the scene.
	render();
}

// Initialise the scene.
function initScene() {
	//set the sky box of the environment
	setSkyBox(scene);

	//------------------------------- LIGHTING ---------------------------------

	//Light 1 (forward, top, right)
	/*var light = new THREE.PointLight(0xffffff, 1.5, 200);
	light.position.set(50, 50, 25); //x : forward/backward, y: top/bottom, z: right/left
	scene.add(light);
	//Visualisize Light 1
	var sphereSize = 1;
	var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
	scene.add(pointLightHelper);

	//Light 2 (forward, top, left)
	var light2 = new THREE.PointLight(0xffffff, 1.5, 200);
	light2.position.set(20, 30, -40); //x : forward/backward, y: top/bottom, z: right/left
	scene.add(light2);
	//Visualisize Light 2
	var sphereSize2 = 1;
	var pointLightHelper2 = new THREE.PointLightHelper(light2, sphereSize2);
	scene.add(pointLightHelper2);

	//Light 3 (backward, top, right)
	var light3 = new THREE.PointLight(0xffffff, 1.5, 200);
	light3.position.set(-50, 50, 25); //x : forward/backward, y: top/bottom, z: right/left
	scene.add(light3);
	//Visualisize Light 3
	var sphereSize3 = 1;
	var pointLightHelper3 = new THREE.PointLightHelper(light3, sphereSize3);
	scene.add(pointLightHelper3);

	//Light 4 (backward, top, left)
	var light4 = new THREE.PointLight(0xffffff, 1.5, 10);
	light4.position.set(-30, 30, -45); //x : forward/backward, y: top/bottom, z: right/left
	scene.add(light4);
	//Visualisize Light 4
	var sphereSize4 = 1;
	var pointLightHelper4 = new THREE.PointLightHelper(light4, sphereSize4);
	scene.add(pointLightHelper4);
*/





	var material = new THREE.LineBasicMaterial({ color: 0xAAFFAA });

	// crosshair size
	var x = 0.01, y = 0.01;

	var geometry = new THREE.Geometry();

	// crosshair
	geometry.vertices.push(new THREE.Vector3(0, y, 0));
	geometry.vertices.push(new THREE.Vector3(0, -y, 0));
	geometry.vertices.push(new THREE.Vector3(0, 0, 0));
	geometry.vertices.push(new THREE.Vector3(x, 0, 0));
	geometry.vertices.push(new THREE.Vector3(-x, 0, 0));

	var crosshair = new THREE.Line( geometry, material );

	// place it in the center
	var crosshairPercentX = 50;
	var crosshairPercentY = 50;
	var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
	var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

	crosshair.position.x = crosshairPositionX * camera.aspect;
	crosshair.position.y = crosshairPositionY;

	crosshair.position.z = -0.3;

	camera.add( crosshair );
	scene.add( camera );

	//------------------LOAD ALL MODELS-----------------
	loadAllModels();
	loadAllLights();
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
	checkCollision();
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

/**
 * Set Skybox for the world. A huge cube, where the camera is placed INSIDE it, and the cube's
 * sides are textured with pictures in such a way to simulate a real word
 */
function setSkyBox() {
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('models/skybox/Yokohama2/posx.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('models/skybox/Yokohama2/negx.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('models/skybox/Yokohama2/posy.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('models/skybox/Yokohama2/negy.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('models/skybox/Yokohama2/posz.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('models/skybox/Yokohama2/negz.jpg')
	}));
	for (var i = 0; i < 6; i++)
		materialArray[i].side = THREE.BackSide;
	var skyboxMaterial = new THREE.MeshFaceMaterial(materialArray);
	var skyboxGeom = new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1);
	var skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial);
	scene.add(skybox);
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

//parameter: toLoadModel[ 'modelPath' : modelPath, 'collision': true, 'position' : ['x' : modelX, 'y' : modelY, 'z' : modelZ], 'scale' : modelScale]
function loadModel(toLoadModelArray) {
	var toLoadModel;

	myColladaLoader = new THREE.ColladaLoader();
	myColladaLoader.options.convertUpAxis = true;

	myColladaLoader.load(toLoadModelArray['modelPath'], function(collada) {
		// Here we store the model
		toLoadModel = collada.scene;

		// Position your model in the scene (world space).
		toLoadModel.position.x = toLoadModelArray['position']['x'];
		toLoadModel.position.y = toLoadModelArray['position']['y'];
		toLoadModel.position.z = toLoadModelArray['position']['z'];


		// Scale your model to the correct size.
		toLoadModel.scale.x = toLoadModel.scale.y = toLoadModel.scale.z = toLoadModelArray['scale'];
		toLoadModel.updateMatrix();


		//if collision is set to true, then push the object to array holding
		//objects which have collision
		if (toLoadModelArray['collision'] == true) {
			modelsCollision.push(toLoadModel);
		}

		// Add the model to the scene.
		scene.add(toLoadModel);
	});
}


/**
 * A controller function where we load all Models for the simulation.
 */
function loadAllModels() {
	var loadDesk = {
		'modelPath': 'models/desk.dae',
		'collision': true,
		'position': {
			'x': 0,
			'y': -50,
			'z': 0
		},
		'scale': 10.0
	};
	loadModel(loadDesk);
}


/**
 * Handles the resizing functionality of the canvas. Normally the canvas would not
 * resize if the browser window resized. With this function the canvas will also resize
 */
function resizeViewport() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
}


/**
 * Check collision for all objects held in modelsCollision array
 * Send a ray, if intersects object, collision detected with object
 */
function checkCollision() {
	var vectorDirection = new THREE.Vector3(); // create once and reuse it!
	var vectorPosition = new THREE.Vector3();

	vectorDirection = camera.getWorldDirection( vectorDirection ); //
	vectorPosition = camera.getWorldPosition( vectorPosition );

	// Set up raycaster
	raycaster = new THREE.Raycaster(camera.getWorldPosition(), camera.getWorldDirection().normalize());
	//raycaster.setFromCamera( mouse, camera );


	//console.log(scene.children)
	//check array holding objects with collision, set true as argument to allow the function to check complex models
	var intersects = raycaster.intersectObjects( modelsCollision, true );

	var log = document.getElementById('log');
	if (intersects.length != 0) {
		var log = document.getElementById('log');
		log.innerHTML = "HIT!";
	}else{
		log.innerHTML = "";

		//console.log(vector);
	}
}

/**
 * A controller function where we load all Lights for the simulation.
 */
function loadAllLights(){
	var fullLight = {
		'type' : '',         // (AmbientLight, PointLight, DirectionalLight, HemisphereLight, SpotLight)
		'color' : '',        // Needed: AmbientLight                 Optional: PointLight, SpotLight, DirectionalLight, SpotLight
		'intensity' : '',    // Needed: AmbientLight                 Optional: PointLight, SpotLight, DirectionalLight, HemisphereLight, SpotLight
		'distance' : '',     // Needed: PointLight, SpotLight
		'angle' : '',        // Needed: SpotLight
		'penumbra' : 0.5,    // Needed: SpotLight  (0-1)
		'decay' : '',        // Needed: PointLight, SpotLight 
		'size' : '',         // Needed: HemisphereLight              Optional: PointLight, DirectionalLight
		'position' : {       // Needed: PointLight, DirectionalLight, SpotLight
			'x' : 10.0,
			'y' : 15.0,
			'z' : 1
		},
		'target' : {         // Needed: DirectionalLight
			'x' : 10.0,
			'y' : 15.0,
			'z' : 1
		},
		'showLight' : {      // (for helpers, but not needed)
			'size': 1,
			'color' : 0x404040
		},
		'skyColor' : 0xffffbb,    // Optional: HemisphereLight
		'groundColor' : 0x080820  // Optional: HemisphereLight
	};

	var AmbientLight = { // works
		'type' : 'AmbientLight',
		'color' : '#ff0000',
		'intensity' : '2'
	}

	var PointLight = { // works
		'type' : 'PointLight',
		'color' : '#ff0000',
		'intensity' : '5', 
		'distance' : '50',
		'decay' : '1',
		'size' : '2',
		'position' : { 
			'x' : 0,
			'y' : -40,
			'z' : 1
		},
	}

	var DirectionalLight = { // works
		'type' : 'DirectionalLight',
		'color' : '#ff0000',
		'intensity' : '5',
		'size' : '2',
		'position' : { 
			'x' : 0,
			'y' : 6,
			'z' : 30
		},
		'target' : { // works but the helper does not point to the correct direction
			'x' : -30,
			'y' : 5,
			'z' : 0
		}
	}

	var HemisphereLights = {  // works
		'type' : 'HemisphereLight',
		'skyColor' : '#ff0000',
		'groundColor' : '#0000FF',
		'intensity' : '1',
		'size' : '2',
	}

	var SpotLight = { // Works
		'type' : 'SpotLight',
		'color' : '#ff0000',
		'intensity' : '20',
		'distance' : '40',
		'angle' : '10',
		'penumbra' : '0.5',
		'decay' : '1',
		'position' : { 
			'x' : 0,
			'y' : 6,
			'z' : 1
		}
	}
	createLight (DirectionalLight);
}

function createLight(lightObj) {
	switch (lightObj.type) {
		case "AmbientLight" : // globally illuminates all objects in the scene equally	
			var light = new THREE.AmbientLight( lightObj.color, lightObj.intensity); // soft white light
			scene.add(light);
		break;

		case "PointLight" : // light emitted from single point in all directions
			var light = new THREE.PointLight(lightObj.color, lightObj.intensity, lightObj.distance, lightObj.decay); // only works without the 'if statements'
			light.position.set(lightObj.position.x, lightObj.position.y, lightObj.position.z);
			scene.add(light);
			var sphereSize = lightObj.size; // not ligObj.showLight.size
			var pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
			scene.add(pointLightHelper);
		break;
		case "DirectionalLight" : // light that gets emitted in a specific direction (has position and target)
			var light = new THREE.DirectionalLight( lightObj.color, lightObj.intensity, lightObj.target.x, lightObj.target.y, lightObj.target.z  ); // how do i select target coordinates?
			light.position.set(lightObj.position.x, lightObj.position.y, lightObj.position.z);
			light.target.position.set(lightObj.target.x, lightObj.target.y, lightObj.target.z);
			scene.add(light);
			scene.add(light.target); // THREE documentation says need to add light target to scene
			var planeSize = lightObj.size;
			var directionalLightHelper = new THREE.DirectionalLightHelper(light, planeSize);
			scene.add(directionalLightHelper);
		break;
		case "HemisphereLight" : //light source positioned directly above the scene
			var light = new THREE.HemisphereLight( lightObj.skyColor, lightObj.groundColor, lightObj.intensity );
			scene.add( light );
			var sphereMeshSize = lightObj.size;
			var hemisphereLightHelper = new THREE.HemisphereLightHelper( light, sphereMeshSize );
			scene.add( hemisphereLightHelper );
		break;
		case "SpotLight" : // light emitted from a single point in one direction, along a cone
			var light = new THREE.SpotLight( lightObj.color, lightObj.intensity, lightObj.distance, lightObj.angle, lightObj.penumbra, lightObj.decay ); // spotlight shining from the side
			light.position.set(lightObj.position.x, lightObj.position.y, lightObj.position.z);
			//lightObj.position.set(lightObj.position.x, lightObj.position.y, lightObj.position.z);
			scene.add(light);
			var spotLightHelper = new THREE.SpotLightHelper( light );
			scene.add( spotLightHelper );
		break;
	}
	
}

