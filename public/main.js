import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let office;
let camera;
let renderer;
let scene;

const canvasSize = document.querySelector('.canvas-element');
let model_container = document.querySelector('.webgl');


function init () {

    // SCENE //////////////////////////////////////////////////////////////////////
    scene = new THREE.Scene();

    //CAMERA //////////////////////////////////////////////////////////////////////
    const fov = 40;
    const aspect = canvasSize.offsetWidth / canvasSize.offsetHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //camera.position.set(0, 0, 0);
    camera.translateX(-4);
    camera.translateY(11);
    camera.translateZ(7); 
    //const helper = new THREE.CameraHelper( camera );
    scene.add(camera);
    camera.updateProjectionMatrix();
    
    //RENDERER /////////////////////////////////////////////////////////////////////
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: model_container
    });
    renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);

    //CONTROLS //////////////////////////////////////////////////////////////////
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0,0,0);
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.dampingFactor = 3;
    controls.rotateSpeed = 0.5;
    controls.minZoom = .5;
    controls.maxZoom = 100; 
    controls.minDistance = 5;
    controls.maxDistance = 200;
    //controls.minAzimuthAngle = Math.PI * 0.3;
    //controls.maxAzimuthAngle = Math.PI * 0.6;
    //controls.minPolarAngle = Math.PI * 0.3;
    //controls.maxPolarAngle = Math.PI * 0.6;

    //LIGHT ////////////////////////////////////////////////////////////////////////
    const ambientLight = new THREE.AmbientLight(0xffeeee, 0.5);
    const hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1);
    const spotLight1 = new THREE.SpotLight(0xffffff, 1);
    spotLight1.position.set(0, 300, 0);
    spotLight1.castShadow = true;
    scene.add(ambientLight, hemisphereLight, spotLight1);

    // OBJECTS //////////////////////////////////////////////////////////////////////
    
    //background box
    const background_geometry = new THREE.BoxGeometry(2, 2, 2);
    const background_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const background = new THREE.Mesh(background_geometry, background_material);
    background.position.set(0, 0, 0);
    background.visible = false;
    scene.add(background);

    // load office
    const office_loader = new GLTFLoader();
    url = new URL( './model/office.glb', import.meta.url );
    url = "" + url;
    office_loader.load(url, (gltf) => {
        office = gltf.scene.children[0];
        office.visible = true;
        office.scale.set(2, 2, 2);
        office.position.set(0, 1.5, 0);
        //office.rotation.x = Math.PI/-2;
        //office.rotation.y = 0.8;
        //scene.add(gltf.scene);
    });

    //door box
    const door_geometry = new THREE.BoxGeometry(2.2, 5, 0.03);
    const door_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const door = new THREE.Mesh(door_geometry, door_material);
    door.position.set(-3.11, 0.5, -4.8);
    door.userData.name = 'door';
    
    // add printer cube
    const printer_geometry = new THREE.BoxGeometry(0.67, 0.67, 0.77);
    const printer_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const printer_cube = new THREE.Mesh(printer_geometry, printer_material);
    printer_cube.position.set(4.44, 0, 3.56);
    printer_cube.rotation.y = 0;
    printer_cube.userData.name = 'printer_cube';
    
    // add ball sphere
    const ball_geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ball_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const ball_sphere = new THREE.Mesh(ball_geometry,ball_material );
    ball_sphere.position.set(4.3, -1.47, -4.19);
    ball_sphere.userData.name = 'ball_sphere';
  
    const office_clickobjects = new THREE.Group();
    //office_group.add(office);
    office_clickobjects.add(ball_sphere);
    office_clickobjects.add(printer_cube);
    office_clickobjects.add(door);
    office_clickobjects.visible = true;
      
    // load factory
     const factory_loader = new GLTFLoader();
     url = new URL( './model/factory.glb', import.meta.url );
     url = "" + url;
     factory_loader.load(url, (gltf) => {
         factory = gltf.scene.children[0];
         factory.visible = true;
         factory.scale.set(4, 4, 4);
         factory.position.set(0, 4.5, 0);
         factory.matrixAutoUpdate = true;
         factory.updateMatrix();
         //factory.rotation.x = Math.PI/-2;
         //factory.rotation.y = 0.8;
         //scene.add(gltf.scene);
     });

     // load world
     const world_loader = new GLTFLoader();
     url = new URL( './model/world.glb', import.meta.url );
     url = "" + url;
     world_loader.load(url, (gltf) => {
         world = gltf.scene.children[0];
         world.visible = true;
         world.scale.set(10, 10, 10);
         world.position.set(0, 2.6, 0);
         //world.rotation.x = Math.PI/-2;
         //world.rotation.y = 0.8;
         world.matrixAutoUpdate = true;
         world.updateMatrix();
         //scene.add(gltf.scene);
         scene.add(world);
     });

     // load house
     const house_loader = new GLTFLoader();
     url = new URL( './model/house.glb', import.meta.url );
     url = "" + url;
     house_loader.load(url, (gltf) => {
         house = gltf.scene.children[0];
         house.visible = true;
         house.scale.set(12, 12, 12);
         house.position.set(0, 1.4, 0);
         //house.rotation.x = Math.PI/-2;
         //house.rotation.y = 0.8;
         //scene.add(gltf.scene);
                 
     });

    // BUTTONS/////////////////////////////////////////////////////////////

    function buttons_init() {
        //Initialize and hide buttons
        let button_next_1 = document.getElementById("button_next_1");
        button_next_1.style.display = "none"; 
        let button_next_2 = document.getElementById("button_next_2");
        button_next_2.style.display = "none"; 
        let button_restart = document.getElementById("button_restart");
        button_restart.style.display = "none"; 
        
        //Button start show Factory
        let button_start = document.getElementById("button_start");
        button_start.addEventListener("click", function () {
            scene.add(factory);
            scene.remove(world);
            controls.reset();
            button_start.style.display = "none";
            button_next_1.style.display = "block";
        });

        //Button show Office
        button_next_1.addEventListener("click", function () {
            scene.remove(factory);
            scene.add(office, office_clickobjects);
            controls.reset();
            button_next_1.style.display = "none";
            button_next_2.style.display = "block";
            controls.enablePan = false;
            //animate();
        });

        //Button show House
        button_next_2.addEventListener("click", function () {
            scene.remove(office, office_clickobjects);
            scene.add(house);
            controls.reset();
            button_restart.style.display = "block";
            button_next_2.style.display = "none";
            controls.enablePan = false;
            //animate();
        });

        //Button restart
        button_restart.addEventListener("click", function () {
            scene.remove(house);
            scene.add(world);
            controls.reset();
            button_restart.style.display = "none";
            button_start.style.display = "block";
            //animate();
        });

    };

    buttons_init();
        
};

// RAYCASTER ////////////////////////////////////////////////////////////////////

// Raycaster onclick

const raycaster_click = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
window.addEventListener('click', event => {
    
    const rect = renderer.domElement.getBoundingClientRect();
    clickMouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    clickMouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    raycaster_click.setFromCamera(clickMouse, camera);
    
    const found = raycaster_click.intersectObjects(scene.children, true);

    //console.log(found[0]);
    
    switch (found.length > 0 && found[0].object.userData.name) {
        case 'printer_cube':
            alert("That's your new ACME Lightspeed 5000 L printer.");
            break;   

        case 'ball_sphere':
            alert("Hey, keep off my basketball with the Dirk Nowitzky autograph!"); 
            break;

        case 'door':
            alert("You already want to go?");
            break;
    };
});

// Raycaster onmouseover

const raycaster_move = new THREE.Raycaster();
const moveMouse = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	const rect = renderer.domElement.getBoundingClientRect();
    moveMouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    moveMouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    // update the picking ray with the camera and pointer position
	raycaster_move.setFromCamera(moveMouse, camera);

	// calculate objects intersecting the picking ray
	const found = raycaster_move.intersectObjects( scene.children );
    
	switch (found.length > 0 && found[0].object.userData.name) {
        case 'printer_cube':
            console.log("INFO: Printer");
            break;   

        case 'ball_sphere':
            console.log("INFO: Basketball"); 
            break;

        case 'door':
            console.log("INFO: Door");
            break;
    };

};

window.addEventListener( 'pointermove', onPointerMove );

// rendering scene and camera
const render = () => {
    renderer.render(scene, camera);
};

// animation recursive function
let step = 0;
const animate = () => {
    requestAnimationFrame(animate);
    render();
};

 // making canvas responsive
 function windowResize() {
    camera.aspect = canvasSize.offsetWidth / canvasSize.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
    render();
};

//start scene
window.onload = init();
animate();
window.addEventListener('resize', windowResize, false);
