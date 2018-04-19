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
		'angle' : Math.PI/4,
		'size':0
		//'position' : { // how do i set position?
		//	'x' : 0,
		//	'y' : 6,
		//	'z' : 1
		//}
	}

	//---------------------CREATE AND SET LIGHTS HERE------------------
	var PointLight1 = {
		'type' : 'PointLight',
		'distance' : 150,
		'size' : 0,
		'decay': 2,
        'position' : {
            'x' : 40,
            'y' : 40,
            'z' : 80
        }
	}
	var PointLightFan = {
		'type' : 'PointLight',
		'distance' : 5,
		'size' : 0,
		'decay':2,
        'position' : {
            'x' : -9,
            'y' : 46,
            'z' : -2
        }
	}
	var SpotLight = { // needs fix with position
		'type' : 'SpotLight',
		'intensity' : 2,
		'distance' : 50,
		'angle' :  Math.PI/3,
		'penumbra' : 1,
		'decay' : 2,
		'position' : {
			'x' : -3,
			'y' : 52,
			'z' : 0
		}
	}
	var PointLightLamp = {
		'type' : 'PointLight',
		'distance' : 300,
		'size' : 0,
		'intensity': 2,
		'distance' : 60,
		'decay': 2,
        'position' : {
            'x' : -106,
            'y' : 28,
            'z' : 77
        }
	}
	var PointLightLampWall = {
		'type' : 'PointLight',
		'distance' : 300,
		'size' : 0,
		'intensity': 0.4,
		'distance' : 200,
		'decay': 2,
        'position' : {
            'x' : -115,
            'y' : 40,
            'z' : 80
        }
	}
	var PointLight4 = {
		'type' : 'PointLight',
		'distance' : 150,
		'size' : 100,
		"intensity" : 1,
		'size': 0,
        'position': {
			'x': -70,
			'y': 40,
			'z': 80
		}
	}

	var PointLightSofa = {
		'type' : 'PointLight',
		'distance' : 170,
		'size' : 0,
		'decay': 2,
        'position' : {
            'x' : -90,
            'y' : 50,
            'z' : -75
        }
	}
	var PointLightTv = {
		'type' : 'PointLight',
		'distance' : 150,
		'intensity':2,
		'size' : 0,
		'decay': 2,
        'position' : {
            'x' : 40,
            'y' : 40,
            'z' : -60
        }
	}
	var AmbientLight = { // works well
		'type' : 'AmbientLight',
		'intensity' : 0.1
	}











	//Create and load all the above lights
	createLight(PointLight1);
	createLight(PointLightFan);
	createLight(SpotLight);

	createLight(PointLightLamp);
	createLight(PointLightLampWall);
	createLight(PointLightTv);
	createLight(PointLightSofa);
	createLight(AmbientLight);
}