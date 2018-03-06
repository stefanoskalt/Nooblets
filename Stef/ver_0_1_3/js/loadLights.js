/**
 * A controller function where we load all Lights for the simulation.
 */
function loadAllLights(){


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
		'distance' : 300,
		'size' : 50,
        'position' : {
            'x' : 40,
            'y' : 20,
            'z' : -100
        }
	}
	var PointLight3 = {
		'type' : 'PointLight',
		'distance' : 300,
		'size' : 50,
        'position' : {
            'x' : -170,
            'y' : 20,
            'z' : 100
        }
	}
	var PointLight4 = {
		'type' : 'PointLight',
		'distance' : 150,
		'size' : 1,
		"intensity" : 1,
        'position': {
			'x': -200,
			'y': -30,
			'z': -130
		},
	}
	var AmbientLight = { // works well
		'type' : 'AmbientLight',
		'intensity' : 1.01
	}











	//Create and load all the above lights
	createLight(PointLight1);
	createLight(PointLight2);
	createLight(PointLight3);
	createLight(PointLight4);
	//createLight(AmbientLight);
}