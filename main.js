import WindowManager from './WindowManager.js'



const t = THREE;
let camera, scene, renderer, world;
let near, far;
let pixR = window.devicePixelRatio ? window.devicePixelRatio : 1;
let spheres = [];
let sceneOffsetTarget = {x: 0, y: 0};
let sceneOffset = {x: 0, y: 0};

let today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);
today = today.getTime();

let internalTime = getTime();
let windowManager;
let initialized = false;

// get time in seconds since beginning of the day (so that all windows use the same time)
function getTime ()
{
	return (new Date().getTime() - today) / 1000.0;
}


if (new URLSearchParams(window.location.search).get("clear"))
{
	localStorage.clear();
}
else
{	
	// this code is essential to circumvent that some browsers preload the content of some pages before you actually hit the url
	document.addEventListener("visibilitychange", () => 
	{
		if (document.visibilityState != 'hidden' && !initialized)
		{
			init();
		}
	});

	window.onload = () => {
		if (document.visibilityState != 'hidden')
		{
			init();
		}
	};

	function init ()
	{
		initialized = true;

		// add a short timeout because window.offsetX reports wrong values before a short period 
		setTimeout(() => {
			setupScene();
			setupWindowManager();
			resize();
			updateWindowShape(false);
			render();
			window.addEventListener('resize', resize);
		}, 500)	
	}

	function setupScene ()
	{
		camera = new t.OrthographicCamera(0, 0, window.innerWidth, window.innerHeight, -10000, 10000);
		
		camera.position.z = 2.5;
		near = camera.position.z - .5;
		far = camera.position.z + 0.5;

		scene = new t.Scene();
		scene.background = new t.Color(0.0);
		scene.add( camera );

		renderer = new t.WebGLRenderer({antialias: true, depthBuffer: true});
		renderer.setPixelRatio(pixR);
	    
	  	world = new t.Object3D();
		scene.add(world);

		renderer.domElement.setAttribute("id", "scene");
		document.body.appendChild( renderer.domElement );
	}

	function setupWindowManager ()
	{
		windowManager = new WindowManager();
		windowManager.setWinShapeChangeCallback(updateWindowShape);
		windowManager.setWinChangeCallback(windowsUpdated);

		// here you can add your custom metadata to each windows instance
		let metaData = {foo: "bar"};

		// this will init the windowmanager and add this window to the centralised pool of windows
		windowManager.init(metaData);

		// call update windows initially (it will later be called by the win change callback)
		windowsUpdated();
	}

	function windowsUpdated ()
	{
		updateNumberOfSpheres();
	}

	function updateNumberOfSpheres() 
	{
		let wins = windowManager.getWindows();
		
		// Remove all existing spheres
		spheres.forEach((c) => {
		world.remove(c);
		});
		spheres = [];
		
		// Create a new sphere for each window
		for (let i = 0; i < wins.length; i++) {
		let win = wins[i];
		
		let c = new t.Color();
		c.setHSL(i * 0.1, 1.0, 0.5);
		
		let sphere = new t.Mesh(
		new t.SphereGeometry(50 + i * 25, 32, 32),
		new t.MeshBasicMaterial({ color: c, wireframe: true })
		);
		sphere.position.x = win.shape.x + win.shape.w * 0.5;
		sphere.position.y = win.shape.y + win.shape.h * 0.5;
		'
			
		// Define the Lorenz attractor parameters
		const lorenzParams = [
		  { equation: 0, params: [10.0, 30.0, 8 / 3] },
		  { equation: 1, params: [1.24, 1.1, 4.4, 3.21] },
		  // Add more Lorenz attractor equations here
		];
		}
	}
	
	function initializeSphere(sphere, params) 
	{
	  // Set the initial position of the sphere based on the Lorenz attractor parameters
	  sphere.position.set(params.initialX, params.initialY, params.initialZ);
	
	  // Initialize the trail positions
	  for (let i = 0; i < trailLength; i++) {
	    trail.push(sphere.position.clone());
	  }
	}
	
	function updateSpherePosition(sphere, params, t) 
	{
	  // Update the sphere position based on the Lorenz attractor equation associated with the parameters
	  switch (params.equation) {
	    case 0:
	      // Lorenz equation
	      updateLorenzPosition(sphere, params.params, t);
	      break;
	    case 1:
	      // Chen's attractor
	      updateChenPosition(sphere, params.params, t);
	      break;
	    // Add more cases for other Lorenz attractor equations
	  }
	}
	
	function updateLorenzPosition(sphere, params, t) {
	  // Implement the Lorenz equation to update the sphere position
	  const [a, b, c] = params;
	  const x = sphere.position.x;
	  const y = sphere.position.y;
	  const z = sphere.position.z;
	
	  sphere.position.x += (a * (y - x)) * t;
	  sphere.position.y += (x * (b - z) - y) * t;
	  sphere.position.z += (x * y - c * z) * t;
	}
	
	function updateChenPosition(sphere, params, t)
	{
	  // Implement Chen's attractor equation to update the sphere position
	  const [a, b, c, d] = params;
	  const x = sphere.position.x;
	  const y = sphere.position.y;
	  const z = sphere.position.z;
	
	  sphere.position.x += (-a * x + b * y) * t;
	  sphere.position.y += (c * y - x * z) * t;
	  sphere.position.z += ((x * y) / 3 + d * z) * t;
	}
	
	function updateSphereTrail(sphere) 
	{
	// Update the sphere trail positions
	// Use the same approach as in the provided Lorenz attractor code
	{
	/// Calculate timestep
	timestep = clock.getElapsedTime().asSeconds();
	input_timer += timestep;
	clock.restart();

	timestep *= speed; // Slow down or speed up time.

	// Update position according to chosen equation u
	std::vector<float> &m = params[u];
	switch (u)
	{
	case 0: 
	{	
		for (unsigned i = 0; i < num_points; i++)
		{
			point[i].x += static_cast<float>(m[0] * (point[i].y - point[i].x) * timestep);
			point[i].y += static_cast<float>((point[i].x * (m[1] - point[i].z) - point[i].y) * timestep);
			point[i].z += static_cast<float>((point[i].x * point[i].y - m[2] * point[i].z) * timestep);
		}
		break;
	}
	case 1:
	{
		for (unsigned i = 0; i < num_points; i++)
		{
			float h1 = 0.5f * (abs(point[i].x + 1) - abs(point[i].x - 1));
			float h2 = 0.5f * (abs(point[i].y + 1) - abs(point[i].y - 1));
			float h3 = 0.5f * (abs(point[i].z + 1) - abs(point[i].z - 1));

			point[i].x += static_cast<float>((-point[i].x + m[0] * h1 - m[3] * h2 - m[3] * h3) * timestep);
			point[i].y += static_cast<float>((-point[i].y - m[3] * h1 + m[1] * h2 - m[2] * h3) * timestep);
			point[i].z += static_cast<float>((-point[i].z - m[3] * h1 + m[2] * h2 + h3) * timestep);
		}
		break;
	}
	case 2: 
	{
		for (unsigned i = 0; i < num_points; i++)
		{
			point[i].x += static_cast<float>(((point[i].z - m[1]) * point[i].x  - m[3] * point[i].y) * timestep);
			point[i].y += static_cast<float>((m[3] * point[i].x + (point[i].z - m[1]) * point[i].y) * timestep);
			point[i].z += static_cast<float>((m[2] + m[0] * point[i].z - (point[i].z * point[i].z * point[i].z) / 3 - (point[i].x * point[i].x + point[i].y * point[i].y) * (1 + m[4] * point[i].z) + m[5] * point[i].z * point[i].x * point[i].x * point[i].x) * timestep);
		}
		break;
	}
	case 3:
	{
		for (unsigned i = 0; i < num_points; i++)
		{
			point[i].x += static_cast<float>((point[i].x * (4 - point[i].y) + m[0] * point[i].z) * timestep);
			point[i].y += static_cast<float>((-point[i].y * (1 - point[i].x * point[i].x)) * timestep);
			point[i].z += static_cast<float>((-point[i].x * (1.5 - point[i].z * m[1]) - 0.05 * point[i].z) * timestep);
		}
		break;
	}
	case 4:
	{
		for (unsigned i = 0; i < num_points; i++)
		{
			point[i].x += static_cast<float>((m[0] * point[i].x - point[i].y * point[i].z) * timestep * 0.25f);
			point[i].y += static_cast<float>((m[1] * point[i].y + point[i].x * point[i].z) * timestep * 0.25f);
			point[i].z += static_cast<float>((m[2] * point[i].z + point[i].x * point[i].y / 3) * timestep * 0.25f);
		}
		break;
	}
	case 5:
	{
		for (unsigned i = 0; i < num_points; i++)
		{
			point[i].x += static_cast<float>((-m[0] * point[i].x - 4 * point[i].y - 4 * point[i].z - point[i].y * point[i].y) * timestep);
			point[i].y += static_cast<float>((-m[0] * point[i].y - 4 * point[i].z - 4 * point[i].x - point[i].z * point[i].z) * timestep);
			point[i].z += static_cast<float>((-m[0] * point[i].z - 4 * point[i].x - 4 * point[i].y - point[i].x * point[i].x) * timestep);
		}
		break;
	}
	case 6:
	{
		for (unsigned i = 0; i < num_points; i++)
		{
			point[i].x += static_cast<float>(((1 / m[1] - m[0]) * point[i].x + point[i].z + point[i].x * point[i].y) * timestep);
			point[i].y += static_cast<float>((-m[1] * point[i].y - point[i].x * point[i].x) * timestep);
			point[i].z += static_cast<float>((-point[i].x - m[2] * point[i].z) * timestep);
		}
		break;
	}
	case 7:
	{
		for (unsigned i = 0; i < num_points; i++)
		{
			point[i].x += static_cast<float>((-m[0] * point[i].x + point[i].y + 10.0f * point[i].y * point[i].z) * timestep);
			point[i].y += static_cast<float>((-point[i].x - 0.4 * point[i].y + 5.0f * point[i].x * point[i].z) * timestep);
			point[i].z += static_cast<float>((m[1] * point[i].z - 5.0f * point[i].x * point[i].y) * timestep);
		}
		break;
	}
	case 8:
	{
		for (unsigned i = 0; i < num_points; i++)
		{
			point[i].x += static_cast<float>((point[i].y) * timestep);
			point[i].y += static_cast<float>((-point[i].x + point[i].y * point[i].z) * timestep);
			point[i].z += static_cast<float>((m[0] - point[i].y * point[i].y) * timestep);
		}
		break;
	}
	case 9:
	{
		for (unsigned i = 0; i < num_points; i++)
		{
			point[i].x += static_cast<float>((-m[0] * point[i].x + sin(point[i].y)) * timestep);
			point[i].y += static_cast<float>((-m[0] * point[i].y + sin(point[i].z)) * timestep);
			point[i].z += static_cast<float>((-m[0] * point[i].z + sin(point[i].x)) * timestep);
		}
		break;
	}
	}
		}
	function updateWindowShape (easing = true)
	{
		// storing the actual offset in a proxy that we update against in the render function
		sceneOffsetTarget = {x: -window.screenX, y: -window.screenY};
		if (!easing) sceneOffset = sceneOffsetTarget;
	}


	function render ()
	{
		let t = getTime();

		windowManager.update();


		// calculate the new position based on the delta between current offset and new offset times a falloff value (to create the nice smoothing effect)
		let falloff = .05;
		sceneOffset.x = sceneOffset.x + ((sceneOffsetTarget.x - sceneOffset.x) * falloff);
		sceneOffset.y = sceneOffset.y + ((sceneOffsetTarget.y - sceneOffset.y) * falloff);

		// set the world position to the offset
		world.position.x = sceneOffset.x;
		world.position.y = sceneOffset.y;

		let wins = windowManager.getWindows();


		// loop through all our spheres and update their positions based on current window positions
		for (let i = 0; i < spheres.length; i++)
		{
			let cube = spheres[i];
			let win = wins[i];
			let _t = t;// + i * .2;

			let posTarget = {x: win.shape.x + (win.shape.w * .5), y: win.shape.y + (win.shape.h * .5)}

			cube.position.x = cube.position.x + (posTarget.x - cube.position.x) * falloff;
			cube.position.y = cube.position.y + (posTarget.y - cube.position.y) * falloff;
			cube.rotation.x = _t * .5;
			cube.rotation.y = _t * .3;
		};

		renderer.render(scene, camera);
		requestAnimationFrame(render);
	}


	// resize the renderer to fit the window size
	function resize ()
	{
		let width = window.innerWidth;
		let height = window.innerHeight
		
		camera = new t.OrthographicCamera(0, width, 0, height, -10000, 10000);
		camera.updateProjectionMatrix();
		renderer.setSize( width, height );
	}
}
