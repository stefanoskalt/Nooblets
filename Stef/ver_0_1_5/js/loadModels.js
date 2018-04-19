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
        'name': 'Door',
        'position': {
            'x': 111,
            'y': -37,
            'z': 6
        },
        'scale': 1.04

    };
    var loadDoor2 = {
        'modelPath': 'models/doortx.dae',
        'collision': true,
        'description': true,
        'name': 'Door',
        'position': {
            'x': -23.5,
            'y': -36.5,
            'z': 143
        },
        'rotate': {
            'x': 0,
            'y': 90,
            'z': 0
        },
        'scale': 1.04
    };
    var loadCarpet = {
        'modelPath': 'models/carpet.dae',
        'collision': false,
        'position': {
            'x': -15,
            'y': -68.8,
            'z': -69
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
            'x': -106,
            'y': -8,
            'z': 77
        },
        'scale': 0.6

    };


    var loadBin = {
        'modelPath': 'models/bin.dae',
        'collision': true,
        'description': true,
        'name': 'Rubish Bin',
        'position': {
            'x': 70,
            'y': -23,
            'z': 110
        },
        'scale': 1.4
    };
    var loadTv = {
        'modelPath': 'models/tv_stand.dae',
        'collision': true,
        'description': true,
        'name': 'TV',
        'position': {
            'x': 70,
            'y': -7.5,
            'z': -70
        },
        'rotate': {
            'x': 0,
            'y': 90,
            'z': 0
        },
        'scale': 2.3
    };
    var loadLivingRoom = {
        'modelPath': 'models/livingroomtx.dae',
        'collision': true,
        'position': {
            'x': 110,
            'y': -36,
            'z': 0
        },
        'scale': 1.0
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
            'x': -125,
            'y': -21,
            'z': 48
        },
        'rotate': {
            'x': 0,
            'y': 0,
            'z': 0
        },
        'scale': 0.3
    };
    var loadTable = {
        'modelPath': 'models/smallTabletx.dae',
        'collision': true,
        'description': true,
        'name': 'Table',
        'trigger': {
            'animationTrigger': "Ceiling Fan"
        },
        'position': {
            'x': -105,
            'y': -35,
            'z': 60
        },
        'scale': 1.7
    };
    var loadCoffeeTable = {
        'modelPath': 'models/coffeetable.dae',
        'collision': true,
        'description': false,
        'name': 'Coffee Table',
        'position': {
            'x': -50,
            'y': -35,
            'z': -70
        },
        'scale': 0.45
    };
    var loadSofa = {
        'modelPath': 'models/sofa2.dae',
        'collision': true,
        'description': true,
        'name': 'Sofa',
        'position': {
            'x': -100,
            'y': -22,
            'z': -65
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
        'interaction': true,
        'description': true,
        'animation': {
            'autoplay': true,
            'loop': true
        },
        'name': "Ceiling Fan",
        'position': {
            'x': 0,
            'y': 54,
            'z': 0
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
            'clips': [[0,0.6], [0.6,1.2]]
        },
        'trigger': {
            'animationTrigger': "Ceiling Fan"
        },
        'name': "Light Switch",
        'position': {
            'x': 100,
            'y': 0,
            'z': 40
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
            'clips': [[0,0.6], [0.6,1.2]]
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

    loadModel(loadDoor1);
    loadModel(loadAnime);
    loadModel(loadSwitch);
    loadModel(loadSwitch2);
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

}