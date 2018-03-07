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
	var loadDoor1 = {
		'modelPath': 'models/doortx.dae',
		'collision': true,
		'position': {
			'x': 111,
			'y': -36,
			'z': 6,
		},
		'scale': 1.04,

	};
	var loadDoor2 = {
		'modelPath': 'models/doortx.dae',
		'collision': true,
		'position': {
			'x': -23.5,
			'y': -36.5,
			'z': 143,
		},
		'rotate': {
			'x' : 0,
			'y' : 90,
			'z' : 0
		},
		'scale': 1.04
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
	var loadWindow = {
		'modelPath': 'models/tv.dae',
		'collision': true,
		'description': false,
		'interaction': true,
		'name': "TV",
		'position': {
			'x': 0,
			'y': 0,
			'z': 2
		},
		'scale': 1.0
	};

	var loadBin = {
		'modelPath': 'models/bin.dae',
		'collision': false,
		'position': {
			'x': 70,
			'y': -23,
			'z': 110
		},
		'scale': 1.4,

	};
	var loadTv = {
		'modelPath': 'models/tv_stand.dae',
		'collision': false,
		'position': {
			'x': 70,
			'y': -7.5,
			'z': -70
		},
		'rotate': {
			'x' : 0,
			'y' : 90,
			'z' : 0
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
	var loadChair = {
		'modelPath': 'models/ChairWithTexturesDAE.dae',
		'collision': true,
		'position': {
			'x': -125,
			'y': 4,
			'z': 48
		},
		'rotate': {
			'x' : 0,
			'y' : 180,
			'z' : 0
		},
		'scale': 1.8
	};
	var loadTable = {
		'modelPath': 'models/smallTabletx.dae',
		'collision': false,
		'description': true,
		'name':'Table',
		'trigger' : {
			'animationTrigger' : "Ceiling Fan"
		},
		'position': {
			'x': -105,
			'y': -35,
			'z': 60
		},
		'scale': 1.7
	};
	var loadTest = {
		'modelPath': 'models/room_textured.dae',
		'collision': false,
		'position': {
			'x': 0,
			'y': 5,
			'z': 0
		},
		'scale': 1.0
	};
		var loadSofa = {
		'modelPath': 'models/UpdatedSofaDAE.dae',
		'collision': false,
		'position': {
			'x': -100,
			'y': -22,
			'z': -40
		},

		'scale': 1.5
	};
	var loadAnime = {
		'modelPath': 'models/animation/fantx.dae',
		'collision': false,
		'interaction' : true,
		'description': true,
		'animation': {
			'autoplay': true,
			'loop': true
		},
		'name' : "Ceiling Fan",
		'position': {
			'x': 0,
			'y': 54,
			'z': 0
		},
		'scale': 1.0
	};
	var loadSwitch = {
		'modelPath': 'models/animation/lightSwitchAnim.dae',
		'collision': false,
		'interaction' : true,
		'description': false,
		'animation': {
			'autoplay': false,
			'loop': false,
		},
		'trigger' : {
			'animationTrigger' : "Ceiling Fan"
		},
		'name' : "Light Switch",
		'position': {
			'x': 100,
			'y': 0,
			'z': 40
		},
		'rotate': {
			'x' : 0,
			'y' : 90,
			'z' : 0
		},
		'scale': 1.0
	}

	loadModel(loadDoor1);
	loadModel(loadAnime);
	loadModel(loadSwitch);
	//loadModel(loadWindow);
	loadModel(loadBin);
	loadModel(loadSofa);
	loadModel(loadTv);
	loadModel(loadLivingRoom);
	loadModel(loadChair);
	loadModel(loadLamp);
	loadModel(loadTable);
	loadModel(loadDoor2);

}