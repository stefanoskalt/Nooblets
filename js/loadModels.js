/*jslint browser: true */
/*global loadModel */

/**
 * A controller function where we load all Models for the simulation.
 */
function loadAllModels() {
    "use strict";
    //x : (-/+)forward/backward, y: top/bottom, z: right/left
    var loadDoor1 = {
        'modelPath': 'models/doortx.dae',
        'collision': true,
        'description': true,
        'interaction': true,
        //'conversation':false,
        'name': 'Door',
        'position': {
            'x': 136,
            'y': -37,
            'z': -89
        },
        'scale': 1.04

    };
    var loadDoor2 = {
        'modelPath': 'models/animation/doorAnim.dae',
        'collision': true,
        'interaction': true,
        'description': false,
        'animation': {
            'autoplay': false,
            'loop': false,
            //'clips': [[0,3.5], [3.5,7]]
            'clips': [[0.5,2], [4,5]]
        },
        'name': 'Door',
        'position': {
            'x': -3,
            'y': -32.7,
            'z': -224
        },
        'rotate': {
            'x': 0,
            'y': 90,
            'z': 0
        },
        'scale': 1.0
    };
    var loadCarpet = {
        'modelPath': 'models/carpet.dae',
        'collision': false,
        'interaction': true,
        'clue': true,
        'conversation': true,
        'description': true,
        'name': "Carpet",
        'position': {
            'x': -70,
            'y': -68.8,
            'z': -100
        },
        'rotate': {
            'x': 0,
            'y': 0,
            'z': 0
        },
        'scale': 0.9
    };
    var loadLamp = {
        'modelPath': 'models/lamptx.dae',
        'collision': true,
        'position': {
            'x': 40,
            'y': -8,
            'z': 20
        },
        'scale': 0.6

    };


    var loadBin = {
        'modelPath': 'models/bin.dae',
        'collision': true,
        'description': true,
        'name': 'Rubish Bin',
        'position': {
            'x': -120,
            'y': -22,
            'z': 20
        },
        'scale': 1.4
    };
    var loadTv = {
        'modelPath': 'models/tv_stand.dae',
        'collision': true,
        'description': true,
        'clue': true,
        'conversation': true,
        'interaction':true,
        'name': 'TV',
        'position': {
            'x': -80,
            'y': -7.5,
            'z': -210
        },
        'rotate': {
            'x': 0,
            'y': 180,
            'z': 0
        },
        'scale': 2.3
    };
    var loadLivingRoom = {
        'modelPath': 'models/two_rooms2.dae',
        'collision': true,
        'position': {
            'x': 0,
            'y': -36,
            'z': 50
        },
        'scaleX': 1.0,
        'scaleY': 1.0,
        'scaleZ': 0.5,
    };
    var loadChair1 = {
        'modelPath': 'models/ChairWithTexturesDAE.dae',
        'collision': true,
        'description': true,
        'name': 'Chair',
        'position': {
            'x': -125,
            'y': 4,
            'z': 48
        },
        'rotate': {
            'x': 0,
            'y': 180,
            'z': 0
        },
        'scale': 1.8
    };
    var loadChair = {
        'modelPath': 'models/BestChair.dae',
        'collision': true,
        'description': true,
        'name': 'Chair',
        'position': {
            'x': 60,
            'y': -21,
            'z': -10
        },
        'rotate': {
            'x': 0,
            'y': -90,
            'z': 0
        },
        'scale': 0.3
    };
    var loadTable = {
        'modelPath': 'models/smallTabletx.dae',
        'collision': true,
        'description': true,
        'name': 'Table',
        //'trigger': {
        //    'animationTrigger': "Ceiling Fan"
        //},
        'position': {
            'x': 60,
            'y': -35,
            'z': 10
        },
		
		'rotate': {
            'x': 0,
            'y': 90,
            'z': 0
        },
        'scale': 1.7
    };
    var loadCoffeeTable = {
        'modelPath': 'models/coffeetable.dae',
        'collision': true,
        'description': false,
        'name': 'Coffee Table',
        'position': {
            'x': -70,
            'y': -35,
            'z': -38
        },
        'scale': 0.45
    };
    var loadSofa = {
        'modelPath': 'models/sofa2.dae',
        'collision': true,
        'description': true,
        'name': 'Sofa',
        'position': {
            'x': -70,
            'y': -29,
            'z': 20
        },
		
		'rotate': {
            'x': 0,
            'y': 90,
            'z': 0
        },

        'scale': 0.5
    };
 var loadSofa1 = {
        'modelPath': 'models/UpdatedSofaDAE.dae',
        'collision': true,
        'description': true,
        'name': 'Sofa',
        'position': {
            'x': -100,
            'y': -22,
            'z': -40
        },

        'scale': 1.5
    };
    var loadAnime = {
        'modelPath': 'models/animation/fantx.dae',
        'collision': true,
        'interaction': false,
        'description': true,
        'animation': {
            'autoplay': true,
            'loop': true
        },
        'name': "Ceiling Fan",
        'position': {
            'x': 0,
            'y': 55,
            'z': -70
        },
        'scale': 1.0
    };
    var loadSwitch = {
        'modelPath': 'models/animation/lightSwitchAnim.dae',
        'collision': true,
        'interaction': true,
        'description': false,
        'animation': {
            'autoplay': false,
            'loop': false,
            'clips': [[0,0.5], [0.5,1.0]]
        },
        'trigger': {
            'animationTrigger': "Ceiling Fan"
        },
        'name': "Light Switch",
        'position': {
            'x': 124,
            'y': 0,
            'z': -60
        },
        'rotate': {
            'x': 0,
            'y': 90,
            'z': 0
        },
        'scale': 1.0
    };
    var loadSwitch2 = {
        'modelPath': 'models/animation/lightSwitchAnim.dae',
        'collision': true,
        'interaction': true,
        'description': false,
        'animation': {
            'autoplay': false,
            'loop': false,
            'clips': [[0,0.5], [0.5,1.0]]
        },
        'trigger': {
            'animationTrigger': "Ceiling Fan"
        },
        'name': "Light Switch 2",
        'position': {
            'x': 10,
            'y': 0,
            'z': 132
        },
        'rotate': {
            'x': 0,
            'y': 0,
            'z': 0
        },
        'scale': 1.0
    };

     var loadDrawers = {
        'modelPath': 'models/animation/drawers.dae',
        'collision': true,
        'interaction': true,
        'description': false,
        'animation': {
            'autoplay': false,
            'loop': false,
            'clips': [[0,1.0], [1.0,3.3]]
        },
        'name': "Drawers",
        'position': {
            'x': 120,
            'y': -18,
            'z': -475
        },
		
		'rotate': {
            'x': 0,
            'y': 90,
            'z': 0
        },
        'scale': 0.7
    };
	
	     var loadKnife = {
        'modelPath': 'models/knife.dae',
        'collision': false,
        'interaction': true,
        'description': true,

        'name': "Knife",
        'position': {
            'x': 30,
            'y': -8,
            'z': 0
        },
		
		'rotate': {
            'x': 0,
            'y': 0,
            'z': 90
        },
        'scale': 1.0
    };
	
	 var loadPhone = {
        'modelPath': 'models/phone.dae',
        'collision': false,
        'interaction': true,
        'description': true,

        'name': "Phone",
        'position': {
            'x': 50,
            'y': -8,
            'z': 0
        },
		
		'rotate': {
            'x': 0,
            'y': 0,
            'z': 0
        },
        'scale': 0.02
    };

    var loadWitness = {
        'modelPath': 'models/girl.dae',
        'collision': true,
        'interaction': true,
        //'conversation': true,
        //'description': false,
        'animation': {
            'autoplay': true,
            'loop': true
        },
        'name': "Witness",
        'position': {
            'x': 85,
            'y': -35,
            'z': -160
        },
        'rotate': {
            'x': 0,
            'y': -35,
            'z': 0
        },
        'scale': 1.3
    };

    var loadDeadBody = {
        'modelPath': 'models/DeadBody.dae',
        'collision': true,
        'interaction': true,
        'description': true,
        'name': "DeadBody",
        'position': {
            'x': -20,
            'y': -34,
            'z': -100
        },
        'rotate': {
            'x': 0,
            'y': 105,
            'z': 0
        },
        'scale': 1.5
    };

    loadModel(loadDoor1);
    loadModel(loadAnime);
    loadModel(loadSwitch);
	
    //loadModel(loadSwitch2);
	
    loadModel(loadBin);
    loadModel(loadSofa);
    loadModel(loadTv);
    loadModel(loadLivingRoom);
    loadModel(loadChair);
    loadModel(loadLamp);
    loadModel(loadTable);
	
    loadModel(loadDoor2);
	
    loadModel(loadCoffeeTable);
    loadModel(loadCarpet);
    loadModel(loadDrawers);
	loadModel(loadKnife);
	loadModel(loadPhone);

    loadModel(loadWitness);
    loadModel(loadDeadBody);
}