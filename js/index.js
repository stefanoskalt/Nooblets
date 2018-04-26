/*jslint browser: true */
/*global window */
/*global THREE */
/*global Stats */

/*----Xml file functions----*/
/*global getDialogue */
/*global checkPerson */
/*global checkDialogueIsRead */
/*global getListOfDialogueNames */
/*global getComplexModelsDialogue */
/*global isArrayIdentical */
/*global getDescription */
/*global openXmlFile */
/*---------------------------*/

/*global loadAllModels */
/*global loadAllLights */
/*global requestAnimationFrame */
/*----------------------------------START CONFIGURATION----------------------------------*/
/*CAMERA*/
var CAMERA_STARTING_X_POS = 0;
var CAMERA_STARTING_Y_POS = 30;
var CAMERA_STARTING_Z_POS = 0;

/*DESCRIPTION*/
var DESCRIPTION_DISTANCE_TRIGGER = 100.0;

/*COLLISION*/
var COLLISION_DISTANCE_TRIGGER = 25.0;

/*INTERACTION*/
var INTERACTION_DISTANCE_TRIGGER = 100.0;

/*JUMP*/
var JUMP_HEIGHT = 1.5;
var JUMP_NORMAL_WALK_HEIGHT = 25;
/*CROSSHAIRS*/
//crosshairs' x and y size
var CROSSHAIRS_X_SIZE = 0.01;
var CROSSHAIRS_Y_SIZE = 0.01;
/*----------------------------------END CONFIGURATION----------------------------------*/



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
var canJump = false;
var yVelocity = 0.0;
var yAcceleration = 2.5;
/*-----------------------END JUMP FUNCTIONALITY-----------------*/

var cameraPosition = {
    x: 500.0,
    y: 500.0,
    z: 500.0
};
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
var axis = new THREE.Vector3(0, 0, 1);
var axis1 = new THREE.Vector3(0, 0, 1);
var axisBackward = new THREE.Vector3(1, 0, 0);
var angleLeft = Math.PI / 6;
var angleRight = Math.PI / 2;
var angleBackward = Math.PI;
var raycasterJump;
var raycasterJump2;
var raycasterJump3;
var raycasterJump4;

/*------------------START INTERACTION FUNCTIONALITY------------------*/
var raycasterInteraction;
/*------------------END INTERACTION FUNCTIONALITY------------------*/

/*------------------START DESCRIPTION FUNCTIONALITY------------------*/
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
//store array of models which have conversations available
var modelsConversation = [];
//store animation information such as, play part of an animation
var animationsInfo = [];
//store array of models which can trigger animation of another model
var animationsTrigger = [];
//dictionary holding animations triggers
var animationsTriggerDictionary = [];
//array of read complex conversations
var complexConversations = [];

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
var xmlDescriptions = openXmlFile("descriptions.xml");
var xmlConversations = openXmlFile("conversations.xml");




/**
 * retrieve the index of an object stored in an array based on a property value
 * @param  {array} arr              array of objects we want to loop through to find the object we want
 * @param  {string} property        name of the property we want to search for in the object
 * @param  {variable type} value    the value we want to check for in the object. It can be integer or string or double
 * @return {integer} i||-1          return either the index of the found object or -1 if the object was not found
 */
function getIndexOfPropertyInArr(arr, property, value) {
    "use strict";
    var i;

    //loop array of objects
    for (i = 0; i < arr.length; i += 1) {

        //check each object's provided variable property name with the provided value
        if (arr[i][property] === value) {
            //return index of the object in the array
            return i;
        }
    }

    //return -1 if no object was found
    return -1;
}

/**
 * Manually loop the animations
 */
function loopAnimations() {
    "use strict";
    // Loop through all the animations.
    var i;
    for (i = 0; i < keyFrameAnimations.length; i += 1) {
        // Check if the animation is player and not paused.
        if (keyFrameAnimations[i].isPlaying && !keyFrameAnimations[i].isPaused) {
            if (keyFrameAnimations[i].currentTime === lastFrameCurrentTime[i]) {
                keyFrameAnimations[i].stop();
                keyFrameAnimations[i].play();
                lastFrameCurrentTime[i] = 0;

            }
        }

    }
}


/**
 * Check collision for all objects held in modelsCollision array.
 * Send a ray, if it intersects an object, collision is detected with the object
 * @param  {string}     direction2      the direction we want to check collision in relation with the character
 *                                      e.g direction2 = "left" if we want to check collision at the left of the character
 * @return {boolean}    true || false   if a collision is detected return true, otherwise return false
 */
function checkCollision(direction2) {
    "use strict";
    //holds array of all intersections
    var allIntersects = [];
    var matrix = new THREE.Matrix4();
    matrix.extractRotation(camera.matrix);
    var direction;
    var raycaster1;
    var intersections1;

    //get camera position and direction and store them into vector
    //multiple redundunt programming lines. Needs refactoring fix
    switch (direction2) {

    case 'left':
        direction = new THREE.Vector3(-1, 0, 0);
        direction = direction.applyMatrix4(matrix);
        raycaster1 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 100);
        raycaster1.ray.origin.copy(camera.position);
        raycaster1.ray.direction.copy(direction);
        intersections1 = raycaster1.intersectObjects(modelsCollision, true);

        //push intersection to array to be checked later
        allIntersects.push(intersections1);
        break;

    case 'right':
        direction = new THREE.Vector3(1, 0, 0);
        direction = direction.applyMatrix4(matrix);
        raycaster1 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 100);
        raycaster1.ray.origin.copy(camera.position);
        raycaster1.ray.direction.copy(direction);
        intersections1 = raycaster1.intersectObjects(modelsCollision, true);
        allIntersects.push(intersections1);
        break;

    case 'forward':
        direction = new THREE.Vector3(0, 0, -1);
        direction = direction.applyMatrix4(matrix);
        raycaster1 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 100);
        raycaster1.ray.origin.copy(camera.position);
        raycaster1.ray.direction.copy(direction);
        intersections1 = raycaster1.intersectObjects(modelsCollision, true);
        allIntersects.push(intersections1);
        break;

    case 'backward':
        direction = new THREE.Vector3(0, 0, 1);
        direction = direction.applyMatrix4(matrix);
        raycaster1 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 100);
        raycaster1.ray.origin.copy(camera.position);
        raycaster1.ray.direction.copy(direction);
        intersections1 = raycaster1.intersectObjects(modelsCollision, true);
        allIntersects.push(intersections1);
        break;

    }


    //loop the allIntersects array, if any intersection happened with a distance of
    //less than the specified number return true, otheerwise return false
    var i;
    for (i = 0; i < allIntersects.length; i += 1) {
        if (allIntersects[i].length !== 0) {
            if (allIntersects[i][0].distance < COLLISION_DISTANCE_TRIGGER) {
                //debug which direction we had the collision. console.log(direction2);
                return true;
            }
        }
    }
    return false;
}


// The game timer (aka game loop). Called x times per second.
function render() {
    "use strict";
    // Here we control how the camera looks around the scene.
    controls.activeLook = false;
    if (mouseOverCanvas) {
        if (mouseDown) {
            controls.activeLook = true;
        }
    }


    /*Collision detection at four directions relative to the character*/
    if (checkCollision('forward') === true) {
        controls.moveForward = false;
    }
    if (checkCollision('backward') === true) {
        controls.moveBackward = false;
    }
    if (checkCollision('left') === true) {
        controls.moveLeft = false;
    }
    if (checkCollision('right') === true) {
        controls.moveRight = false;
    }

    var deltaTime = clock.getDelta();


    /*-------------------------START JUMP FUNCTIONALITY----------------*/
    //temp store of y position
    var tmpY = camera.position.y;

    //clear up and down movement
    controls.moveUp = false;
    controls.moveDown = false;

    /*-------------------------END JUMP FUNCTIONALITY----------------*/


    // Update the controls.
    controls.update(deltaTime);


    /*-------------------------START JUMP FUNCTIONALITY----------------*/
    //Reset y position of the camera
    camera.position.y = tmpY;

    //update gravity
    raycasterJump.ray.origin.copy(camera.position);
    raycasterJump.ray.origin.y -= JUMP_NORMAL_WALK_HEIGHT;
    var intersectionsJump = raycasterJump.intersectObjects(modelsCollision, true);

    //update y velocity
    yVelocity = yVelocity - yAcceleration * deltaTime;

    //update camera. Comment below line to also enable fly
    camera.position.y = camera.position.y + yVelocity;

    if (intersectionsJump.length > 0) {
        //on land.. check if not moving up (e.g jump)
        if (camera.position.y < tmpY) {
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
    var i;
    var animation;
    var flag = 0;
    var animationIndex;     //the index of the animation playing right now
    var animationClip;      //the array of clips for thee particular animation
    var clipNumber;         //the index of the clip it is playing now
    var timeDif;            //precision of animation clips length
    for (i = 0; i < keyFrameAnimations.length; i += 1) {
        // Get a key frame animation.
        animationIndex = getIndexOfPropertyInArr(animationsInfo, "name", keyFrameAnimations[i].root.name);
        if (animationIndex !== -1) {
            animationClip = animationsInfo[animationIndex];
            clipNumber = animationClip.clipPlaying;
            //increase precision of animation clips by allowing margin of error, of 0.030 seconds
            timeDif = keyFrameAnimations[i].currentTime - animationClip.clips[clipNumber][1];
            if (timeDif.toFixed(3) > 0.030 * -1) {
                keyFrameAnimations[i].stop();
                keyFrameAnimations[i].currentTime = 0;
                keyFrameAnimations[i].isPaused = true;
                keyFrameAnimations[i].isPlaying = false;
                //keyFrameAnimations[i].loop = false //Possible engine bug.
                if (clipNumber === animationClip.clips.length - 1.0) {
                    animationsInfo[animationIndex].clipPlaying = 0;
                } else {
                    animationsInfo[animationIndex].clipPlaying = clipNumber + 1.0;
                }
                flag = 1;
            }
        } else if (
            keyFrameAnimations[i].currentTime.toFixed(1) === keyFrameAnimations[i].endTime.toFixed(1) &&
            keyFrameAnimations[i].loop === true
        ) {
            //when an animation has loop, manually check if animation has ended

            keyFrameAnimations[i].stop();
            keyFrameAnimations[i].currentTime = 0;
            keyFrameAnimations[i].isPaused = true;
            keyFrameAnimations[i].isPlaying = false;
            flag = 2;
        }
        if (flag !== 2) {
            animation = keyFrameAnimations[i];
            animation.update(deltaTime);
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
    for (i = 0; i < keyFrameAnimations.length; i += 1) {
        lastFrameCurrentTime[i] = keyFrameAnimations[i].currentTime;
    }
}
/**
 * draws and places crosshairs to center of screen
 */
function setCrosshairs() {
    "use strict";

    var material = new THREE.LineBasicMaterial({
        //color of the crosshairs
        color: 0xAAFFAA
    });

    // crosshair size
    var x = CROSSHAIRS_X_SIZE;
    var y = CROSSHAIRS_Y_SIZE;

    var geometry = new THREE.Geometry();

    // draw crosshair
    geometry.vertices.push(new THREE.Vector3(0, y, 0));
    geometry.vertices.push(new THREE.Vector3(0, -y, 0));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(x, 0, 0));
    geometry.vertices.push(new THREE.Vector3(-x, 0, 0));

    var crosshair = new THREE.Line(geometry, material);

    // place it in the center
    var crosshairPercentX = 50;
    var crosshairPercentY = 50;
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

    crosshair.position.x = crosshairPositionX * camera.aspect;
    crosshair.position.y = crosshairPositionY;

    crosshair.position.z = -0.3;

    camera.add(crosshair);
    scene.add(camera);
}


/**
 * Set Skybox for the world. A huge cube, where the camera is placed INSIDE it, and the cube' inside
 * sides are textured with pictures in such a way to simulate a real word
 */
function setSkyBox() {
    "use strict";
    var materialArray = [];
    //place the pictures in the interior of the cube sides
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
    var i;
    for (i = 0; i < 6; i += 1) {
        materialArray[i].side = THREE.BackSide;
    }
    var skyboxMaterial = new THREE.MeshFaceMaterial(materialArray);
    var skyboxGeom = new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1);
    var skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial);
    scene.add(skybox);
}

/**
 * Start, pause, resume, stop the animations or clips
 * @param  {string} mode Depending on the mode, the animation can be played, paused, stopped, resumed
 * @param  {string} name The name of the object we want to control the animation
 */
function startAnimations(mode, name) {
    "use strict";

    //loop all the animations and search if an animation belongs to the object depending on its name
    var i;
    for (i = 0; i < keyFrameAnimations.length; i += 1) {
        if (keyFrameAnimations[i].root.name === name || keyFrameAnimations[i].root.parent.name === name) {
            //exit loop, store index position to variable i
            break;
        }
    }



    var animation = keyFrameAnimations[i];
    var animationIndex;                     //will hold the index of the animation clip we wish to control
    var animationClip;                      //will hold the array of clips for the particular animation (if it exists)
    var clipNumber;                         //will hold the index of the clip it is playing now

    //play animation from the beginning (usually runs once when the animation is triggered)
    if (mode === "play" && !keyFrameAnimations[i].isPlaying && keyFrameAnimations[i].currentTime === 0) {
        //console.log("start animation");
        //check if animation has clips
        animationIndex = getIndexOfPropertyInArr(animationsInfo, "name", keyFrameAnimations[i].root.name);

        //if it has clips, then retrieve the cclip array, the clipNumber and play the clip
        //otherwise play the animation as it is (without any clips)
        if (animationIndex !== -1) {
            animationClip = animationsInfo[animationIndex];
            clipNumber = animationClip.clipPlaying;
            animation.play(animationClip.clips[clipNumber][0]);
        } else {

            animation.play();
        }

    //pause animation
    } else if (keyFrameAnimations[i].isPlaying === true && keyFrameAnimations[i].isPaused === false) {

        //if an animation loop parameter is set to false, then we stop the animation
        if (animation.loop === false) {
            animation.stop();
        }


    //resume animation from the time when it was paused
    } else if (!keyFrameAnimations[i].isPlaying) {

        //check clips are avaialble for this animation
        animationIndex = getIndexOfPropertyInArr(animationsInfo, "name", keyFrameAnimations[i].root.name);
        //if true, play the next clip (set on render function), as clips cannot be paused,
        //otherwise resume animation from the time it was paused
        if (animationIndex !== -1) {
            animationClip = animationsInfo[animationIndex];
            clipNumber = animationClip.clipPlaying;
            animation.play(animationClip.clips[clipNumber][0]);
        } else {
            animation.play(animation.currentTime);
        }
    }

}



/**
 * Check if any model when interacted has the ability to trigger other object's animations
 *
 * @return {boolean} true || false Return true if a trigger exists, otherwise return false
 */
function checkAnimationTriggers() {
    "use strict";
    //shoot ray to where camera is pointing
    var localRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
    localRaycaster.ray.origin.copy(camera.position);
    localRaycaster.ray.direction.copy(camera.getWorldDirection());

    //get intersected objects
    var localIntersections = localRaycaster.intersectObjects(animationsTrigger, true);

    if (localIntersections.length > 0) {
        if (localIntersections[0].distance < INTERACTION_DISTANCE_TRIGGER) {
            //holds name of intersected object
            var parentModelName;
            parentModelName = localIntersections[0].object.parent.parent.name;

            //get index of  intersected object's name in the trigger animation array
            var index = -1;
            index = getIndexOfPropertyInArr(animationsTriggerDictionary, "origin", parentModelName);

            //from the returned index, we retrieve the name of the animation we want to trigger
            var targetName = animationsTriggerDictionary[index].target;

            //trigger another object's animation
            startAnimations("pause", targetName);
            return true;
        }
    }


    return false;
}

/**
 * hide the message, located in the left of the screen, showing a description
 * or conversation
 */
function closeMessage() {
    "use strict";
    var messageWindow = document.getElementById('conversationContainer');

    /* only way of switching visibility status is by switching html classes
    if the current class is visible, we add the 'notVisible' class and
    remove the 'visible' class */
    if (messageWindow.classList.contains("visible")) {
        messageWindow.classList.add('notVisible');
        messageWindow.classList.remove('visible');
    }
}

/**
 * show a message, to be located in the left of the screen, showing a description
 * or a conversation
 * @param  {obj :   {string}    "type"
                    {string}    "origin"
                    {string}    "message"} obj Holds 3 properties. The 'type' property specifies which font and if
                                                any quotes will be used at the message. The origin, is the title of
                                                the message. The is the content of the message to be showns
 */
function showMessage(obj) {
    "use strict";
    var person;             //will hold the html element where the title of the message will be shown
    var conversationText;   //will hold the html element where the message content will be shown

    if (obj.type === "description") {
        //title
        person = document.getElementById('person');
        person.innerHTML = obj.origin;

        //content
        conversationText = document.getElementById('conversationText');
        conversationText.innerHTML = obj.message;
        conversationText.style.fontStyle = "normal";                    //reset message content fontStyle to normal from italic

    } else if (obj.type === "conversation") {
        //title
        person = document.getElementById('person');
        person.innerHTML = obj.origin;

        //content
        conversationText = document.getElementById('conversationText');
        conversationText.innerHTML = '"' + obj.message + '"';           //put the content inside quotes to signify a conversation
        conversationText.style.fontStyle = "italic";                    //set message content fontStyle to italic
    }


    /* only way of switching visibility status is by switching html classes
    if the current class is not visible, we add the 'visible' class and
    remove the default 'notVisible' class */
    var messageWindow = document.getElementById('conversationContainer');
    if (messageWindow.classList.contains("notVisible")) {
        messageWindow.classList.add('visible');
        messageWindow.classList.remove('notVisible');
    }
}


/**
 * check if there is any conversation available with a character by searching the
 * conversation xml database. If there is, call a function to show a message with it
 *
 * @param  {obj : {string} name} obj contains just the name property which is a string. The property
 *                                   holds the name of the model we have interacted with
 */
function checkConversation(obj) {
    "use strict";
    var name = obj.name;
    var count = 0;
    var flag = "[default]";     //will hold the combination of interated items which have conversation
    var returnValue;
    var objToShowConvo = {
        "type": "conversation", //specifies what type of text the message is going to be (description/conversation)
        "origin": name,         //specifies the title of the message
        "message": ""           //holds the content of the message
    };

    var hasConversation;        //will hold a boolean value about whether the model has conversation available
    var dialogue;               //will hold the content of the model
    var i;

    //check if the name of the interacted object is a person which has conversations
    if (checkPerson(xmlConversations, name)) {
        //loop through all the interactable models
        for (i = 0; i < modelsInteraction.length; i += 1) {
            //check if an interactable model has conversation
            hasConversation = getIndexOfPropertyInArr(modelsConversation, "uniqueID", modelsInteraction[i].uniqueID);

            //if it has conversation available and it was previously interacted by the user,
            //then we want to show its conversation
            if (modelsInteraction[i].interactedByUser === true && hasConversation !== -1) {

                //at the first found model, assign it to the flag variable
                if (flag === "[default]") {
                    flag = modelsInteraction[i].uniqueID;
                } else {
                    //if more items are found then concatenate the strings, seperated by "+"
                    flag = flag + "+" + modelsInteraction[i].uniqueID;
                }

                //check if an interactable had its conversation read by the user, and that its name is not 'Witness'
                if (modelsInteraction[i].conversationRead === false && modelsInteraction[i].uniqueID !== "Witness") {
                    //retrieve the dialogue from the conversations.xml file
                    dialogue = getDialogue(xmlConversations, name, modelsInteraction[i].uniqueID);

                    //set conversationRead property to true
                    modelsInteraction[i].conversationRead = true;

                    //assign the dialogue to the object message property we will use to show the message
                    objToShowConvo.message = dialogue;
                    break;

                }

                //if a conversation has been read, and it has a conversation then increament the counter
                if (modelsInteraction[i].conversationRead === true && hasConversation !== -1) {
                    //see below
                    count += 1;
                }

                //If all clues conversations were read then start showing combination conversations
                //-1 to account for 1 conversation being a person
                if (count === modelsConversation.length - 1) {

                    //holds the complex dialogue
                    returnValue = getComplexModelsDialogue(xmlConversations, name, flag.split("+"));

                    //check that the value is correct
                    if (returnValue !== "Error") {

                        //check that the complex conversation was not previously shown to the user
                        if (!complexConversations.includes(returnValue)) {

                            //assign dialogue to the object we ware going to send to showMessage function
                            objToShowConvo.message = returnValue;

                            //push the string dialogue to an array to show that the user has already read it
                            complexConversations.push(returnValue);
                            break;
                        }
                    }
                }
            } else {
                //if no clues were discovered then show a default string
                objToShowConvo.message = "I have nothing to say at the moment. Maybe come back later";
            }
        }
    }
    if (objToShowConvo.message !== "") {
        //show a message with the conversation
        showMessage(objToShowConvo);
    }


    //Ending. Check if the interacted clues match the total clues
    var countCorrect = 0;
    var totalClues = 0;

    for (i = 0; i < modelsInteraction.length; i += 1) {

        if ((modelsInteraction[i].clue === true) && (modelsInteraction[i].interactedByUser === true)) {
            countCorrect += 1;

        }
        if (modelsInteraction[i].clue === true) {
            totalClues += 1;

        }
    }

    if (countCorrect === totalClues) {
        var messageWindowEnd = document.getElementById('endingContainer');
        if (messageWindowEnd.classList.contains("notVisible")) {
            messageWindowEnd.classList.add('visible');
            messageWindowEnd.classList.remove('notVisible');
        }
    }

}


/**
 * check if there is any interaction with an object on front of us.
 * If there is, check for animation and start it, check for conversation
 *
 * @return {boolean} true || false if there is interaction return true, otherwise return false
 */
function checkInteraction() {
    "use strict";
    //shoot ray to where camera is pointing
    raycasterInteraction = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
    raycasterInteraction.ray.origin.copy(camera.position);
    raycasterInteraction.ray.direction.copy(camera.getWorldDirection());

    //get intersected objects
    var localIntersections = raycasterInteraction.intersectObjects(modelsInteraction, true);
    var parentModelName;
    var interactionIndex;
    var animationIndex;
    if (localIntersections.length > 0) {
        if (localIntersections[0].distance < INTERACTION_DISTANCE_TRIGGER) {
            //holds name of intersected object
            parentModelName = localIntersections[0].object.parent.parent.name;

            //set interacted by user object property to true
            interactionIndex = getIndexOfPropertyInArr(modelsInteraction, "uniqueID", parentModelName);
            if (interactionIndex !== -1) {
                if (modelsInteraction[interactionIndex].interactedByUser === false) {
                    modelsInteraction[interactionIndex].interactedByUser = true;
                }
                var obj = {
                    "name": parentModelName
                };
                //check if the object has conversation
                checkConversation(obj);
            }

            //check if an object has animation
            animationIndex = getIndexOfPropertyInArr(animationsInfo, "name", parentModelName);
            if (animationIndex !== -1) {
                //play animation
                startAnimations("play", parentModelName);
            }
            return true;
        }
    }
    return false;
}

/**
 * Check if description is available for an object held in modelsDescription array
 * @return {boolean} If description is avaiable return true, otherwise return false
 */
function checkDescription() {
    "use strict";
    //shoot ray to where camera is pointing
    raycasterDescription = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3());
    raycasterDescription.ray.origin.copy(camera.position);
    raycasterDescription.ray.direction.copy(camera.getWorldDirection());

    //get intersected objects
    var intersectionsInteraction = raycasterDescription.intersectObjects(modelsDescription, true);
    if (intersectionsInteraction.length > 0) {
        if (intersectionsInteraction[0].distance < DESCRIPTION_DISTANCE_TRIGGER) {

            //holds name of intersected object
            var parentModelName;
            parentModelName = intersectionsInteraction[0].object.parent.parent.name;

            //holds the description retrieved from the xml database
            var localDescription = "";
            localDescription = getDescription(xmlDescriptions, parentModelName);
            var obj = {
                "type": "description",
                "origin": parentModelName,
                "message": localDescription
            };
            showMessage(obj);
            return true;
        }
    }

    return false;
}



/**
 * Handles the resizing functionality of the canvas. Normally the canvas would not
 * resize if the browser window resized. With this function the canvas will also resize
 */
function resizeViewport() {
    "use strict";
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Initialise the scene.
function initScene() {
    "use strict";
    //set the sky box of the environment
    setSkyBox(scene);

    //set crosshairs
    setCrosshairs();

    //load models
    loadAllModels();

    //load lights
    loadAllLights();

}

// Initialise three.js.
function init() {
    "use strict";
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

    window.addEventListener('resize', function () {
        resizeViewport(renderer);
    });
    // Set the clear colour.
    renderer.setClearColor("rgb(135,206,250)");

    // Add an event to set if the mouse is over our canvas.
    renderer.domElement.onmouseover = function () {
        mouseOverCanvas = true;
    };
    renderer.domElement.onmousemove = function () {
        mouseOverCanvas = true;
    };
    renderer.domElement.onmouseout = function () {
        mouseOverCanvas = false;
    };
    renderer.domElement.onmousedown = function () {
        mouseDown = true;
    };
    renderer.domElement.onmouseup = function () {
        mouseDown = false;
    };

    /*------------------START DESCRIPTION FUNCTIONALITY------------------*/
    //when the interaction key is pressed check if there is description
    //for the model the crosshairs is looking to
    docElement.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
        case 69: //E key
        case 101: //e key
            checkDescription();
            checkInteraction();
            checkAnimationTriggers();
            break;

        case 70: //F key
        case 102: //f key
            closeMessage();
            break;

        case 82:    //R key
        case 114:   //r key
            location.reload(true);
            break;
        }
    }, false);
    /*------------------END DESCRIPTION FUNCTIONALITY------------------*/

    /*------------------START JUMP FUNCTIONALITY-----------------*/
    docElement.onkeydown = function (e) {
        switch (e.keyCode) {
        case 32: //space key
            if (canJump) {
                yVelocity = JUMP_HEIGHT;
                canJump = false;
            }
            break;
        }
    };
    /*------------------END JUMP FUNCTIONALITY-----------------*/
    // Stats.
    // ------
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    stats.domElement.style.pointerEvents = "none";
    docElement.appendChild(stats.domElement);

    // Scene.
    // ------

    // Create a WebGl scene.
    scene = new THREE.Scene();

    // Camera.
    // -------

    // Create a WebGl camera.
    camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT_RATIO,
        NEAR_CLIPPING_PLANE,
        FAR_CLIPPING_PLANE
    );

    // Set the position of the camera.
    // The camera starts at 0,0,0 ...so pull it back.
    camera.position.set(CAMERA_STARTING_X_POS, CAMERA_STARTING_Y_POS, CAMERA_STARTING_Z_POS);

    // Set up the camera controls.
    controls = new THREE.FirstPersonControls(camera, document.getElementById('myDivContainer'));
    controls.movementSpeed = 200;
    controls.lookSpeed = 0.10;
    controls.activeLook = true;

    /*----------------------START JUMP FUNCTIONALITY------------------*/
    controls.noFly = true; //Cant Fly
    raycasterJump = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 30);
    /*----------------------END JUMP FUNCTIONALITY------------------*/


    // Start the scene.
    // ----------------

    // Now lets initialise the scene. Put things in it, such as meshes and lights.
    initScene();

    // Start rendering the scene.
    render();
}

// Set the initialise function to be called when the page has loaded.
window.onload = init;



/**
 * converts rotate object from degrees to radians and returns it
 * @param  {object{x,y,z}} rotate object containing the rotation in x,y,z axis with degrees
 * @return {object{x,y,z}}        same object as passed but with values in radians
 */
function rotateModel(rotate) {
    "use strict";
    //convert degrees to radians
    var degreeX = (rotate.x * Math.PI) / 180;
    var degreeY = (rotate.y * Math.PI) / 180;
    var degreeZ = (rotate.z * Math.PI) / 180;

    var rotate1 = {
        'x': degreeX,
        'y': degreeY,
        'z': degreeZ
    };
    return rotate1;

}


/**
 * function to be called to load a model
 * @param  {object} toLoadModelArray object containing parameters for model to be loaded
 */
function loadModel(toLoadModelArray) {
    "use strict";
    var toLoadModel;
    myColladaLoader = new THREE.ColladaLoader();
    myColladaLoader.options.convertUpAxis = true;

    //use modelPath parameter to locate the model
    myColladaLoader.load(toLoadModelArray.modelPath, function (collada) {
        var rotate;

        // Here we store the model
        toLoadModel = collada.scene;



        /*--------------------------ANIMATION--------------------*/
        // Store the animations.
        var i;

        //check if 'animation' parameter was passed, else skip adding animations
        if (toLoadModelArray.animation) {
            myDaeAnimations = collada.animations;
            if (myDaeAnimations.length !== 0) {
                // Store the number of animations.
                keyFrameAnimationsLength = myDaeAnimations.length;
                // Initialise last frame current time.
                for (i = 0; i < keyFrameAnimationsLength; i += 1) {
                    lastFrameCurrentTime[i] = 0;
                }

                // Get all the key frame animations.
                var animation;
                var keyFrameAnimation;
                for (i = 0; i < keyFrameAnimationsLength; i += 1) {
                    animation = myDaeAnimations[i];
                    if (toLoadModelArray.animation.hasOwnProperty('length')) {
                        animation.length = toLoadModelArray.animation.length;
                    }

                    keyFrameAnimation = new THREE.KeyFrameAnimation(animation);
                    keyFrameAnimation.timeScale = 1;
                    keyFrameAnimation.loop = !toLoadModelArray.animation.loop; //engine bug: loop : true acts as loop : false

                    //if length property under animation property exists, set custom animation length
                    if (toLoadModelArray.animation.hasOwnProperty('length')) {
                        keyFrameAnimation.data.length = toLoadModelArray.animation.length;
                    }
                    keyFrameAnimation.endTime = keyFrameAnimation.data.length;

                    // Add the key frame animation to the keyFrameAnimations array.
                    keyFrameAnimations.push(keyFrameAnimation);
                }
            }
        }



        // Position your model in the scene (world space).
        toLoadModel.position.x = toLoadModelArray.position.x;
        toLoadModel.position.y = toLoadModelArray.position.y;
        toLoadModel.position.z = toLoadModelArray.position.z;



        //if rotate property exists, rotate model
        if (toLoadModelArray.rotate) {
            //convert passed degrees to radians. library requires radians
            rotate = rotateModel(toLoadModelArray.rotate);
            toLoadModel.rotation.x = rotate.x;
            toLoadModel.rotation.y = rotate.y;
            toLoadModel.rotation.z = rotate.z;
        }


        /*----------Set name for object/s------------*/
        //to be used to recognise object when spotted by rays
        toLoadModel.uniqueID = toLoadModelArray.name; //new functionality. Fix
        if (toLoadModelArray.name) {
            toLoadModel.name = toLoadModelArray.name;
            for (i = 0; i < toLoadModel.children.length; i += 1) {
                toLoadModel.children[i].name = toLoadModelArray.name;
            }
        }

        //set clue property to show if the model is to be considered a clue
        //if property is passed then uuse its value
        if (toLoadModelArray.hasOwnProperty('clue')) {
            toLoadModel.clue = toLoadModelArray.clue;

        //else create property clue with default value false
        } else {
            toLoadModel.clue = false;
        }


        // Scale model to the correct size. Supports, X,Y,Z axis or universal axis
        if (toLoadModelArray.hasOwnProperty('scaleX')) {
            toLoadModel.scale.x = toLoadModelArray.scaleX;
        }
        if (toLoadModelArray.hasOwnProperty('scaleY')) {
            toLoadModel.scale.y = toLoadModelArray.scaleY;
        }
        if (toLoadModelArray.hasOwnProperty('scaleZ')) {
            toLoadModel.scale.z = toLoadModelArray.scaleZ;
        }

        if (toLoadModelArray.hasOwnProperty('scale')) {
            toLoadModel.scale.x = toLoadModelArray.scale;
            toLoadModel.scale.y = toLoadModelArray.scale;
            toLoadModel.scale.z = toLoadModelArray.scale;
        }

        //update model position and size matrix
        toLoadModel.updateMatrix();


        //if collision is set to true, then push the object to array holding
        //objects which have collision
        if (toLoadModelArray.collision === true) {
            modelsCollision.push(toLoadModel);
        }

        //if interaction is set to true, then push the object to array holding
        //objects which have interaction
        if (toLoadModelArray.interaction === true) {
            //set properties, interactedByUser, and conversationRead to default to false
            toLoadModel.interactedByUser = false;
            toLoadModel.conversationRead = false;

            modelsInteraction.push(toLoadModel);
        }

        //if description is set to true, then push the object to array holding
        //objects which have description
        if (toLoadModelArray.description === true) {
            modelsDescription.push(toLoadModel);
        }

        //if conversation is set to true, then push the object to array holding
        //objects which have conversation
        if (toLoadModelArray.conversation === true) {
            modelsConversation.push(toLoadModel);
        }

        //if trigger property exists then check if the animationTrigger property under it
        //also exists and push the object to array holding animation triggers.
        //Also, pass a dictionary holding the origin and target of a trigger
        if (toLoadModelArray.trigger) {
            if (toLoadModelArray.trigger.animationTrigger) {
                animationsTrigger.push(toLoadModel);

                //create obj to pass for the trigger dictionary
                var localAnimationTrigger = {
                    'origin': toLoadModelArray.name,                        //model's name which triggers animation
                    'target': toLoadModelArray.trigger.animationTrigger     //model which will trigger its animation
                };
                animationsTriggerDictionary.push(localAnimationTrigger);
            }
        }

        // Add the model to the scene.
        scene.add(toLoadModel);




        //---------START ANIMATION FUNCTIONALITY----------//
        if (toLoadModelArray.animation) {

            //set clip functionality for playing parts of an animation
            if (toLoadModelArray.animation.hasOwnProperty('clips')) {
                var obj = {
                    "name": toLoadModelArray.name,              //name of animation
                    "clips": toLoadModelArray.animation.clips,  //array of clips e.g [[0, 0.5], [0.5, 1.0]]
                    "clipPlaying": 0                            //the clip to play first
                };
                animationsInfo.push(obj);
            }

            // Start the animation if the autoplay property is set to true
            if (toLoadModelArray.animation.autoplay === true) {
                startAnimations("play", toLoadModelArray.name);
            }
        }
    });
}

/**
 * Merge user provided and default properties and values
 */
function prepareLightParameters(lightObj) {
    "use strict";
    var PointLight = {
        "type": "PointLight",
        "color": 0xffffff,
        "intensity": 1,
        "distance": 0,
        "decay": 1,
        "size": 2,
        'position': {
            'x': 0,
            'y': -20,
            'z': 0
        }
    };
    var AmbientLight = { // works well
        'type': 'AmbientLight',
        'color': 0xffffff,
        'intensity': 1
    };
    var DirectionalLight = {
        'type': 'DirectionalLight',
        'color': 0xffffff,
        'intensity': 1,
        'size': 2,
        'position': {
            'x': 0,
            'y': 1,
            'z': 0
        },
        'target': {
            'x': 0,
            'y': 10,
            'z': 10
        },
        'castShadow': false
    };
    var HemisphereLight = { // works
        'type': 'HemisphereLight',
        'skyColor': 0xffffff,
        'groundColor': 0xffffff,
        'intensity': 1,
        'size': 2,
        'position': {
            'x': 0,
            'y': 1,
            'z': 0
        }
    };
    var SpotLight = { // needs fix with position
        'type': 'SpotLight',
        'color': 0xffffff,
        'intensity': 1,
        'distance': 100,
        'angle': Math.PI / 3,
        'penumbra': 0,
        'decay': 1,
        'position': {
            'x': 0,
            'y': -20,
            'z': 0
        },
        'castShadow': false,
        'shadowDarkness': 0,
        'shadowCameraVisible': false,
        'target': {
            'x': 0,
            'y': 1,
            'z': 0
        },
        'size': 0
    };
    var lightDefArr = [];
    lightDefArr.push(PointLight, AmbientLight, DirectionalLight, HemisphereLight, SpotLight);

    var index = -2;
    var i;
    for (i = 0; i < lightDefArr.length; i += 1) {
        if (lightObj.type === lightDefArr[i].type) {
            index = i;
        }
    }

    //get array of properties of default(found) light object and user provided light object
    var foundLightProperties = Object.getOwnPropertyNames(lightDefArr[index]);
    var userLightProperties = Object.getOwnPropertyNames(lightObj);

    //create final light object which we are going to return
    var trackProperties = {};


    /*push all default light properties to the final light object
      create new object properties to final object from the default light object.
      Under each new property create a new object and put the variables :
        'foundLightPos' : (redundant property)Holds the index position of the property in the default light object
        'value' : Holds the value of the parent property in the default light object

        structure e.g. trackProperties {
                            'type' : {'foundLightPos' : 0, 'value' : 'SpotLight'}
                            ...
                            ...
                            ...
                            'distance' : {'foundLightPos' : 4, 'value' : 100}
                        }
    */
    var x;
    for (x = 0; x < foundLightProperties.length; x += 1) {

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
    for (i = 0; i < userLightProperties.length; i += 1) {
        trackIndex = foundLightProperties.indexOf(userLightProperties[i]);
        if (trackIndex !== -1) {
            trackProperties[foundLightProperties[trackIndex]].userLightPos = i;
            trackProperties[foundLightProperties[trackIndex]].value = lightObj[foundLightProperties[trackIndex]];
        } else {
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
    var listTrackProperties = Object.getOwnPropertyNames(trackProperties);
    for (i = 0; i < listTrackProperties.length; i += 1) {
        if (!trackProperties[listTrackProperties[i]].hasOwnProperty('userLightPos')) {
            trackProperties[listTrackProperties[i]].userLightPos = -2;
        }
    }

    var returnLight = {};
    for (i = 0; i < listTrackProperties.length; i += 1) {
        returnLight[listTrackProperties[i]] = trackProperties[listTrackProperties[i]].value;
    }
    return returnLight;
}



function createLight(lightParam) {
    "use strict";
    //load default and provided light, compare them, merge them
    //and return finalised light object with all properties filled
    var light = prepareLightParameters(lightParam);
    var lightComplete;
    var lightHelper;
    switch (light.type) {
    case 'AmbientLight':
        lightComplete = new THREE.AmbientLight(light.color, light.intensity); // soft white light
        scene.add(lightComplete);
        break;

    case 'PointLight':
        lightComplete = new THREE.PointLight(light.color, light.intensity, light.distance, light.decay);
        lightComplete.position.set(light.position.x, light.position.y, light.position.z);
        scene.add(lightComplete);

        if (light.size !== 0) {
            lightHelper = new THREE.PointLightHelper(lightComplete, light.size);
            scene.add(lightHelper);
        }
        break;

    case "DirectionalLight":
        lightComplete = new THREE.DirectionalLight(light.color, light.intensity);
        lightComplete.castShadow = light.castShadow;
        lightComplete.position.set(light.position.x, light.position.y, light.position.z);

        scene.add(lightComplete);

        //As per DirectionalLight target three.js documentation add the target seperately in the scene.

        if (light.size !== 0) {
            lightHelper = new THREE.DirectionalLightHelper(lightComplete, light.size, light.color);
            scene.add(lightHelper);
            lightHelper.update();
        }
        break;

    case "HemisphereLight":
        lightComplete = new THREE.HemisphereLight(light.skyColor, light.groundColor, light.intensity);
        lightComplete.position.set(light.position.x, light.position.y, light.position.z);
        scene.add(lightComplete);

        if (light.size !== 0) {
            lightHelper = new THREE.HemisphereLightHelper(lightComplete, light.size);
            scene.add(lightHelper);
        }
        break;

    case "SpotLight":
        lightComplete = new THREE.SpotLight(light.color, light.intensity, light.distance, light.angle, light.penumbra, light.decay);
        lightComplete.position.set(light.position.x, light.position.y, light.position.z); // how do i set position?
        //lightComplete.castShadow = light.castShadow;
        scene.add(lightComplete);

        if (light.size !== 0) {
            lightHelper = new THREE.SpotLightHelper(lightComplete);
            scene.add(lightHelper);
        }
        break;
    default:
        console.error("Error: Wrong Light type provided");
    }
}