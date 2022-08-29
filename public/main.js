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

    // scene setup
    scene = new THREE.Scene();

    //camera setup
    const fov = 40;
    const aspect = canvasSize.offsetWidth / canvasSize.offsetHeight;
    const near = 0.1;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //camera.rotation.z += Math.PI;
    camera.position.set(0, 20, 0);
    camera.lookAt(scene.position); 
    camera.position.y -= 20;
    scene.add(camera);
    

    //renderer setup
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: model_container
    });
    renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);

    // orbitcontrol setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set( 0, 0, 0 );
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

    //background box
    const background_geometry = new THREE.BoxGeometry(2, 2, 2);
    const background_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const background = new THREE.Mesh(background_geometry, background_material);
    background.position.set(0, 0, 0);
    background.visible = false;
    scene.add(background);

    //door box
    const door_geometry = new THREE.BoxGeometry(2.2, 5, 0.03);
    const door_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const door = new THREE.Mesh(door_geometry, door_material);
    door.position.set(-3.11, 0.5, -4.8);
    door.userData.name = 'door';
    door.visible = true;
    scene.add(door);

    // add printer cube
    const printer_geometry = new THREE.BoxGeometry(0.67, 0.67, 0.77);
    const printer_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const printer_cube = new THREE.Mesh(printer_geometry, printer_material);
    printer_cube.position.set(4.44, 0, 3.56);
    printer_cube.rotation.y = 0;
    printer_cube.userData.name = 'printer_cube';
    printer_cube.visible = true;
    scene.add(printer_cube);

    // add ball sphere
    const ball_geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ball_material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const ball_sphere = new THREE.Mesh(ball_geometry,ball_material );
    ball_sphere.position.set(4.3, -1.47, -4.19);
    ball_sphere.userData.name = 'ball_sphere';
    ball_sphere.visible = true;
    scene.add(ball_sphere);

    // ambient light setup
    const ambientLight = new THREE.AmbientLight(0xffeeee, 0.5);
    scene.add(ambientLight);

    // hemisphere light setup
    const hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1);
    scene.add(hemisphereLight);

     // direction lights setup
    const spotLight1 = new THREE.SpotLight(0xffffff, 1);
    spotLight1.position.set(0, 300, 0);
    spotLight1.castShadow = true;
    scene.add(spotLight1);

    // loding office
    const office_loader = new GLTFLoader();
    url = new URL( './model/office.glb', import.meta.url );
    url = "" + url;
    office_loader.load(url, (gltf) => {
        office = gltf.scene.children[0];
        office.visible = true;
        office.scale.set(2, 2, 2);
        office.position.set(0, 1.5, 0);
        //office.rotation.x = 0.4;
        //office.rotation.y = 0.8;
        scene.add(gltf.scene);
    });

    // loading factory
     const factory_loader = new GLTFLoader();
     url = new URL( './model/factory.glb', import.meta.url );
     url = "" + url;
     factory_loader.load(url, (gltf) => {
         factory = gltf.scene.children[0];
         
         factory.scale.set(4, 4, 4);
         factory.position.set(0, -35, 0);
         //factory.rotation.x = 0.4;
         //factory.rotation.y = 0.8;
         scene.add(gltf.scene);
     });

    animate();

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const clickMouse = new THREE.Vector2();

    window.addEventListener('click', event => {
        
        const rect = renderer.domElement.getBoundingClientRect();
        clickMouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        clickMouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

        raycaster.setFromCamera(clickMouse, camera);
        
        //to be replaced by switch...case
        const found = raycaster.intersectObjects(scene.children, true);
        
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

};

// rendering scene and camera
const render = () => {
    renderer.render(scene, camera);
};

// animation recursive function
//let step = 0
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
window.addEventListener('resize', windowResize, false);

//button in index.html
let btn = document.getElementById("button");
btn.addEventListener("click", function () {
    alert("Button geklickt");
    //console.log(cvs);
   
});
