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
var cameraPosVector = new THREE.Vector3();

var renderer;
var scene;
var camera;
var raycaster;
var cameraPosition = { x : 500.0, y : 500.0, z : 500.0 };
var keys = [];
var vectorDirection = new THREE.Vector3(); // create once and reuse it!
	var vectorPosition = new THREE.Vector3();
	var vectorCenter = new THREE.Vector3();
	var vectorLeft = new THREE.Vector3();
	var vectorRight = new THREE.Vector3();
	var vectorTop = new THREE.Vector3();
	var vectorBottom = new THREE.Vector3();
	var vectorCenterDirection = new THREE.Vector3();
	var vectorLeftDirection = new THREE.Vector3();
	var vectorRightDirection = new THREE.Vector3();
	var vectorTopDirection = new THREE.Vector3();
	var vectorBottomDirection = new THREE.Vector3();
	var axis = new THREE.Vector3( 0, 0, 1 );
	var axis1 = new THREE.Vector3( 0, 0, 1 );
	var axisBackward = new THREE.Vector3( 1, 0, 0);
	var angleLeft = Math.PI/6;
	var angleRight = Math.PI/2;
	var angleBackward = Math.PI;

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
	renderer.antialias = true;
	// Set the renderer size.
	renderer.setSize(WIDTH, HEIGHT);

	// Get element from the document (our div) and append the domElement (the canvas) to it.
	var docElement = document.getElementById('myDivContainer');
	docElement.appendChild(renderer.domElement);

	window.addEventListener('resize', function() {
		resizeViewport(renderer);
	});
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
	//window.addEventListener('keydown', function() {
	//	pressKey(event);
	//});

	// Create a WebGl scene.
	scene = new THREE.Scene();

	// Camera.
	// -------

	// Create a WebGl camera.
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO,
		NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);

	// Set the position of the camera.
	// The camera starts at 0,0,0 ...so pull it back.
	camera.position.set(0, 0, 0);

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
	var allowedToMove = false;
	// Here we control how the camera looks around the scene.
	controls.activeLook = false;
	if (mouseOverCanvas) {
		if (mouseDown) {
			controls.activeLook = true;
		}
	}
	vectorPosition = camera.getWorldPosition( cameraPosVector );
	if (vectorPosition.x != cameraPosition.x || vectorPosition.y != cameraPosition.y || vectorPosition.z != cameraPosition.z) {
		cameraPosition.x = vectorPosition.x;
		cameraPosition.y = vectorPosition.y;
		cameraPosition.z = vectorPosition.z;
	} else {
		//console.log("i am saving time");
	}
	//var log = document.getElementById('log');


	if (checkCollision('forward') == true) {
		controls.moveForward = false;
		//log.innerHTML = "FORWARD HIT!";
	}
	if (checkCollision('backward') == true) {
		controls.moveBackward = false;
		//log.innerHTML = "BACKWARD HIT!";
	}

	/*if (checkCollision('left') == true) {
		controls.moveLeft = false;
		//log.innerHTML = "left HIT!";

	}
	/*if (checkCollision('right') == true) {
		controls.moveRight = false;
		//log.innerHTML = "right HIT!";

	} else {
		//log.innerHTML = '';
	}*/
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



/*function loadAllLights() {
	var light1 = {
		'type' : AmbientLight,
		'color' : 0x404040
	},

	createLight(light1)
}*/
//parameter: toLoadModel[ 'modelPath' : modelPath, 'collision': true, 'position' : ['x' : modelX, 'y' : modelY, 'z' : modelZ], 'scale' : modelScale]
//parameter: light = {
//						'type' : AmbientLight/Pointlight/DirectionalLight/HemisphereLight/Spotlight
//												}
//						'color' : 0x404040 (hex value)
//						'intensity' : 1.0
//						'distance' : 100
//						'decay': 2
//						'positionFrom' : {
//											'x' : 10.0
//											'y' : 15.0
//											'z' : 1
//										}
//						'positionTo' : {
//											'x' : 10.0
//											'y' : 15.0
//											'z' : 1
//										}
//						'penumbra' : 0.5
//						'showLight' : {
//								"size": 1
//								"color" : 0x404040
//						}
//					}
//

/*function createLight(lightObj) {
	switch (lightObj.type) {
		case "AmbientLight" : 	var light = new THREE.AmbientLight( lightObj.colour ); // soft white light
							  	scene.add(light);

		case "Pointlight" : var light = new THREE.AmbientLight( lightObj.colour ); \
							var sphereSize4 = lightObj.showLight.size;
													var pointLightHelper4 = new THREE.PointLightHelper(light, sphereSize4);
													scene.add(pointLightHelper4);
													break;// soft white light
		case "AmbientLight" : var light = new THREE.AmbientLight( lightObj.colour ); // soft white light
		case "AmbientLight" : var light = new THREE.AmbientLight( lightObj.colour ); // soft white light
		case "AmbientLight" : var light = new THREE.AmbientLight( lightObj.colour ); // soft white light
	}



	}
}*/
function loadModel(toLoadModelArray) {
	var toLoadModel;

	myColladaLoader = new THREE.ColladaLoader();
	myColladaLoader.options.convertUpAxis = true;

	myColladaLoader.load(toLoadModelArray['modelPath'], function(collada) {
		var rotate;
		// Here we store the model
		toLoadModel = collada.scene;

		// Position your model in the scene (world space).
		toLoadModel.position.x = toLoadModelArray['position']['x'];
		toLoadModel.position.y = toLoadModelArray['position']['y'];
		toLoadModel.position.z = toLoadModelArray['position']['z'];

		if (toLoadModelArray['rotate']) {
			console.log('i am here');
			rotate = rotateModel(toLoadModelArray['rotate']);
			console.log(rotate);
			toLoadModel.rotation.x = rotate.x;
			toLoadModel.rotation.y = rotate.y;
			toLoadModel.rotation.z = rotate.z;
		}

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
	//x : (-/+)forward/backward, y: top/bottom, z: right/left
	var loadDesk = {
		'modelPath': 'models/desk.dae',
		'collision': false,
		'position': {
			'x': 0,
			'y': 0,
			'z': -2
		},
		'scale': 10.0,
		'rotate': {
			'x' : 500,
			'y' : 500,
			'z' : 500
		}
	};

	var loadWall = {
		'modelPath': 'models/desk.dae',
		'collision': true,
		'position': {
			'x': 20,
			'y': 5,
			'z': 0
		},
		'scale': 10.0
	};
	var loadRoom = {
		'modelPath': 'models/room.dae',
		'collision': true,
		'position': {
			'x': 0,
			'y': 0,
			'z': -10
		},
		'scale': 1.0,

	};
	var loadWindow = {
		'modelPath': 'models/window.dae',
		'collision': false,
		'position': {
			'x': 105,
			'y': 20,
			'z': 80
		},
		'scale': 1.0,
		'rotate': {
			'x' : 0,	//rotate right/left
			'y' : 0,		//flip
			'z' : 180	//flip forward/backward
		}
	};
	var loadBin = {
		'modelPath': 'models/bin.dae',
		'collision': false,
		'position': {
			'x': 0,
			'y': 0,
			'z': 2
		},
		'scale': 10.0,

	};
	var loadTv = {
		'modelPath': 'models/tv.dae',
		'collision': false,
		'position': {
			'x': 0,
			'y': 5,
			'z': 50
		},
		'scale': 1.0
	};
	var loadLivingRoom = {
		'modelPath': 'models/livingroom.dae',
		'collision': true,
		'position': {
			'x': +80,
			'y': -50,
			'z': 0
		},
		'scale': 1.0
	};
	var loadTable = {
		'modelPath': 'models/smallTable.dae',
		'collision': false,
		'position': {
			'x': 0,
			'y': 5,
			'z': 50
		},
		'scale': 1.0
	};
	var loadTest = {
		'modelPath': 'models/roomtest.dae',
		'collision': false,
		'position': {
			'x': 0,
			'y': 5,
			'z': 0
		},
		'scale': 10.0
	};
	//loadModel(loadDesk);
	loadModel(loadLivingRoom);
	//loadModel(loadBin);
	//loadModel(loadWindow);
	//loadModel(loadTv);

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
function checkCollision(direction) {

	//get camera position and direction and store them into vector
	vectorPosition = camera.getWorldPosition();
	vectorDirection = camera.getWorldDirection();

	switch (direction) {
		case 'left'	 :
		case 'right' :		vectorCenter.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							vectorLeft.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							vectorRight.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							vectorTop.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							vectorBottom.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							break;

		case 'forward':		vectorCenter.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							vectorLeft.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							vectorRight.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							vectorTop.set(vectorPosition.x, vectorPosition.y-2, vectorPosition.z);
							vectorBottom.set(vectorPosition.x, vectorPosition.y+2, vectorPosition.z);
							break;

		case 'backward':	vectorCenter.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							vectorLeft.set(vectorPosition.x, vectorPosition.y, vectorPosition.z-1);
							vectorRight.set(vectorPosition.x, vectorPosition.y, vectorPosition.z+1);
							vectorTop.set(vectorPosition.x, vectorPosition.y-1, vectorPosition.z);
							vectorBottom.set(vectorPosition.x, vectorPosition.y+1, vectorPosition.z);
							break;
	}
	switch (direction) {
		case 'forward' :

							vectorCenterDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorLeftDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorRightDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorTopDirection.set(vectorDirection.x, vectorDirection.y-2, vectorDirection.z);
							vectorBottomDirection.set(vectorDirection.x, vectorDirection.y+2, vectorDirection.z);
							break;
		case 'backward':

							vectorCenterDirection.set(-1*vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorCenterDirection.applyAxisAngle(axisBackward, angleBackward);

							vectorLeftDirection.set(-1*vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorLeftDirection.applyAxisAngle(axisBackward, angleBackward);

							vectorRightDirection.set(-1*vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorRightDirection.applyAxisAngle(axisBackward, angleBackward);

							vectorTopDirection.set(-1*vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorTopDirection.applyAxisAngle(axisBackward, angleBackward);

							vectorTopDirection.set(-1*vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorTopDirection.applyAxisAngle(axisBackward, angleBackward);
							break;

		case 'left':
							vectorCenterDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z);
							//vectorCenterDirection.applyAxisAngle(axis1, angleLeft);
							vectorCenterDirection.applyAxisAngle(axis, angleLeft);

							vectorLeftDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z-2);
							vectorLeftDirection.applyAxisAngle(axis, angleLeft);
							//vectorLeftDirection.applyAxisAngle(axis, angleLeft);

							vectorRightDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z+2);
							vectorRightDirection.applyAxisAngle(axis, angleLeft);
							//vectorRightDirection.applyAxisAngle(axis, angleLeft);

							vectorTopDirection.set(vectorDirection.x, vectorDirection.y-2, vectorDirection.z);
							vectorTopDirection.applyAxisAngle(axis, angleLeft);
							//vectorTopDirection.applyAxisAngle(axis, angleLeft);

							vectorBottomDirection.set(vectorDirection.x, vectorDirection.y+2, vectorDirection.z);
							vectorBottomDirection.applyAxisAngle(axis, angleLeft);
							//vectorBottomDirection.applyAxisAngle(axis, angleLeft);
							break;
		case 'right':
							vectorCenterDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorCenterDirection.applyAxisAngle(axis, angleRight);

							vectorLeftDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z-5);
							vectorLeftDirection.applyAxisAngle(axis, angleRight);

							vectorRightDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z+5);
							vectorRightDirection.applyAxisAngle(axis, angleRight);

							vectorTopDirection.set(vectorDirection.x, vectorDirection.y+5, vectorDirection.z);
							vectorTopDirection.applyAxisAngle(axis, angleRight);

							vectorBottomDirection.set(vectorDirection.x, vectorDirection.y-5, vectorDirection.z);
							vectorBottomDirection.applyAxisAngle(axis, angleRight);
							break;
	}



	// Set up raycaster and shoot arrays to five directions. left, center, right, top and bottom
	raycaster = new THREE.Raycaster(vectorCenter, vectorCenterDirection.normalize());
	raycasterLeft = new THREE.Raycaster(vectorLeft, vectorLeftDirection.normalize());
	raycasterRight = new THREE.Raycaster(vectorRight, vectorRightDirection.normalize());
	raycasterTop = new THREE.Raycaster(vectorTop, vectorTopDirection.normalize());
	raycasterBottom = new THREE.Raycaster(vectorBottom, vectorBottomDirection.normalize());


	//check if there is any collision with the objects stored in the modelsCollision array
	var allIntersects = [];
	var intersects = raycaster.intersectObjects( modelsCollision, true );
	var intersectsLeft = raycasterLeft.intersectObjects( modelsCollision, true );
	var intersectsRight = raycasterRight.intersectObjects( modelsCollision, true );
	var intersectsTop = raycasterTop.intersectObjects( modelsCollision, true );
	var intersectsBottom = raycasterBottom.intersectObjects( modelsCollision, true );
	allIntersects.push(intersects, intersectsLeft, intersectsRight, intersectsTop, intersectsBottom);
	var flag = 0;
	for (var i = 0; i < allIntersects.length; i++) {
		if (allIntersects[i].length != 0) {


			if (allIntersects[i][0].distance < 25.0) {
				console.log(direction);
				return true;
			}
		}
	}
	return false;
}
function pressKey(e) {

	switch ( e.keyCode ) {
		case 38: /*up*/
		case 87: /*W*/ 	console.log("i am checking");
						if (checkCollision('forward') == true) {
				        	console.log('dont move!');
							controls.moveForward = false;
				        } else {
				        	controls.moveForward = true;
				        }
				        break;

		case 37: /*left*/
		case 65: /*A*/ controls.moveLeft = true; break;

		case 40: /*down*/
		case 83: /*S*/ 	/*if (checkCollision('backward') == true) {
				        	console.log('dont move!');
							controls.moveBackward = false;
				        } else {
				        	controls.moveBackward = true;
				        }*/
				        controls.moveBackward = true;
				        break;


		case 39: /*right*/
		case 68: /*D*/ controls.moveRight = true; break;

		case 82: /*R*/ controls.moveUp = true; break;
		case 70: /*F*/ controls.moveDown = true; break;
	}
}

function rotateModel(rotate) {
	console.log(rotate);
	var degreeX = (rotate.x * Math.PI)/180;
	var degreeY = (rotate.y * Math.PI)/180;
	var degreeZ = (rotate.z * Math.PI)/180;

	var rotate1 = {
		'x' : degreeX,
		'y' : degreeY,
		'z' : degreeZ
	}
	return rotate1;

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
		'showLight' : {      // what is this?
			'size': 1,
			'color' : 0x404040
		},
		'skyColor' : 0xffffbb,    // Optional: HemisphereLight
		'groundColor' : 0x080820  // Optional: HemisphereLight
	};

	var AmbientLight = { // works well
		'type' : 'AmbientLight',
		'color' : 0xff0000,
		'intensity' : 2
	}

	var PointLight = { // works without if statements
		'type' : 'PointLight',
        'color' : 0xff0000,
		'distance' : 50,
		'decay' : 2,
        'position' : {
            'x' : 0,
            'y' : -20,
            'z' : 50
        }


	}

	var DirectionalLight = {
		'type' : 'DirectionalLight',
		'color' : 0xff0000,
		'intensity' : 5,
		'size' : 2,
		'position' : { //why doesn't target work???
			'x' : 0,
			'y' : 100,
			'z' : 0
		},
		'target' : {
			'x' : 0,
			'y' : 100,
			'z' : 0
		}
	}
	var HemisphereLight = {  // works
		'type' : 'HemisphereLight',
		'skyColor' : 0xff0000,
		'groundColor' : 0x0000FF,
		'intensity' : 1,
		'size' : 2
	}

	var SpotLight = { // needs fix with position
		'type' : 'SpotLight',
		'color' : 0xffffff ,
		'intensity' : 10,
		'distance' : 200,
		'position' : {
			'x' : 0,
			'y' : 80,
			'z' : 50
		},
		'angle' : Math.PI/4
		//'position' : { // how do i set position?
		//	'x' : 0,
		//	'y' : 6,
		//	'z' : 1
		//}
	}

	//---------------------CREATE AND SET LIGHTS HERE------------------
	var PointLight1 = {
		'type' : 'PointLight',
		'distance' : 100,
		'size' : 10,
        'position' : {
            'x' : 40,
            'y' : 20,
            'z' : 100
        }
	}
	var PointLight2 = {
		'type' : 'PointLight',
		'distance' : 100,
		'size' : 10,
        'position' : {
            'x' : 40,
            'y' : 20,
            'z' : -100
        }
	}
	var PointLight3 = {
		'type' : 'PointLight',
		'distance' : 100,
		'size' : 10,
        'position' : {
            'x' : -170,
            'y' : 20,
            'z' : 100
        }
	}
	var PointLight4 = {
		'type' : 'PointLight',
		'distance' : 100,
		'size' : 10,
        'position' : {
            'x' : -170,
            'y' : 20,
            'z' : -100
        }
	}
	var AmbientLight = { // works well
		'type' : 'AmbientLight',
		'intensity' : 0.01
	}
	createLight(PointLight1);
	createLight(PointLight2);
	createLight(PointLight3);
	createLight(PointLight4);
	createLight(AmbientLight);
}

function createLight(lightParam) {
	var light = prepareLightParameters(lightParam);
	console.log(light);
	switch (light.type) {
		case 'AmbientLight' :
									var lightComplete = new THREE.AmbientLight( light.color, light.intensity); // soft white light
									scene.add(lightComplete);
									break;

		case 'PointLight' :
									var lightComplete = new THREE.PointLight(light.color, light.intensity, light.distance, light.decay);
									lightComplete.position.set( light.position.x, light.position.y, light.position.z );
									scene.add(lightComplete);

									var sphereSize = light.size;
									var pointLightHelper = new THREE.PointLightHelper(lightComplete, sphereSize);
	                                scene.add(pointLightHelper);
	                                break;

        case "DirectionalLight":
        							var lightComplete = new THREE.DirectionalLight( light.color, light.intensity );
        							lightComplete.castShadow = light.castShadow;
        							lightComplete.position.set( light.position.x, light.position.y, light.position.z );


									/* Targeting doesn't work

									 if (light.target.hasOwnProperty('x')){
										console.log("set target pos");
										var targetObject = new THREE.Object3D();
										targetObject.position.set(-20, 20, -70);
										scene.add(targetObject);

										lightComplete.target = targetObject;
									} else {
										lightComplete.target = light.target.model;
									}*/
									scene.add( lightComplete);

									//As per DirectionalLight target three.js documentation add the target seperately in the scene.


									var directionalLightHelper = new THREE.DirectionalLightHelper( lightComplete, light.size, light.color );
									scene.add(directionalLightHelper);
									directionalLightHelper.update();
									break;

		case "HemisphereLight":
									var lightComplete = new THREE.HemisphereLight( light.skyColor, light.groundColor, light.intensity );
									lightComplete.position.set( light.position.x, light.position.y, light.position.z );
									scene.add( lightComplete );

									var sphereMeshSize = light.size;
									var hemisphereLightHelper = new THREE.HemisphereLightHelper( lightComplete, sphereMeshSize );
									scene.add( hemisphereLightHelper );
									break;

		case "SpotLight" :
									var lightComplete = new THREE.SpotLight( light.color, light.intensity, light.distance, light.angle, light.penumbra, light.decay );
									lightComplete.position.set(light.position.x, light.position.y, light.position.z);        // how do i set position?
									lightComplete.castShadow = light.castShadow;
									scene.add(lightComplete);

									var spotLightHelper = new THREE.SpotLightHelper( lightComplete );
									scene.add( spotLightHelper );
									break;
		//default :
								//	console.error("Wrong Light type provided");
									//break;

	}
}
function prepareLightParameters(lightObj){
/*var PointLight = { // works without if statements
		'type' : 'PointLight',
        'color' : 0xff0000,
		'distance' : 50,
		'decay' : 2,
        'position' : {
            'x' : 0,
            'y' : -20,
            'z' : 0
        }
	}*/
var PointLight = {
        "type" : "PointLight",
        "color" : 0xffffff,
        "intensity" : 1,
        "distance" : 0,
        "decay" : 1,
        "size" : 2,
        'position' : {
            'x' : 0,
            'y' : -20,
            'z' : 0
        }
};
var AmbientLight = { // works well
		'type' : 'AmbientLight',
		'color' : 0xffffff,
		'intensity' : 1
}
var DirectionalLight = {
		'type' : 'DirectionalLight',
		'color' : 0xffffff,
		'intensity' : 1,
		'size' : 2,
		'position' : {
			'x' : 0,
			'y' : 1,
			'z' : 0
		},
		'target' : {
			'x' : 0,
			'y' : 10,
			'z' : 10
		},
		'castShadow' : false
};
var HemisphereLight = {  // works
		'type' : 'HemisphereLight',
		'skyColor' : 0xffffff,
		'groundColor' : 0xffffff,
		'intensity' : 1,
		'size' : 2,
		'position': {
			'x' : 0,
			'y' : 1,
			'z' : 0
		}
	}
	var SpotLight = { // needs fix with position
		'type' : 'SpotLight',
		'color' : 0xffffff ,
		'intensity' : 1,
		'distance' : 100,
		'angle' :  Math.PI/3,
		'penumbra' : 0,
		'decay' : 1,
		'position' : {
			'x' : 0,
			'y' : -20,
			'z' : 0
		},
		'castShadow' : false,
		'shadowDarkness' : 0,
		'shadowCameraVisible' : false,
		'position' : {
			'x' : 0,
			'y' : 1,
			'z' : 0
		}
	}
    var lightDefArr = [];
    lightDefArr.push(PointLight,AmbientLight,DirectionalLight,HemisphereLight, SpotLight);

    var index = -2;

    for (var i = 0; i < lightDefArr.length; i++) {
        if (lightObj.type == lightDefArr[i].type) {
            index = i;
        }
    }

    //get array of properties of default(found) light object and user provided light object
    var foundLightProperties = Object.getOwnPropertyNames(lightDefArr[index]);
   	var userLightProperties = Object.getOwnPropertyNames(lightObj);

   	//create final light object which we are going to return
	var trackProperties = {};


	//variable which will hold the value of a final object property
	var value = "";

	/*push all default light properties to the final light object
	  create new object properties to final object from the default light object.
	  Under each new property create a new object and put the variables :
	  	'foundLightPos' : Holds the index position of the property in the default light object
	  	'value' : Holds the value of the parent property in the default light object

		structure e.g. trackProperties {
							'type' : {'foundLightPos' : 0, 'value' : 'SpotLight'}
							...
							...
							...
							'distance' : {'foundLightPos' : 4, 'value' : 100}
						}
	*/
	for (var x = 0; x < foundLightProperties.length; x++) {

		//create property and assign it an empty object
		trackProperties[foundLightProperties[x]] = {};

		/*go inside the empty object, create the property 'foundLightPos' and assign it the index
		position (see explanation above)*/
		trackProperties[foundLightProperties[x]].foundLightPos = x;

		/*create another property 'value' and assign it the value of the parent property in the
		default light object*/
		trackProperties[foundLightProperties[x]].value = lightDefArr[index][foundLightProperties[x]];
	}


	//Will hold the index position of a property of the default light object
	var trackIndex;

	/*
	  iterate the properties names of the light object (array of user properties).
	  At each iteration, get the index position of the user property name in the
	  default light properties array.

	  If the user property exists in the default light property names array,
			go inside the final object (trackProperties) already created property (by using the index position)
			and create the variable :
			  	'userLightPos' : Holds the index position of the property in the user light object

		  	In addition we will also change the property 'value' to hold the value of the parent property in the
		  	user light object


	  If it doesn't exist,
	  		create that property in the final object and assign it an empty object.
	  		Inside that object create the variables :
				'foundLightPos' : Set to -2 as this property does not exist in the default light object
	  			'userLightPos' : Holds the index position of the property in the user light object
				'value' : Holds the value of the parent property in the user light object
	 */
	for (i = 0; i < userLightProperties.length; i++) {
		trackIndex = foundLightProperties.indexOf(userLightProperties[i]);
		if (trackIndex != -1) {

			trackProperties[foundLightProperties[trackIndex]].userLightPos = i;
			trackProperties[foundLightProperties[trackIndex]].value = lightObj[foundLightProperties[trackIndex]]
		}else{
			trackProperties[userLightProperties[i]] = {};
			trackProperties[userLightProperties[i]].foundLightPos = -2;
			trackProperties[userLightProperties[i]].userLightPos = i;
			trackProperties[userLightProperties[i]].value = lightObj[userLightProperties[i]];
		}
	}
	/*
		Iterate final object properties. If inside a property the property 'userLightPos'
		does not exist (because the user light object didn't contain it), create the variables:
			'userLightPos' : Set to -2 as this property does not exist in the user light object
	 */
	var listTrackProperties = Object.getOwnPropertyNames(trackProperties)
	for (i = 0; i < listTrackProperties.length; i++){
		if (!trackProperties[listTrackProperties[i]].hasOwnProperty('userLightPos')) {
			trackProperties[listTrackProperties[i]].userLightPos = -2;
		}
	}

	var returnLight = {};
	for (i = 0; i < listTrackProperties.length; i++){
		returnLight[listTrackProperties[i]] = trackProperties[listTrackProperties[i]]['value'];
	}
	return returnLight;
}
