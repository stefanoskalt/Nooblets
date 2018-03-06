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
			'x': 0,
			'y': 0,
			'z': 2
		},
		'scale': 10.0,

	};
	var loadTv = {
		'modelPath': 'models/tv_stand.dae',
		'collision': false,
		'interaction': true,
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
		'description': true,
		'name':'Table',
		'trigger' : {
			'animationTrigger' : "Ceiling Fan"
		},
		'position': {
			'x': -30,
			'y': -30,
			'z': 0
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
	var loadAnime = {
		'modelPath': 'models/animation/fanAnim.dae',
		'collision': false,
		'interaction' : true,
		'description': false,
		'animation': {
			'autoplay': true,
			'loop': true
		},
		'name' : "Ceiling Fan",
		'position': {
			'x': 10,
			'y': 15,
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
			'x': -200,
			'y': -30,
			'z': -100
		},
		'scale': 1.0
	}
	//loadModel(loadDesk);
	loadModel(loadAnime);
	loadModel(loadSwitch);
	//loadModel(loadWindow);
	//loadModel(loadTv);

}