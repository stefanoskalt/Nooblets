// myJavaScriptFile.js
// Version: 3.0.
// Loading a 3D Model. Collada File Format.

/*----------------------------------START CONFIGURATION----------------------------------*/
	/*CAMERA*/
	var CAMERA_STARTING_X_POS = 0;
	var CAMERA_STARTING_Y_POS = 0;
	var CAMERA_STARTING_Z_POS = 0;

	/*DESCRIPTION*/
	var DESCRIPTION_DISTANCE_TRIGGER = 500.0;

	/*COLLISION*/
	var COLLISION_DISTANCE_TRIGGER = 25.0;

	/*INTERACTION*/
	var INTERACTION_DISTANCE_TRIGGER = 500.0;

	/*CROSSHAIRS*/
	//crosshairs' x and y size
	var CROSSHAIRS_X_SIZE = 0.01;
	var CROSSHAIRS_Y_SIZE = 0.01;
/*----------------------------------END CONFIGURATION----------------------------------*/

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
/*-----------------------START JUMP FUNCTIONALITY-----------------*/
/*var canJump = false;
var yVelocity = 0.0;
var yAcceleration = 7.0;*/
/*-----------------------END JUMP FUNCTIONALITY-----------------*/

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
var raycasterJump1;
var raycasterJump2;
var raycasterJump3;
var raycasterJump4;

/*------------------START INTERACTION FUNCTIONALITY------------------*/
var vectorInteraction = new THREE.Vector3();
var raycasterInteraction;
/*------------------END INTERACTION FUNCTIONALITY------------------*/

/*------------------START DESCRIPTION FUNCTIONALITY------------------*/
var vectorInteraction = new THREE.Vector3();
var raycasterDescription;
/*------------------END DESCRIPTION FUNCTIONALITY------------------*/
	// Stats information for our scene.
var stats;

// Declare the variables for items in our scene.
var clock = new THREE.Clock();

// Handles the mouse events.
var mouseOverCanvas;
var mouseDown;

// Manages controls.
var controls;


// Stores variables for Animation and 3D model.
// Stores the model loader.
var myColladaLoader;

// Store the model.
var myDaeFile;

//store array of models for collision
var modelsCollision = [];
//store array of models which have interaction
var modelsInteraction = [];
//store array of models which have descriptions
var modelsDescription = [];
//store array of models which can trigger animation of another model
var animationsTrigger = [];
//dictionary holding animations triggers
var animationsTriggerDictionary = [];


// Stores the animations.
var myDaeAnimations;
// Stores the key frame animations.
var keyFrameAnimations = [];
// The length of the key frame animations array.
var keyFrameAnimationsLength = 0;
// Stores the time for the last frame.
// Used to control animation looping.
var lastFrameCurrentTime = [];

//load xml file containing the descriptions for objects
xmlDoc = openDescriptionsFile();



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

	/*------------------START DESCRIPTION FUNCTIONALITY------------------*/
	//when the interaction key is pressed check if there is description
	//for the model the crosshairs is looking to
	docElement.addEventListener('keydown', function(e) {
	    	switch ( e.keyCode ) {
			case 69:	//E key
			case 101:	//e key
						checkDescription();
						checkInteraction();
						checkAnimationTriggers();

						break;

		}
    }, false);
	/*------------------END DESCRIPTION FUNCTIONALITY------------------*/

	/*------------------START JUMP FUNCTIONALITY-----------------*/
	/*docElement.onkeydown = function(e) {
		switch ( e.keyCode ) {
			case 32: //space key
				if(canJump){
					yVelocity = 2.5;
					camJump = false;
				}
		}
	}*/
	/*------------------END JUMP FUNCTIONALITY-----------------*/
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
	camera.position.set(CAMERA_STARTING_X_POS, CAMERA_STARTING_Y_POS, CAMERA_STARTING_Z_POS);

	// Set up the camera controls.
	controls = new THREE.FirstPersonControls(camera, document.getElementById('myDivContainer'));
	controls.movementSpeed = 200;
	controls.lookSpeed = 0.06;
	controls.activeLook = true;

	/*----------------------START JUMP FUNCTIONALITY------------------*/
	/*controls.noFly = false; //Cant Fly
	raycasterJump = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0,-1,0), 0, 10);*/
	/*----------------------END JUMP FUNCTIONALITY------------------*/


	// Start the scene.
	// ----------------

	// Now lets initialise the scene. Put things in it, such as meshes and lights.
	initScene();

	// Start rendering the scene.
	render();
}

function setCrosshairs() {
	var material = new THREE.LineBasicMaterial({ color: 0xAAFFAA });

	// crosshair size
	var x = CROSSHAIRS_X_SIZE, y = CROSSHAIRS_Y_SIZE;

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
}


// Initialise the scene.
function initScene() {

	//set the sky box of the environment
	setSkyBox(scene);

	//set crosshairs
	setCrosshairs();

	//load models
	loadAllModels();

	//load lights
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
	//vectorPosition = camera.getWorldPosition( cameraPosVector );

	//var log = document.getElementById('log');


	/*if (checkCollision('forward') == true) {
		controls.moveForward = false;
	}
	if (checkCollision('backward') == true) {
		controls.moveBackward = false;
	}*/

	var deltaTime = clock.getDelta();


	/*-------------------------START JUMP FUNCTIONALITY----------------*/
	/*
	//clear up and down movement
	controls.moveUp = false;
	controls.moveDown = false;
	*/
	/*-------------------------END JUMP FUNCTIONALITY----------------*/
	// Update the controls.
	controls.update(deltaTime);




	/*-------------------------START JUMP FUNCTIONALITY----------------*/
	/*
	//temp store of y position
	var tmpY = camera.position.y

	//Reset y position of the camera
	camera.position.y = tmpY;



	//update gravity
	raycasterJump.ray.origin.copy(camera.position);
	raycasterJump.ray.origin.y -= 5;
	var intersections = raycasterJump.intersectObjects(modelsCollision, true);

	//update y velocity
	//yVelocity = yVelocity - yAcceleration * deltaTime;

	//update camera. Comment below line to also enable fly
	camera.position.y = camera.position.y + yVelocity;

	if (intersections.length > 0) {
		//on land.. check if not moving up (e.g jump)
		if (camera.position.y < tmpY){
			camera.position.y = tmpY;
			canJump = true;
			yVelocity = 0.0;
		}
	} else {
		//above land, so cannot jump
		canJump = false;
	}

	/*-------------------------END JUMP FUNCTIONALITY------------------*/


	// Update the model animations.
	for ( var i = 0; i < keyFrameAnimations.length; i++ ) {
		// Get a key frame animation.

		//when an animation has loop, manually check if animation has ended
		if (keyFrameAnimations[i].currentTime.toFixed(1) == keyFrameAnimations[i].endTime.toFixed(1) && keyFrameAnimations[i].loop == true){

			keyFrameAnimations[i].stop();
			keyFrameAnimations[i].currentTime = 0;
			keyFrameAnimations[i].isPaused = true;
			keyFrameAnimations[i].isPlaying = false;
		}else{
			var animation = keyFrameAnimations[i];
			animation.update( deltaTime );
		}

	}

	// Check if need to loop animations. Call loopAnimations() after the
	// animation handler update.
	loopAnimations();


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
	// Update last frame current time.
    for ( var i = 0; i < keyFrameAnimations.length; i++ ) {
    	lastFrameCurrentTime[i] = keyFrameAnimations[i].currentTime;
    }
}






/**
 * Set Skybox for the world. A huge cube, where the camera is placed INSIDE it, and the cube' inside
 * sides are textured with pictures in such a way to simulate a real word
 */
function setSkyBox() {
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('models/skybox/Yokohama2/posx.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('models/skybox/Yokohama2/negx.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('models/skybox/Yokohama2/posy.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('models/skybox/Yokohama2/negy.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('models/skybox/Yokohama2/posz.jpg')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('models/skybox/Yokohama2/negz.jpg')
	}));
	for (var i = 0; i < 6; i++)
		materialArray[i].side = THREE.BackSide;
	var skyboxMaterial = new THREE.MeshFaceMaterial(materialArray);
	var skyboxGeom = new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1);
	var skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial);
	scene.add(skybox);
}




function loadModel(toLoadModelArray) {
	var toLoadModel;

	myColladaLoader = new THREE.ColladaLoader();
	myColladaLoader.options.convertUpAxis = true;

	myColladaLoader.load(toLoadModelArray['modelPath'], function(collada) {
		var rotate;

		// Here we store the model
		toLoadModel = collada.scene;



		/*--------------------------ANIMATION--------------------*/
		// Store the animations.

		myDaeAnimations = collada.animations;

		if (myDaeAnimations.length != 0){
			// Store the number of animations.
			keyFrameAnimationsLength = myDaeAnimations.length;
		    // Initialise last frame current time.
		    for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
		    	lastFrameCurrentTime[i] = 0;
		    }

			// Get all the key frame animations.
			for ( var i = 0; i < keyFrameAnimationsLength; i++ ) {
				var animation = myDaeAnimations[ i ];
				if (toLoadModelArray['animation'].hasOwnProperty('length')){
					console.log("i have property");
					animation.length = toLoadModelArray['animation']['length'];
				}
				console.log(animation);
				var keyFrameAnimation = new THREE.KeyFrameAnimation( animation );

				keyFrameAnimation.timeScale = 1;
				keyFrameAnimation.loop = !toLoadModelArray['animation']['loop'];	//bug: loop : true acts as loop : false

				if (toLoadModelArray['animation'].hasOwnProperty('length')){
					console.log("i have property");
					keyFrameAnimation.data.length = toLoadModelArray['animation']['length'];
				}
				keyFrameAnimation.endTime = keyFrameAnimation.data.length;
				// Add the key frame animation to the keyFrameAnimations array.
				keyFrameAnimations.push( keyFrameAnimation );
			}
		}



		// Position your model in the scene (world space).
		toLoadModel.position.x = toLoadModelArray['position']['x'];
		toLoadModel.position.y = toLoadModelArray['position']['y'];
		toLoadModel.position.z = toLoadModelArray['position']['z'];



		//if rotate property exists, rotate model
		if (toLoadModelArray['rotate']) {
			rotate = rotateModel(toLoadModelArray['rotate']);
			toLoadModel.rotation.x = rotate.x;
			toLoadModel.rotation.y = rotate.y;
			toLoadModel.rotation.z = rotate.z;
		}


		/*----------Set name for object/s------------*/
		if (toLoadModelArray['name']) {
			toLoadModel.name = toLoadModelArray['name'];
			for(var i = 0; i < toLoadModel.children.length; i++) {
				toLoadModel.children[i].name = toLoadModelArray['name'];
			}
		}


		// Scale your model to the correct size.
		toLoadModel.scale.x = toLoadModel.scale.y = toLoadModel.scale.z = toLoadModelArray['scale'];
		toLoadModel.updateMatrix();

		//if collision is set to true, then push the object to array holding
		//objects which have collision
		if (toLoadModelArray['collision'] == true) {
			modelsCollision.push(toLoadModel);
		}
		if (toLoadModelArray['interaction'] == true) {
			modelsInteraction.push(toLoadModel);
		}
		if (toLoadModelArray['description'] == true) {
			modelsDescription.push(toLoadModel);
		}
		if (toLoadModelArray['trigger']) {
			if (toLoadModelArray['trigger']['animationTrigger']) {
				animationsTrigger.push(toLoadModel);
				var localAnimationTrigger = {
					'origin': toLoadModelArray['name'],
					'target': toLoadModelArray['trigger']['animationTrigger']
				}
				animationsTriggerDictionary.push(localAnimationTrigger);
			}
		}
		// Add the model to the scene.
		scene.add(toLoadModel);

		// Start the animation if the autoplay property is set to true
		if(toLoadModelArray['animation']) {
			if(toLoadModelArray['animation']['autoplay'] == true) {
				startAnimations("play", toLoadModelArray['name']);
			}
		}
	});
}
// Start the animations.
async function startAnimations(mode, name){
	var i;
	console.log(keyFrameAnimations);
	for(i = 0; i < keyFrameAnimations.length; i++) {
		if (keyFrameAnimations[i].root.name == name || keyFrameAnimations[i].root.parent.name == name){
			//exit loop, store index position to variable i
			break;
		}
	}


	//play animation from the beginning (usually runs once when the animation is triggered)
	if (mode == "play" && !keyFrameAnimations[i].isPlaying){
		console.log("start animation");
		var animation = keyFrameAnimations[i];
		animation.play();
		/*animation.timeScale = 0.4;
		await sleep(2000);
		animation.timeScale = animation.timeScale+0.2;
		await sleep(1000);
		animation.timeScale = animation.timeScale+0.2;
		await sleep(1000);
		animation.timeScale = animation.timeScale+0.2;
				//animation.timeScale = 1.0;*/


	//pause animation
	} else if (mode == "pause" && keyFrameAnimations[i].isPlaying == true &&
		keyFrameAnimations[i].isPaused == false){
		console.log("pause animation");
		var animation = keyFrameAnimations[i];
		if (animation.loop == false){
			/*if (animation.timeScale < 0.4){
				animation.stop();
			} else {
				animation.timeScale = animation.timeScale-0.2;			//
				await sleep(2000);
				animation.timeScale = animation.timeScale-0.15;
				await sleep(2000);
				animation.timeScale = animation.timeScale-0.15;
				await sleep(2000);
				animation.timeScale = animation.timeScale-0.1;
				await sleep(2000);
				animation.timeScale = animation.timeScale-0.1;
				await sleep(2000);
				animation.timeScale = animation.timeScale-0.08;
				await sleep(1000);
				animation.stop();
			}*/
			animation.stop();

		}


	//resume animation from the time when it was paused
	} else if (mode == "pause" && !keyFrameAnimations[i].isPlaying){
		console.log("resume animation");
		var animation = keyFrameAnimations[i];
		animation.play(animation.currentTime);
	}

}


// Manually loop the animations.
function loopAnimations(){
	// Loop through all the animations.
	for ( var i = 0; i < keyFrameAnimations.length; i++ ) {
		// Check if the animation is player and not paused.
		if(keyFrameAnimations[i].isPlaying && !keyFrameAnimations[i].isPaused){
			if(keyFrameAnimations[i].currentTime == lastFrameCurrentTime[i]) {
					keyFrameAnimations[i].stop();
					keyFrameAnimations[i].play();
					lastFrameCurrentTime[i] = 0;


			}
		}

	}
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
function checkAnimationTriggers() {
	//shoot ray to where camera is pointing
	var localRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
	localRaycaster.ray.origin.copy(camera.position);
	localRaycaster.ray.direction.copy(camera.getWorldDirection());

	//get intersected objects
	var localIntersections = localRaycaster.intersectObjects(animationsTrigger, true);
	//prepare to update log
	var log = document.getElementById('log3');
	if (localIntersections.length > 0) {
		if (localIntersections[0].distance < INTERACTION_DISTANCE_TRIGGER) {
			//holds name of intersected object
			var parentModelName;
			parentModelName = localIntersections[0].object.parent.parent.name;

			var targetName;
			targetName = getDictionaryTargetName(animationsTriggerDictionary, parentModelName);
			//update log on the right corner of the screen with the description
			startAnimations("pause", targetName);
			log.innerHTML = "Trigger animation of: " + targetName;
			//console.log('INTERACTION');
			return true;
		}
	}

	//otherwise reset log as no description was found
	log.innerHTML = "";

	return false;
}
function checkInteraction() {
	//shoot ray to where camera is pointing
	raycasterInteraction = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
	raycasterInteraction.ray.origin.copy(camera.position);
	raycasterInteraction.ray.direction.copy(camera.getWorldDirection());

	//get intersected objects
	var localIntersections = raycasterInteraction.intersectObjects(modelsInteraction, true);

	//prepare to update log
	var log = document.getElementById('log1');
	if (localIntersections.length > 0) {
		if (localIntersections[0].distance < INTERACTION_DISTANCE_TRIGGER) {
			//holds name of intersected object
			var parentModelName;
			parentModelName = localIntersections[0].object.parent.parent.name;

			//update log on the right corner of the screen with the description
			startAnimations("pause", parentModelName);
			log.innerHTML = "Animation of : " + parentModelName;
			//console.log('INTERACTION');
			return true;
		}
	}

	//otherwise reset log as no description was found
	log.innerHTML = "";

	return false;
}
/**
 * Check if description is available for an object held in modelsDescription array
 * @return {boolean} If description is avaiable return true, otherwise return false
 */
function checkDescription() {
	//shoot ray to where camera is pointing
	raycasterDescription = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
	raycasterDescription.ray.origin.copy(camera.position);
	raycasterDescription.ray.direction.copy(camera.getWorldDirection());

	//get intersected objects
	var intersectionsInteraction = raycasterDescription.intersectObjects(modelsDescription, true);

	//prepare to update log
	var log = document.getElementById('log2');
	if (intersectionsInteraction.length > 0) {
		if (intersectionsInteraction[0].distance < DESCRIPTION_DISTANCE_TRIGGER) {

			//holds name of intersected object
			var parentModelName;
			parentModelName = intersectionsInteraction[0].object.parent.parent.name;

			//holds the description retrieved from the xml database
			var localDescription = "";
			localDescription = getDescription(xmlDoc, parentModelName);

			//update log on the right corner of the screen with the description
			log.innerHTML = "Description: " + localDescription;
			return true;
		}
	}

	//otherwise reset log as no description was found
	log.innerHTML = "";
	return false;
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
							vectorTop.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
							vectorBottom.set(vectorPosition.x, vectorPosition.y, vectorPosition.z);
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
							vectorTopDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z);
							vectorBottomDirection.set(vectorDirection.x, vectorDirection.y, vectorDirection.z);
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


			if (allIntersects[i][0].distance < COLLISION_DISTANCE_TRIGGER) {
				console.log(direction);
				return true;
			}
		}
	}
	return false;
}


function rotateModel(rotate) {
	//convert degrees to radians
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



function createLight(lightParam) {

	//load default and provided light, compare them, merge them
	//and return finalised light object with all properties filled
	var light = prepareLightParameters(lightParam);

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
		default :
									console.error("Error: Wrong Light type provided");
									break;

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


function getModelByName(arr, name){
	for(var i = 0; i < arr.length; i++){
		if (arr[i].name == name){
			return arr[i];
		}
	}
	return -1;
}
function getDictionaryTargetName(arr, name){
	for(var i = 0; i < arr.length; i++){
		if (arr[i].origin == name){
			return arr[i].target;
		}
	}
	return -1;
}
