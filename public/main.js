import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'dat.gui';
import * as TWEEN from '@tweenjs/tween.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

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
    camera.translateX(-11);
    camera.translateY(8.6);
    camera.translateZ(11); 
    //const helper = new THREE.CameraHelper( camera );
    scene.add(camera);
    camera.updateProjectionMatrix();     

    //RENDERER //////////////////////////////////////////////////////////////////
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
        canvas: model_container
    });
    
    renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.physicallyCorrectLights = true;
    // renderer.autoClear = false;
    renderer.setClearColor(0x000000);

    // Composer & Effects ///////////////////////////////////////////////////////////
    
    var renderTarget = new THREE.WebGLRenderTarget(2000, 2000);

    composer = new EffectComposer(renderer, renderTarget);
	composer.addPass(new RenderPass(scene, camera));    
    
    var glitchParams = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: true,
      };
    glitchPass = new GlitchPass(glitchParams);
	//composer.addPass(glitchPass);


    const bloomParams = {
        exposure: 1,
        bloomStrength: 4.5,
        bloomThreshold: 0,
        bloomRadius: 1
    };
    bloomPass = new UnrealBloomPass(bloomParams);
	composer.addPass(bloomPass);

    //CONTROLS //////////////////////////////////////////////////////////////////
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.target.set(0,0,0);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    //controls.rotateSpeed = 0.5;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    //controls.minAzimuthAngle = Math.PI * -0.5;
    //controls.maxAzimuthAngle = Math.PI * -0.4;
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.6;

    //LIGHT ////////////////////////////////////////////////////////////////////////
    const ambientLight = new THREE.AmbientLight( 0xffffff, 2 ); // soft white light
	const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0.5);
    const spotLight1 = new THREE.SpotLight(0xffffff, 3);
    const spotLight2 = new THREE.SpotLight(0xffffff, 3);
    spotLight1.position.set(20, 30, 0);
    spotLight1.castShadow = true;
    spotLight2.position.set(0, 10, 10);
    spotLight2.castShadow = true;
    scene.add(ambientLight, hemisphereLight, spotLight1, spotLight2);

    // GUI ////////////////////////////////////

    function testObject() {
    
        var gui = new GUI( { width: 600});
        
        const cube_geometry = new THREE.BoxGeometry(1, 1, 1);
        const cube_material = new THREE.MeshLambertMaterial( 
            {color: 0x08f26e, 
            opacity: 0.6,
            transparent: true});
        const cube = new THREE.Mesh(cube_geometry, cube_material);
        cube.position.set(0, 0, 0);
        scene.add(cube);

        cube.visible = true;

        var box = gui.addFolder('Object Dimensions');
        box.add(cube.scale, 'x', 0, 3, 0.01).name('Width').listen();
        box.add(cube.scale, 'y', 0, 3, 0.01).name('Height').listen();
        box.add(cube.scale, 'z', 0, 3, 0.01).name('Length').listen();
        box.open();

        var box = gui.addFolder('Object Position');
        box.add(cube.position, 'x', -8, 8, 0.01).name('x-Position').listen();
        box.add(cube.position, 'y', -8, 8, 0.01).name('y-Position').listen();
        box.add(cube.position, 'z', -8, 8, 0.01).name('z-Position').listen();
        box.open();
        
        var box = gui.addFolder('Object Rotation');
        box.add(cube.rotation, 'x', -1.5, 1.5, 0.01).name('x-Rotation').listen();
        box.add(cube.rotation, 'y', -1.5, 1.5, 0.01).name('y-Rotation').listen();
        box.add(cube.rotation, 'z', -1.5, 1.5, 0.01).name('z-Rotation').listen();
        box.add(cube.material, 'wireframe').listen();
        box.open();
        //gui.add(options, 'reset');

    };
    // Add test object if needed
    //testObject();

    // Load/Create OBJECTS //////////////////////////////////////////////////////////////////////
    
    // load and animate Title ////////
    const world_loader = new GLTFLoader();
        url = new URL( './model/world.glb', import.meta.url );
        url = "" + url;
        world_loader.load(url, (gltf) => {
            world = gltf.scene.children[0];
            world.visible = true;
            world.scale.set(15, 15, 15);
            world.position.set(0, -0.3, 0);
            //scene.add(gltf.scene);
            scene.add(world);
            new TWEEN.Tween(world.rotation)
               .to({ y: -(2 * Math.PI)}, 5000)
               // .to( {x:-0.7, y:-1.3, z:1.4}, 3000) 
                .repeat(Infinity)
                // .easing(TWEEN.Easing.Cubic.InOut)
                //.delay(300)
                .start();             
    });    
    
    // load office
    const office_loader = new GLTFLoader();
    url = new URL( './model/office.glb', import.meta.url );
    url = "" + url;
    office_loader.load(url, (gltf) => {
        office = gltf.scene.children[0];
        office.visible = true;
        office.scale.set(2, 2, 2);
        office.position.set(0, 1.5, 0);
        //scene.add(gltf.scene);
    });

    // load drawer
    const drawer_loader = new GLTFLoader();
    url = new URL( './model/drawer.glb', import.meta.url );
    url = "" + url;
    drawer_loader.load(url, (gltf) => {
        drawer = gltf.scene.children[0];
        drawer.visible = true;
        drawer.scale.set(2.7, 2.7, 2.7);
        drawer.position.set(0.5, -1.33, 1.07);
        //scene.add(gltf.scene);
    });  
    
    // create drawer cube
    function add_drawer() {
        const drawer_cube_geometry = new THREE.BoxGeometry(0.08, 0.55, 1.28);
        const drawer_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.6,
            transparent: true});
        const drawer_cube = new THREE.Mesh(drawer_cube_geometry, drawer_cube_material);
        drawer_cube.position.set(-0.16, -1.3, 1.78);
        drawer_cube.userData.name = 'drawer_cube';
        drawer_cube.userData.class = 'mouseover_object';
        drawer_cube.visible = false;
        return drawer_cube;
    }; 

    // create drawer content cube
    function add_drawercontent() {
        const drawercontent_cube_geometry = new THREE.BoxGeometry(0.81, 0.33, 0.6);
        const drawercontent_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.6,
            transparent: true});
        const drawercontent_cube = new THREE.Mesh(drawercontent_cube_geometry, drawercontent_cube_material);
        drawercontent_cube.position.set(-0.71, -1.4, 1.85);
        drawercontent_cube.userData.name = 'drawercontent_cube';
        drawercontent_cube.userData.class = 'mouseover_object';
        drawercontent_cube.visible = false;
        drawercontent_cube.rotation.y = 0.39;
        return drawercontent_cube;
    }; 
    
    // create closedrawer cube
    function add_closedrawer() {
        const closedrawer_cube_geometry = new THREE.BoxGeometry(0.08, 0.55, 1.28);
        const closedrawer_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.6,
            transparent: true});
        const closedrawer_cube = new THREE.Mesh(closedrawer_cube_geometry, closedrawer_cube_material);
        closedrawer_cube.position.set(-1.37, -1.3, 1.78);
        closedrawer_cube.userData.name = 'closedrawer_cube';
        closedrawer_cube.userData.class = 'mouseover_object';
        closedrawer_cube.visible = false;
        return closedrawer_cube;
    };   

    // create door cube
    function add_door() {
        const door_cube_geometry = new THREE.BoxGeometry(2.2, 5, 0.17);
        const door_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.6,
            transparent: true});
        const door_cube = new THREE.Mesh(door_cube_geometry, door_cube_material);
        door_cube.position.set(-3.11, 0.5, -5);
        door_cube.userData.name = 'door_cube';
        door_cube.userData.class = 'mouseover_object';
        door_cube.visible = true;
        return door_cube;
    };
    
    // create printer cube
    function add_printer() {
        const printer_cube_geometry = new THREE.BoxGeometry(0.77, 0.77, 0.87);
        const printer_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.6,
            transparent: true});
        const printer_cube = new THREE.Mesh(printer_cube_geometry, printer_cube_material);
        printer_cube.position.set(4.44, 0, 3.56);
        printer_cube.userData.name = 'printer_cube';
        printer_cube.userData.class = 'mouseover_object';
        printer_cube.visible = false;
        return printer_cube;
    };      

    // create note cube
    function add_note() {
        const note_cube_geometry = new THREE.BoxGeometry(0.19, 0.15, 0.19);
        const note_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.6,
            transparent: true});
        const note_cube = new THREE.Mesh(note_cube_geometry, note_cube_material);
        note_cube.position.set(1.22, 0.43, 0.18);
        note_cube.userData.name = 'note_cube';
        note_cube.userData.class = 'mouseover_object';
        note_cube.visible = false;
        return note_cube;
    };

    // create bin cube 
    function add_bin() {
        const bin_cube_geometry = new THREE.BoxGeometry(0.77, 0.87, 0.77);
        const bin_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const bin_cube = new THREE.Mesh(bin_cube_geometry, bin_cube_material);
        bin_cube.position.set(4.3, -1.47, -4.19);
        bin_cube.userData.name = 'bin_cube';
        bin_cube.userData.class = 'mouseover_object';
        bin_cube.visible = false;
        bin_cube.material.opacity = 0.2;
        return bin_cube;
    };

     // add wifi 
     function add_wifi() {
        const wifi_cube_geometry = new THREE.BoxGeometry(0.84, 0.21, 0.61);
        const wifi_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const wifi_cube = new THREE.Mesh(wifi_cube_geometry, wifi_cube_material);
        wifi_cube.position.set(-0.34, 0.54, -5.28);
        wifi_cube.userData.name = 'wifi_cube';
        wifi_cube.userData.class = 'mouseover_object';
        wifi_cube.visible = false;
        wifi_cube.material.opacity = 0.2;
        return wifi_cube;
    };

    // add calendar 
    function add_calendar() {
        const calendar_cube_geometry = new THREE.BoxGeometry(0.21, 0.52, 0.41);
        const calendar_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const calendar_cube = new THREE.Mesh(calendar_cube_geometry, calendar_cube_material);
        calendar_cube.position.set(4.83, 1.51, -3.75);
        calendar_cube.userData.name = 'calendar_cube';
        calendar_cube.userData.class = 'mouseover_object';
        calendar_cube.visible = false;
        calendar_cube.material.opacity = 0.2;
        return calendar_cube;
    };    
        
     // load livingroom /////////////////////////////////////////////
     const livingroom_loader = new GLTFLoader();
     url = new URL( './model/livingroom.glb', import.meta.url );
     url = "" + url;
     livingroom_loader.load(url, (gltf) => {
         livingroom = gltf.scene.children[0];
         livingroom.visible = true;
         livingroom.scale.set(2, 2, 2);
         livingroom.position.set(0, 1.5, 0);
         livingroom.matrixAutoUpdate = true;         
     });

     // load roomba 
     const roomba_loader = new GLTFLoader();
     url = new URL( './model/roomba.glb', import.meta.url );
     url = "" + url;
     roomba_loader.load(url, (gltf) => {
         roomba = gltf.scene.children[0];
         roomba.visible = true;
         roomba.scale.set(0.002, 0.002, 0.002);
         roomba.position.set(-3.9, -1.66, -1.9);
         roomba.matrixAutoUpdate = true;        
     });

    //add roombaCube 
    function add_roombaCube() {
        const roomba_cube_geometry = new THREE.BoxGeometry(1.2, 0.27, 1.3);
        const roomba_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const roomba_cube = new THREE.Mesh(roomba_cube_geometry, roomba_cube_material);
        roomba_cube.position.set(-3.9, -1.64, -1.4);
        roomba_cube.userData.name = 'roomba_cube';
        roomba_cube.userData.class = 'mouseover_object';
        roomba_cube.visible = false;
        roomba_cube.material.opacity = 0.2;
        return roomba_cube;
    };

     //add roombastartCube 
     function add_roombastart() {
        const roombastart_cube_geometry = new THREE.BoxGeometry(1, 0.27, 1);
        const roombastart_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const roombastart_cube = new THREE.Mesh(roombastart_cube_geometry, roombastart_cube_material);
        roombastart_cube.position.set(-0.57, -1.61, 0.75 );   
        //z: 0.4, x: -3.89
        roombastart_cube.userData.name = 'roombastart_cube';
        roombastart_cube.userData.class = 'mouseover_object';
        roombastart_cube.visible = false;
        roombastart_cube.material.opacity = 0.2;
        return roombastart_cube;
    };

     //add camera_cube 
     function add_cctv() {
        const cctv_cube_geometry = new THREE.BoxGeometry(0.61, 0.41, 0.41);
        const cctv_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const cctv_cube = new THREE.Mesh(cctv_cube_geometry, cctv_cube_material);
        cctv_cube.position.set(3.89, 3.89, -4.58);
        cctv_cube.userData.name = 'cctv_cube';
        cctv_cube.userData.class = 'mouseover_object';
        cctv_cube.visible = false;
        cctv_cube.rotation.z = 0.3;
        cctv_cube.material.opacity = 0.2;
        return cctv_cube;
    };   

    //add xbox_cube 
    function add_xbox() {
        const xbox_cube_geometry = new THREE.BoxGeometry(0.47, 0.68, 0.19);
        const xbox_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const xbox_cube = new THREE.Mesh(xbox_cube_geometry, xbox_cube_material);
        xbox_cube.position.set(-4.17, -0.02, -2.71);
        xbox_cube.userData.name = 'xbox_cube';
        xbox_cube.userData.class = 'mouseover_object';
        xbox_cube.visible = false;
        xbox_cube.material.opacity = 0.2;
        return xbox_cube;
    };

     //add controller_cube 
     function add_controller() {
        const controller_cube_geometry = new THREE.BoxGeometry(0.36, 0.14, 0.23);
        const controller_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const controller_cube = new THREE.Mesh(controller_cube_geometry, controller_cube_material);
        controller_cube.position.set(2.89, -0.57, 4.14);
        controller_cube.userData.name = 'controller_cube';
        controller_cube.userData.class = 'mouseover_object';
        controller_cube.rotation.y = -0.83;
        controller_cube.visible = false;
        controller_cube.material.opacity = 0.2;
        return controller_cube;
    };

     //add tablet_cube 
     function add_tablet() {
        const tablet_cube_geometry = new THREE.BoxGeometry(0.9, 0.04, 0.6);
        const tablet_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const tablet_cube = new THREE.Mesh(tablet_cube_geometry, tablet_cube_material);
        tablet_cube.position.set(0.61, 0.54, -1.81);
        tablet_cube.userData.name = 'tablet_cube';
        tablet_cube.userData.class = 'mouseover_object';
        tablet_cube.rotation.y = 0.45;
        tablet_cube.visible = false;
        tablet_cube.material.opacity = 0.2;
        return tablet_cube;
    };

    //add laptop_cube 
    function add_laptop() {
        const laptop_cube_geometry = new THREE.BoxGeometry(0.67, 0.04, 0.97);
        const laptop_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const laptop_cube = new THREE.Mesh(laptop_cube_geometry, laptop_cube_material);
        laptop_cube.position.set(0.61, 0.54, -0.02);
        laptop_cube.userData.name = 'laptop_cube';
        laptop_cube.userData.class = 'mouseover_object';
        laptop_cube.rotation.y = -0.11;
        laptop_cube.visible = false;
        laptop_cube.material.opacity = 0.2;
        return laptop_cube;
    };

    //add pizza_cube 
    function add_pizza() {
        const pizza_cube_geometry = new THREE.BoxGeometry(0.54, 0.06, 0.42);
        const pizza_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const pizza_cube = new THREE.Mesh(pizza_cube_geometry, pizza_cube_material);
        pizza_cube.position.set(1.23, 0.61, 1.99);
        pizza_cube.userData.name = 'pizza_cube';
        pizza_cube.userData.class = 'mouseover_object';
        pizza_cube.rotation.y = -0.02;
        pizza_cube.visible = false;
        pizza_cube.material.opacity = 0.2;
        return pizza_cube;
    };

    //add alexa_cube 
    function add_alexa() {
        const alexa_cube_geometry = new THREE.BoxGeometry(0.21, 0.37, 0.25);
        const alexa_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const alexa_cube = new THREE.Mesh(alexa_cube_geometry, alexa_cube_material);
        alexa_cube.position.set(-4.27, -0.16, -0.03);
        alexa_cube.userData.name = 'alexa_cube';
        alexa_cube.userData.class = 'mouseover_object';
        alexa_cube.visible = false;
        alexa_cube.material.opacity = 0.2;
        return alexa_cube;
    };

    //add calendar_cube 
    function add_calendar() {
        const calendar_cube_geometry = new THREE.BoxGeometry(0.21, 0.52, 0.41);
        const calendar_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const calendar_cube = new THREE.Mesh(calendar_cube_geometry, calendar_cube_material);
        calendar_cube.position.set(4.83, 1.51, -3.75);
        calendar_cube.userData.name = 'calendar_cube';
        calendar_cube.userData.class = 'mouseover_object';
        calendar_cube.visible = false;
        calendar_cube.material.opacity = 0.2;
        return calendar_cube;
    };

    //add alarm_cube 
    function add_alarm() {
        const alarm_cube_geometry = new THREE.BoxGeometry(0.19, 0.2, 0.45);
        const alarm_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const alarm_cube = new THREE.Mesh(alarm_cube_geometry, alarm_cube_material);
        alarm_cube.position.set(-5.2, 1.3, 0.75);
        alarm_cube.userData.name = 'alarm_cube';
        alarm_cube.userData.class = 'mouseover_object';
        alarm_cube.visible = false;
        alarm_cube.material.opacity = 0.2;
        return alarm_cube;
    };

    //add vent_cube 
    function add_vent() {
        const vent_cube_geometry = new THREE.BoxGeometry(0.45, 0.54, 0.45);
        const vent_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const vent_cube = new THREE.Mesh(vent_cube_geometry, vent_cube_material);
        vent_cube.position.set(-3.75, 1.37, 1.51);
        vent_cube.userData.name = 'vent_cube';
        vent_cube.userData.class = 'mouseover_object';
        vent_cube.visible = false;
        vent_cube.material.opacity = 0.2;
        return vent_cube;
    };

    //add docs_cube 
    function add_docs() {
        const docs_cube_geometry = new THREE.BoxGeometry(0.86, 0.06, 0.6);
        const docs_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const docs_cube = new THREE.Mesh(docs_cube_geometry, docs_cube_material);
        docs_cube.position.set(0.33, 0.54, 2.34);
        docs_cube.userData.name = 'docs_cube';
        docs_cube.userData.class = 'mouseover_object';
        docs_cube.rotation.y = -0.31;
        docs_cube.visible = false;
        docs_cube.material.opacity = 0.2;
        return docs_cube;
    };

    //add smartcontrol_cube 
    function add_smartcontrol() {
        const smartcontrol_cube_geometry = new THREE.BoxGeometry(0.13, 0.39, 0.56);
        const smartcontrol_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const smartcontrol_cube = new THREE.Mesh(smartcontrol_cube_geometry, smartcontrol_cube_material);
        smartcontrol_cube.position.set(4.8, 1.1, -1.22);
        smartcontrol_cube.userData.name = 'smartcontrol_cube';
        smartcontrol_cube.userData.class = 'mouseover_object';
        smartcontrol_cube.visible = false;
        smartcontrol_cube.material.opacity = 0.2;
        return smartcontrol_cube;
    };

    //add tv_cube 
    function add_tv() {
        const tv_cube_geometry = new THREE.BoxGeometry(0.22, 1.01, 1.67);
        const tv_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const tv_cube = new THREE.Mesh(tv_cube_geometry, tv_cube_material);
        tv_cube.position.set(-4.05, 0.37, -1.09);
        tv_cube.userData.name = 'tv_cube';
        tv_cube.userData.class = 'mouseover_object';
        tv_cube.visible = false;
        tv_cube.material.opacity = 0.2;
        return tv_cube;
    };

    // load factory ///////////////
     const factory_loader = new GLTFLoader();
     url = new URL( './model/factory.glb', import.meta.url );
     url = "" + url;
     factory_loader.load(url, (gltf) => {
         factory = gltf.scene.children[0];
         factory.visible = true;
         factory.scale.set(1, 1, 1);
         factory.position.set(0, 3.2, 0);        
    });

    // load factory walls ///////////////
    const factorywalls_loader = new GLTFLoader();
    url = new URL( './model/factorywalls.glb', import.meta.url );
    url = "" + url;
    factorywalls_loader.load(url, (gltf) => {
        factorywalls = gltf.scene.children[0];
        factorywalls.visible = true;
        factorywalls.scale.set(1, 1, 1);
        factorywalls.position.set(0, 3.2, 0);        
   });

     // add car cube 
     function add_car() {
        const car_cube_geometry = new THREE.BoxGeometry(0.64, 0.44, 1.2);
        const car_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const car_cube = new THREE.Mesh(car_cube_geometry, car_cube_material);
        car_cube.position.set(-1.11, 0.37, 2.36);
        car_cube.rotation.y = 0.23
        car_cube.userData.name = 'car_cube';
        car_cube.userData.class = 'mouseover_object';
        car_cube.visible = false;
        car_cube.material.opacity = 0.2;
        return car_cube;
    };

     // add trash cube 
     function add_trash() {
        const trash_cube_geometry = new THREE.BoxGeometry(1.04, 0.44, 0.44);
        const trash_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const trash_cube = new THREE.Mesh(trash_cube_geometry, trash_cube_material);
        trash_cube.position.set(0.25, 0.46, -2.99);
        trash_cube.userData.name = 'trash_cube';
        trash_cube.userData.class = 'mouseover_object';
        trash_cube.visible = false;
        trash_cube.material.opacity = 0.2;
        return trash_cube;
    };

    // add backpack cube 
    function add_backpack() {
        const backpack_cube_geometry = new THREE.BoxGeometry(0.15, 0.12, 0.15);
        const backpack_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const backpack_cube = new THREE.Mesh(backpack_cube_geometry, backpack_cube_material);
        backpack_cube.position.set(0.08, 0.48, 2.56);
        backpack_cube.rotation.y = -0.4;
        backpack_cube.userData.name = 'backpack_cube';
        backpack_cube.userData.class = 'mouseover_object';
        backpack_cube.visible = false;
        backpack_cube.material.opacity = 0.2;
        return backpack_cube;
    };

    // add USB drive cube
    function add_usb() {
        const usb_cube_geometry = new THREE.BoxGeometry(0.08, 0.02, 0.05);
        const usb_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const usb_cube = new THREE.Mesh(usb_cube_geometry, usb_cube_material);
        usb_cube.position.set(2.13, 0.44, 3.40);
        usb_cube.userData.name = 'usb_cube';
        usb_cube.userData.class = 'mouseover_object';
        usb_cube.visible = true;
        usb_cube.material.opacity = 0.2;
        usb_cube.rotation.y = -0.32;
        return usb_cube;
    };

    // add entrance cube
    function add_entrance() {
        const entrance_cube_geometry = new THREE.BoxGeometry(0.54, 0.54, 0.05);
        const entrance_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const entrance_cube = new THREE.Mesh(entrance_cube_geometry, entrance_cube_material);
        entrance_cube.position.set(2.66, 0.72, 3.12);
        entrance_cube.userData.name = 'entrance_cube';
        entrance_cube.userData.class = 'mouseover_object';
        entrance_cube.visible = true;
        entrance_cube.material.opacity = 0.2;
        return entrance_cube;
    };
    
    //add video cube      
 
    // let videofile = document.createElement('video');
    // videofile.src = "../model/rickroll.mp4";
    // videofile.load();

    // let videoTexture = new THREE.VideoTexture(videofile);        
    //     //videoTexture.minFilter = THREE.LinearFilter;
    //     //videoTexture.magFilter = THREE.LinearFilter;
    
    // let video_material = new THREE.MeshStandardMaterial({
    //     map: videoTexture,
    //     side: THREE.FrontSide,
    //     toneMapped: false,
    // });
    // const video_geometry = new THREE.BoxGeometry(2, 2, 2);

    // const video = new THREE.Mesh(video_geometry, video_material);

    // video.position.set(2, 2, 2);
    // video.visible = true;       

    // load pass     
     const pass_loader = new GLTFLoader();
     url = new URL( './model/pass.glb', import.meta.url );
     url = "" + url;
     pass_loader.load(url, (gltf) => {
         pass = gltf.scene.children[0];
         pass.visible = false;
         pass.scale.set(10, 10, 10);
         pass.position.set(0, 0.7, 0);         
    });     

    // load fail
    const fail_loader = new GLTFLoader();
    url = new URL( './model/fail.glb', import.meta.url );
    url = "" + url;
    fail_loader.load(url, (gltf) => {
        fail = gltf.scene.children[0];
        fail.visible = false;
        fail.scale.set(10, 10, 10);
        fail.position.set(0, 0.7, 0);         
    });

    bin = add_bin();
    printer = add_printer();
    door = add_door();
    note = add_note();
    cctv = add_cctv();
    car = add_car();
    trash = add_trash();
    alexa = add_alexa();
    backpack = add_backpack();
    smartcontrol = add_smartcontrol();
    tv = add_tv();
    usb = add_usb();
    entrance = add_entrance();
    wifi = add_wifi();
    drawerCube = add_drawer();
    roombaCube = add_roombaCube();
    xbox = add_xbox();
    controller = add_controller();
    tablet = add_tablet();
    laptop = add_laptop();
    pizza = add_pizza();
    calendar = add_calendar();
    alarm = add_alarm();
    vent = add_vent();
    docs = add_docs();
    closedrawer = add_closedrawer();
    drawercontent = add_drawercontent();
    roombastartCube = add_roombastart();
    
    removeEventListener('mousemove', moveOnObjects);
    removeEventListener('click', clickOnObjects);      
    
    // BUTTONS - Change scenes /////////////////////////////////////////////////////////////

    function buttons_init() {
        //Initialize and hide buttons
        let button_next_1 = document.getElementById("button_next_1");
        button_next_1.style.display = "none"; 
        
        let button_next_2 = document.getElementById("button_next_2");
        button_next_2.style.display = "none"; 
        
        let button_next_3 = document.getElementById("button_next_3");
        button_next_3.style.display = "none"; 
        
        let button_restart = document.getElementById("button_restart");
        button_restart.style.display = "none"; 
        
        // Hide on screen counter for quizzes left in scene
        let quizCount = document.getElementById("quizzesleft");
        quizCount.style.display = "none"; 
                
        //Button start and show livingroom /////////////////
        let button_start = document.getElementById("button_start");        

        button_start.addEventListener("click", function() {
            //reset Quiz counter per scene 
            quizCount.style.display = "block";
            window.numQuiz = 0;
            window.quizzesPerScene = 4;
            //quizCount = document.getElementById("quizzesleft");
            quizCount.innerHTML = quizzesPerScene + " Quiz Questions left";
            scene.remove(world);
            composer.removePass(bloomPass);
            composer.removePass(glitchPass);
            scene.add(livingroom, cctv, roomba, roombaCube, alexa, smartcontrol, tv, xbox, controller);
            controls.enabled = true;
            addEventListener('mousemove', moveOnObjects);
            addEventListener('click', clickOnObjects);
            controls.reset(); 
            controls.enablePan = false; 
            //ambientLight.intensity = 0.01;
            button_start.style.display = "none";
            button_next_1.style.display = "block";
                        
            // Change Headline //////////////////////////
            
            // Delete old Headline
            let hlstart = document.querySelector('.flex-container > .main-content > h1');
            hlstart.remove();
                   
            // Create and insert new Headline
            let hl2 = document.createElement('h1');
            let hl2text = document.createTextNode("The Livingroom");
            hl2.appendChild(hl2text);
            let main = document.querySelector('.flex-container > .main-content');
            main.insertAdjacentElement("afterbegin", hl2);

            // Change description //////////////////////////
            
            // Delete old description
            let description_start = document.querySelector('.flex-container > .main-content > p');
            //description_start.remove();
                   
            // Create and insert new description
            let description2 = document.createElement('p');
            let description2text = document.createTextNode("A modern living room, equipped with a few conveniences that a smart home provides. But is it also as safe as it is comfortable? Your first mission: Take a good look around and search for vulnerabilities. Note: Security gaps can also lurk where they are not visible at first glance. When finished, click NEXT to move to the following scene.");
            description2.appendChild(description2text);
            description_start.replaceWith(description2); 
                      
        });

        //Button show home office /////////////////////////////////////
        button_next_1.addEventListener("click", function () {
            //reset Quiz counter per scene 
            window.numQuiz = 0;
            window.quizzesPerScene = 4;
            quizCount.innerHTML = quizzesPerScene + " Quiz Questions left";
            scene.remove(livingroom, cctv, roomba, roombaCube, alexa, smartcontrol, tv, xbox, controller, roombastartCube);
            scene.add(office, bin, printer, door, note, wifi, drawer, drawerCube, tablet, laptop, pizza, calendar, docs);
            controls.reset();
            controls.enablePan = false;                    
                        
            //ambientLight.intensity = 2;
            button_next_1.style.display = "none";
            button_next_2.style.display = "block";
            
            // Delete old Headline
            let hl2 = document.querySelector('.flex-container > .main-content > h1');
            hl2.remove();
                   
            // Create and insert new Headline
            let hl3 = document.createElement('h1');
            let hl3text = document.createTextNode("The Work-From-Home Environment");
            hl3.appendChild(hl3text);
            let main = document.querySelector('.flex-container > .main-content');
            main.insertAdjacentElement("afterbegin", hl3);                       

            // Change description //////////////////////////
            
            // Old description
            let description2 = document.querySelector('.flex-container > .main-content > p');                               
            // Replace description
            let description3 = document.createElement('p');
            let description3text = document.createTextNode("Working from home is just not the same as working on-site, in the organization. But how safe is it? Only you can find out. Take a thorough look around. Then click NEXT to move to the following scene.");
            description3.appendChild(description3text);
            description2.replaceWith(description3);            
        });

        //Button show Factory ///////////////////////////////////////////////////////////////////////
        button_next_2.addEventListener("click", function () {
            //reset Quiz counter per scene 
            window.numQuiz = 0;
            window.quizzesPerScene = 4;
            quizCount.innerHTML = quizzesPerScene + " Quiz Questions left";
            scene.remove(office, bin, printer, door, note, wifi, drawer, closedrawer, drawerCube, drawercontent, tablet, laptop, pizza, calendar, docs);
            scene.add(factory, car, trash, backpack, usb, entrance, alarm, vent, factorywalls);
            controls.reset();
            controls.enablePan = false;
            button_next_2.style.display = "none";
            button_next_3.style.display = "block";

            // Delete old HL
            let hl3 = document.querySelector('.flex-container > .main-content > h1');
            hl3.remove();                    
            // Create and insert new Headline
            let hl4 = document.createElement('h1');
            let hl4text = document.createTextNode("The Company Premises");
            hl4.appendChild(hl4text);
            let main = document.querySelector('.flex-container > .main-content');
            main.insertAdjacentElement("afterbegin", hl4);                      

            // Change description //////////////////////////
            
            // Old description
            let description3 = document.querySelector('.flex-container > .main-content > p');                               
            // Replace description
            let description4 = document.createElement('p');
            let description4text = document.createTextNode("A typical medium-sized company. Take a look around the premises and the building. Can you find the security gaps that criminals could exploit? Click NEXT to see your results.");
            description4.appendChild(description4text);
            description3.replaceWith(description4);                                    
        });

    // Button show Score page ////////////////////////////////////////////////////////////
    button_next_3.addEventListener("click", function () {
        //reset Quiz counter per scene 
        quizCount.style.display = "none";
        window.numQuiz = 0;
        window.quizzesPerScene = 0;

        scene.remove(factory, car, trash, backpack, usb, entrance, alarm, vent, factorywalls);
        scene.add(pass, fail);
        controls.enabled = false;
        //pass.visible = false;
        //fail.visible = false;
        controls.reset();        
        controls.enablePan = false;
        button_next_3.style.display = "none";
        button_restart.style.display = "block";          

        // Change description //////////////////////////
        // Old description
        let description4 = document.querySelector('.flex-container > .main-content > p');                               
        // Replace description
        let description5 = document.createElement('p');
        let description5text = document.createTextNode("This is the end of your mission. We hope you had the same fun playing what we had creating this game. See you next time!");
        description5.appendChild(description5text);
        description4.replaceWith(description5);
               
        if (window.numCorrect >= 5 ) {            
            pass.visible = true;
            fail.visible = false;
            
            composer.addPass(bloomPass);

            new TWEEN.Tween(pass.rotation)
               .to({ y: -(2 * Math.PI)}, 5000)
               // .to( {x:-0.7, y:-1.3, z:1.4}, 3000) 
                .repeat(Infinity)
                // .easing(TWEEN.Easing.Cubic.InOut)
                //.delay(300)
                .start(); 

                // Delete old HL
                let hl4 = document.querySelector('.flex-container > .main-content > h1');
                hl4.remove();                    
                // Create and insert new Headline for pass
                let hl5 = document.createElement('h1');
                hl5.setAttribute('id','score-pass');
                let hl5text = document.createTextNode(window.numCorrect +" out of 12 questions answered correctly.\n \n Congratulations, you passed!");
                hl5.appendChild(hl5text);
                let main = document.querySelector('.flex-container > .main-content');
                main.insertAdjacentElement("afterbegin", hl5);  
                
                // Change description //////////////////////////
                // Old description
                let description4 = document.querySelector('.flex-container > .main-content > p');                               
                // Replace description for pass
                let description5 = document.createElement('p');
                let description5text = document.createTextNode("Good job! You have demonstrated your skills as a Cyber Forensic Investigator. If you want to play again, click RESTART.");
                description5.appendChild(description5text);
                description4.replaceWith(description5);

            } else {  

                pass.visible = false;
                fail.visible = true;

                composer.addPass(glitchPass);

                new TWEEN.Tween(fail.rotation)
               .to({ y: -(2 * Math.PI)}, 5000)
               // .to( {x:-0.7, y:-1.3, z:1.4}, 3000) 
                .repeat(Infinity)
                // .easing(TWEEN.Easing.Cubic.InOut)
                //.delay(300)
                .start(); 

                // Delete old HL
                let hl4 = document.querySelector('.flex-container > .main-content > h1');
                hl4.remove();                    
                // Create and insert new Headline for fail
                let hl5 = document.createElement('h1');
                hl5.setAttribute('id','score-fail');
                let hl5text = document.createTextNode(window.numCorrect +" out of 12 questions answered correctly.\n \n Sorry, you didn't pass.");
                hl5.appendChild(hl5text);
                let main = document.querySelector('.flex-container > .main-content');
                main.insertAdjacentElement("afterbegin", hl5);
                
                // Change description //////////////////////////
                // Old description
                let description4 = document.querySelector('.flex-container > .main-content > p');                               
                // Replace description for fail
                let description5 = document.createElement('p');
                let description5text = document.createTextNode("Too bad, that hasn't worked out yet. But why not try again? To do so, simply click on RESTART. Good luck!");
                description5.appendChild(description5text);
                description4.replaceWith(description5);
        };       
    });
        
        //Button restart
        button_restart.addEventListener("click", function () {

            location.reload(true);                   
                                   
        });        
    };    
    buttons_init();   
};

// RAYCASTER ////////////////////////////////////////////////////////////////////

// Raycaster onClick on Clickobjects /////////////////////////////////////////

const raycaster_click = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();

var clickOnObjects = function (event) {
    
    const rect = renderer.domElement.getBoundingClientRect();
    clickMouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    clickMouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    raycaster_click.setFromCamera(clickMouse, camera);

    const found = raycaster_click.intersectObjects(scene.children, true);

    function clickQuizObject (quizObject, quizContainerObject, feedbackContainerObject, submitButtonObject, object, closeObject) {
        removeEventListener('mousemove', moveOnObjects); 
        removeEventListener('click', clickOnObjects);
        generateQuiz(quizObject, quizContainerObject, feedbackContainerObject, submitButtonObject);
        var modal = document.getElementById(object);                
        var close = document.getElementById(closeObject);
        modal.style.display = "block";                 
        //close modal               
        close.onclick = function() {
        modal.style.display = "none";
        addEventListener('mousemove', moveOnObjects); 
            setTimeout(function() {
                addEventListener('click', clickOnObjects);    
            }, 100);
        }; 
    };  

    function clickInfoObject (object, closeObject) {
        removeEventListener('mousemove', moveOnObjects); 
        removeEventListener('click', clickOnObjects);
        var modal = document.getElementById(object);
        var close = document.getElementById(closeObject);
        modal.style.display = "block";
        //close modal
        close.onclick = function() {
        modal.style.display = "none";
        addEventListener('mousemove', moveOnObjects); 
            setTimeout(function() {
                addEventListener('click', clickOnObjects);    
            }, 100);
        };    
    };
            
    switch (found.length > 0 && found[0].object.userData.name) {
        
            case 'printer_cube':
                clickQuizObject(quizPrinter, quizContainerPrinter, feedbackContainerPrinter, submitButtonPrinter, "printer", "closePrinter");                               
            break;
        
            case 'note_cube':
                clickQuizObject(quizNote, quizContainerNote, feedbackContainerNote, submitButtonNote, "note", "closeNote");             
            break;

            case 'bin_cube':
                clickQuizObject(quizBin, quizContainerBin, feedbackContainerBin, submitButtonBin, "bin", "closeBin");                               
            break;
        
            case 'door_cube':
                clickInfoObject ("door", "closeDoor");                  
            break;

            case 'cctv_cube':
                clickInfoObject ("cctv", "closeCctv");                  
            break; 
            
            case 'roomba_cube':                                 
                var tweenRotate = new TWEEN.Tween(roomba.rotation)
               .to({ z: (0.24 * Math.PI)}, 1000)
               .repeat(0)
                var tweenMove = new TWEEN.Tween(roomba.position)
               .to({ z: 0.4, x: -0.9}, 3000)
               .repeat(0)
                tweenRotate.chain(tweenMove);
                tweenRotate.start();    
                scene.remove(roombaCube);
                setTimeout(() => {scene.add(roombastartCube);},4000); 
                                           
            break;

            case 'roombastart_cube':  
                clickQuizObject(quizRoomba, quizContainerRoomba, feedbackContainerRoomba, submitButtonRoomba, "roomba", "closeRoomba"); 
            break;      

            case 'car_cube':
                clickInfoObject("car", "closeCar");                               
            break;

            case 'trash_cube':
                clickQuizObject(quizTrash, quizContainerTrash, feedbackContainerTrash, submitButtonTrash, "trash", "closeTrash");                               
            break;

            case 'alexa_cube':
                clickQuizObject(quizAlexa, quizContainerAlexa, feedbackContainerAlexa, submitButtonAlexa, "alexa", "closeAlexa");                               
            break;

            case 'backpack_cube':
                clickQuizObject(quizBackpack, quizContainerBackpack, feedbackContainerBackpack, submitButtonBackpack, "backpack", "closeBackpack");                               
            break;

            case 'smartcontrol_cube':
                clickQuizObject(quizSmartcontrol, quizContainerSmartcontrol, feedbackContainerSmartcontrol, submitButtonSmartcontrol, "smartcontrol", "closeSmartcontrol");                               
            break;

            case 'tv_cube':
                clickQuizObject(quizTv, quizContainerTv, feedbackContainerTv, submitButtonTv, "tv", "closeTv");                               
            break;

            case 'usb_cube':
                clickQuizObject(quizUsb, quizContainerUsb, feedbackContainerUsb, submitButtonUsb, "usb", "closeUsb");                               
            break;

            case 'entrance_cube':
                clickQuizObject(quizEntrance, quizContainerEntrance, feedbackContainerEntrance, submitButtonEntrance, "entrance", "closeEntrance");                                
            break;

            case 'xbox_cube':
                clickInfoObject("xbox", "closeXbox");                               
            break;

            case 'controller_cube':
                clickInfoObject("controller", "closeController");                               
            break;

            case 'tablet_cube':
                clickInfoObject("tablet", "closeTablet");                               
            break;

            case 'laptop_cube':
                clickInfoObject("laptop", "closeLaptop");                               
            break;

            case 'pizza_cube':
                clickInfoObject("pizza", "closePizza");                               
            break;

            case 'calendar_cube':
                clickInfoObject("calendar", "closeCalendar");                               
            break;

            case 'alarm_cube':
                clickInfoObject("alarm", "closeAlarm");                               
            break;

            case 'vent_cube':
                clickInfoObject("vent", "closeVent");                               
            break;

            case 'docs_cube':
                clickInfoObject("docs", "closeDocs");                               
            break;

            case 'drawercontent_cube':
                clickInfoObject("drawercontent", "closeDrawercontent");                               
            break;

            case 'wifi_cube':
                clickQuizObject(quizWifi, quizContainerWifi, feedbackContainerWifi, submitButtonWifi, "wifi", "closeWifi");                               
            break;

            case 'drawer_cube':
                new TWEEN.Tween(drawer.position)
                .to( {x:-0.7, y:-1.33, z:1.07}, 1500)
                .repeat(0)
                .easing(TWEEN.Easing.Cubic.InOut)
                .delay(150)
                .start(); 
                scene.remove(drawerCube);
                setTimeout(() => {scene.add(closedrawer, drawercontent)},1600);                               
            break;

            case 'closedrawer_cube':
                new TWEEN.Tween(drawer.position)
                .to( {x:0.5, y:-1.33, z:1.07}, 1500)  
                .repeat(0)
                .easing(TWEEN.Easing.Cubic.InOut)
                .delay(150)
                .start(); 
                setTimeout(() => {scene.add(drawerCube)},1600);
                scene.remove(closedrawer, drawercontent);
                                               
            break;
    };
};

addEventListener('click', clickOnObjects);

// Raycaster onMouseOver Clickobjects/////////////////////////////////////////

const raycaster_move = new THREE.Raycaster();
const moveMouse = new THREE.Vector2();

var moveOnObjects = function (event) {
        //function onPointerMove(event) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        const rect = renderer.domElement.getBoundingClientRect();
        moveMouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
        moveMouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

        // update the picking ray with the camera and pointer position
        raycaster_move.setFromCamera(moveMouse, camera);

        // calculate objects intersecting the picking ray
        const found = raycaster_move.intersectObjects(scene.children);

        switch (found.length > 0 && found[0].object.userData.name) {
            case 'printer_cube':
                printer.visible = true;
                break;

            case 'note_cube':
                note.visible = true;
                    break;

            case 'bin_cube':
                bin.visible = true;
                break;

            case 'door_cube':
                door.visible = true;
                break;

            case 'cctv_cube':
                cctv.visible = true;
                break;

            case 'roomba_cube':
                roombaCube.visible = true;
                break;
            
            case 'roombastart_cube':
                roombastartCube.visible = true;
                break;

            case 'car_cube':
                car.visible = true;
                break;

            case 'trash_cube':
                trash.visible = true;
                break;

            case 'alexa_cube':
                alexa.visible = true;
                break;

            case 'backpack_cube':
                backpack.visible = true;
                break;

            case 'smartcontrol_cube':
                smartcontrol.visible = true;
                break;

            case 'tv_cube':
                tv.visible = true;
                break;

            case 'usb_cube':
                usb.visible = true;
                break;

             case 'entrance_cube':
                entrance.visible = true;
                break;

            case 'wifi_cube':
                wifi.visible = true;
                break;

            case 'drawer_cube':
                drawerCube.visible = true;
                break;

            case 'xbox_cube':
                xbox.visible = true;
                break;

            case 'controller_cube':
                controller.visible = true;
                break;

            case 'tablet_cube':
                tablet.visible = true;
                break;
                
            case 'laptop_cube':
                laptop.visible = true;
                break;
                
            case 'pizza_cube':
                pizza.visible = true;
                break; 

            case 'calendar_cube':
                calendar.visible = true;
                break; 

            case 'alarm_cube':
                alarm.visible = true;
                break;
                
            case 'vent_cube':
                vent.visible = true;
                break;

            case 'docs_cube':
                docs.visible = true;
                break;

            case 'closedrawer_cube':
                closedrawer.visible = false;
                break;

             case 'drawercontent_cube':
                drawercontent.visible = true;
                break;

            case 'drawerCube':
                drawerCube.visible = true;
                break;

            default:
                bin.visible = false;
                printer.visible = false;
                door.visible = false;
                note.visible = false;
                cctv.visible = false;
                car.visible = false;
                trash.visible = false;
                alexa.visible = false;
                backpack.visible = false;
                smartcontrol.visible = false;
                tv.visible = false;
                usb.visible = false;
                entrance.visible = false;
                wifi.visible = false;
                drawerCube.visible = false;
                roombaCube.visible = false;
                xbox.visible = false;
                controller.visible = false;
                tablet.visible = false;
                laptop.visible = false;
                pizza.visible = false;
                calendar.visible = false;
                alarm.visible = false;
                vent.visible = false;
                docs.visible = false;
                closedrawer.visible = false;
                drawercontent.visible = false;
                roombastartCube.visible = false;
                break;
        };
    };

window.addEventListener('mousemove', moveOnObjects);

// Generate Quizzes ////////////////////////////////////////////////////////////////////

window.numCorrect = 0;
window.numQuiz = 0;
window.quizzesPerScene = 0;
//quizCount;

function generateQuiz(questions, quizContainer, feedbackContainer, submitButton){

    function showQuestions(questions, quizContainer){
        // we'll need a place to store the output and the answer choices
        var output = [];
        var answers;
                    
        // for each question...
        for(var i=0; i<questions.length; i++){
            
            // first reset the list of answers
            answers = [];
    
            // for each available answer to this question...
            for(letter in questions[i].answers){
    
                // ...add an html radio button
                answers.push(
                    '<label>'
                        + '<br>'
                        + '<input type="radio" class="radiobutton" name="question'+i +'" value="'+letter +'">'
                        + ' '
                        + questions[i].answers[letter]
                        + '<br>'
                    + '</label>'
                );
            }
    
            // add this question and its answers to the output
            output.push(
                '<div id="question" class="question">' + questions[i].question + '</div>' 
                + '<div id="answer" class="answers">' + answers.join('') + '</div>'
            );
        }
    
        // finally combine our output list into one string of html and put it on the page
        quizContainer.innerHTML = output.join('');
    };   
    
        function showResults(questions, quizContainer, feedbackContainer){
	
        // gather answer containers from our quiz
        var answerContainers = quizContainer.querySelectorAll('.answers');
        
        // keep track of user's answers
        var userAnswer = '';
                                        
        // for each question...      

        for(var i=0; i<questions.length; i++){
    
            // find selected answer            
            userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')).value;              
            
            // Case correct answer
            if(userAnswer === questions[i].correctAnswer){              
                window.numCorrect += 1;
                feedbackContainer.style.color = 'mediumseagreen';
                //get feedback CORRECT from additiopnal property in questions[]
                feedback = '<br>' + questions[0].feedbackRight + '<br>' + '<br>';
                submitButton.disabled = true;                
                window.numQuiz += 1;
                quizzesLeft = quizzesPerScene - window.numQuiz;
                quizCount = document.getElementById("quizzesleft");
                quizCount.innerHTML = quizzesLeft + " Quiz Questions left";
                }
            
            // Case wrong answer
            else if (userAnswer != questions[i].correctAnswer) {                
                feedbackContainer.style.color = 'firebrick';
                //get feedback WRONG from additiopnal property in myQuestions[]
                feedback = '<br>' + questions[0].feedbackWrong + '<br>' + '<br>';
                submitButton.disabled = true;         
                window.numQuiz += 1;
                quizzesLeft = window.quizzesPerScene - window.numQuiz;
                quizCount = document.getElementById("quizzesleft");
                quizCount.innerHTML = quizzesLeft + " Quiz Questions left";
            
            } else {
                submitButton.disabled = false;                
            }; 
        };           
        feedbackContainer.innerHTML = feedback; 
    };

	// show the questions
	showQuestions(questions, quizContainer);

	// when user clicks submit, show feedback abd store results
	submitButton.onclick = function(){
		showResults(questions, quizContainer, feedbackContainer);        
	};    
};

//Quiz content bin ////////////////////////////////

var quizContainerBin = document.getElementById('quizBin');
var feedbackContainerBin = document.getElementById('feedbackBin');
var submitButtonBin = document.getElementById('submitBin');

var quizBin = [
	{
		question: "An overflowing wastebasket. In it are a number of still legible documents, such as invoices, budget spreadsheets or printed e-mails (yes, some people still print out their e-mails). ",
		answers: {
			a: 'Under no circumstances should readable documents end up in the trash. They belong in the shredder first.',
			b: 'No problem, because the documents will be destroyed by the garbage collection at the latest.',
		},
		correctAnswer: 'a', 
        feedbackRight: 'True. Documents that are still readable can quickly fall into the wrong hands. They can thus become a valuable source of information for cybercriminals.',
        feedbackWrong: 'Not true. Just think what such documents could contain: Personal data, planning data or even passwords. A lot of damage if that falls into the wrong hands.'
	},
];

//Quiz content printer ////////////////////////////////////

var quizContainerPrinter = document.getElementById('quizPrinter');
var feedbackContainerPrinter = document.getElementById('feedbackPrinter');
var submitButtonPrinter = document.getElementById('submitPrinter');

var quizPrinter = [
	{
		question: 'This is a multifunctional printer. Beside printing it can scan documents, send mails and much more. Therefore data from connected devices is stored in the internal memory. What should users consider when using it for their job?',
		answers: {
			a: 'Modern multifunction printers have sufficient protection means so the data is protected.',
			b: 'The data of connected devices is stored in the printer and may be lost or fall in the wrong hands.',
        },
		correctAnswer: 'b',
        feedbackRight: 'True. Print jobs that are still stored in the printer can be printed out just as easily as data from old copies, faxes or print jobs that appear to have been deleted but are actually still present can be made visible again.',
        feedbackWrong: 'Wrong. There is a risk that data from the internal can fall into the wrong hands'
	},
];

//Quiz content note ////////////////////////////////////

var quizContainerNote = document.getElementById('quizNote');
var feedbackContainerNote = document.getElementById('feedbackNote');
var submitButtonNote = document.getElementById('submitNote');

var quizNote = [
	{
		question: "An unusual place for a note, especially if it still has a password on it. What do you think: Is it a good idea to write down passwords on notepads?",
		answers: {
			a: 'Why not? At least, this note is well hidden.',
			b: 'No, that is not a good idea at all!',
        },
		correctAnswer: 'b',
        feedbackRight: 'You are right. Writing down passswords on notes is never a good idea.',
        feedbackWrong: 'Are you sure? What if the note is lost and someone else gets the password?'
	},
];

// Quiz content roomba //////////

var quizContainerRoomba = document.getElementById('quizRoomba');
var feedbackContainerRoomba = document.getElementById('feedbackRoomba');
var submitButtonRoomba = document.getElementById('submitRoomba');

var quizRoomba = [
	{
		question: "Most robotic vacuum cleaners use mechanical and optical sensors and advanced software to do their job. And most are connected to the Internet. This means they collect a range of environmental data to do their job. Are there dangers in that?",
		answers: {
			a: 'No problem. These devices are safe.',
			b: 'Yes, because unfortunately not all manufacturers deliver regular security updates.',
			c: 'No. Manufacturers already make sure that smart robotic vacuum cleaners always have the latest software.',
                    },
		correctAnswer: 'b', 
        feedbackRight: 'That is right. Especially smaller manufacturers do not update their software regularly. And for some devices, support is discontinued after a short time.',
        feedbackWrong: 'Wrong. Not all manufacturers and devices can be relied upon for safety.'
	},
];

// Quiz content alexa //////////

var quizContainerAlexa = document.getElementById('quizAlexa');
var feedbackContainerAlexa = document.getElementById('feedbackAlexa');
var submitButtonAlexa = document.getElementById('submitAlexa');

var quizAlexa = [
	{
		question: 'This is a voice assistant connected to the internet. What do you have to keep in mind?',
		answers: {
			a: 'The sound quality of these devices is often not very good. This can pose a health risk.',
			b: 'Most voice assistants are powered by a non-rechargeable battery.',
			c: 'To function properly, it must accept voice commands. But it is not certain how long the corresponding recordings are stored by the manufacturer.',            
        },
		correctAnswer: 'c', 
        feedbackRight: 'Yes, that was right! Owners should carefully check whether their speech is recorded and how long the recordings are stored.',
        feedbackWrong: 'No. Think about it: Do you know if and when the device records the owner\'s voice?'
	},
];

//Quiz content backpack ////////////////////////////////////

var quizContainerBackpack = document.getElementById('quizBackpack');
var feedbackContainerBackpack = document.getElementById('feedbackBackpack');
var submitButtonBackpack = document.getElementById('submitBackpack');

var quizBackpack = [
	{
		question: 'This is a backpack and inside is a password protected laptop. Is this a security risk?',
		answers: {
			a: 'Yes! If the computer contains sensitive or confidential data, it should never be left out of sight or lying around. ',
			b: 'No, if the device is secured with a password and when the latest security updates are installed this is not a problem.',
        },
		correctAnswer: 'a',
        feedbackRight: 'Yes, tha\'s right. Outside and inside the building, IT equipment should never be left out of sight.',
        feedbackWrong: 'No, even if the device is password protected, it should never be left out of sight, especially when traveling.'
	},
];

//Quiz content trash container //////////////////////

var quizContainerTrash = document.getElementById('quizTrash');
var feedbackContainerTrash = document.getElementById('feedbackTrash');
var submitButtonTrash = document.getElementById('submitTrash');

var quizTrash = [
	{
		question: "Two dumpsters at the back of the building. How would you assess this?",
		answers: {
			a: 'It is just trash and of no value at all.',
			b: 'Cybercriminals could find valuable documents in here that have not been properly destroyed.',
			
        },
		correctAnswer: 'b', 
        feedbackRight: 'Correct! By the way, the practice to search for valuable documents and information in the garbage is called "dumpster diving".',
        feedbackWrong: 'No! Think twice: What could be among the trash like printouts with confidential information which have not been properly destroyed?'
	},
];


//Quiz content smart-control ////////////////////////////////////

var quizContainerSmartcontrol = document.getElementById('quizSmartcontrol');
var feedbackContainerSmartcontrol = document.getElementById('feedbackSmartcontrol');
var submitButtonSmartcontrol = document.getElementById('submitSmartcontrol');

var quizSmartcontrol = [
	{
		question: "This is a control monitor, the heart of a smart home. But what should be considered when setting it up? ",
		answers: {
			a: 'Nothing special. It is supposed to be a SMART home, right?',
			b: 'Always change the default password of every device you connect and set up an encrypted connection, if possible.',
        },
		correctAnswer: 'b',
        feedbackRight: 'Right. It is always a good idea to take secuity measures into account, when setting up a smart home.',
        feedbackWrong: 'No, smart does not necessarily mean, that devices are secure by default.'
	},
];

// Quiz content TV //////////

var quizContainerTv = document.getElementById('quizTv');
var feedbackContainerTv = document.getElementById('feedbackTv');
var submitButtonTv = document.getElementById('submitTv');

var quizTv = [
	{
		question: "This smart TV features facial recognition, gesture control, and voice recognition. How do you rate the safety of this device?",
		answers: {
			a: 'The technical possibilities pose a danger. So for example the camera should be covered if you do not want it to see too much.',
			b: 'Like all smart devices, a smart TV is secure from the factory.',
			c: 'Even if it\'s not save, it\'s just a TV after all, what\'s going to happen?',
                    },
		correctAnswer: 'a', 
        feedbackRight: 'Yes, that\'sright! All smart devices are potential backdoors for criminals.',
        feedbackWrong: 'Sorry, this is not the right answer. Imagine what would happen if a hacker gets access to the camera for example.'
	},
];

// Quiz content USB drive //////////

var quizContainerUsb = document.getElementById('quizUsb');
var feedbackContainerUsb = document.getElementById('feedbackUsb');
var submitButtonUsb = document.getElementById('submitUsb');

var quizUsb = [
	{
		question: "A USB flash drive, right in front of the entrance. What should you do with it now?",
		answers: {
			a: 'Under no circumstances should the drive be connected to a computer!',
			b: 'What a find! You should plug the stick into your computer and see what it contains. At least it\'s free storage.'			 
        },
		correctAnswer: 'a', 
        feedbackRight: 'Correct. It is quite possible that it was laid out here by cybercriminals to spread malware.',
        feedbackWrong: 'Not the right answer. In many cases, malware has already entered a network not via the Internet, but via an infected USB drive.'
	},
];

// Quiz content Factory entrance //////////
var quizContainerEntrance = document.getElementById('quizEntrance');
var feedbackContainerEntrance = document.getElementById('feedbackEntrance');
var submitButtonEntrance = document.getElementById('submitEntrance');

var quizEntrance = [
	{
		question: "The front door. An employee has just opened it with her key card. A person unknown to the employee asks her to let her through. What should the employee do?",
		answers: {
			a: 'The employee should be polite and also hold the door open for an unknown person.',
			b: 'The employee should not let the unknown person in under any circumstances.'			 
        },
		correctAnswer: 'b', 
        feedbackRight: 'Correct. Especially with an unknown person, it is not certain what their intentions are. ',
        feedbackWrong: 'Not the right answer. The person could be a criminal or someone who conducts industrial espionage.'
	},
];

//Quiz content wifi ////////////////////////////////

var quizContainerWifi = document.getElementById('quizWifi');
var feedbackContainerWifi = document.getElementById('feedbackWifi');
var submitButtonWifi = document.getElementById('submitWifi');

var quizWifi = [
	{
		question: "This is a Wifi router, the central hub for all connected devices. When checking it\'s password you find, that ist is ADMIN1234. What do you think?",
		answers: {
			a: 'No problem. Everything is fine here.',
			b: 'The term ADMIN may not be used in a password. It should be changed to SUPERHERO1234.',
			c: 'The password is completely insecure and should be replaced with a secure one as soon as possible.',
                    },
		correctAnswer: 'c', 
        feedbackRight: 'Yes, this is the right answer.Unprotected wifi networks can be quite dangerous.',
        feedbackWrong: 'No! This password is not secure. Hackers can easily get into such a network and take control over the connected devices.'
	},
];

// Render scene and camera
const render = () => {
    //renderer.render(scene, camera); 
    composer.render();   
};

// animation recursive function
function animate (time) {    
    TWEEN.update(time);
    requestAnimationFrame(animate);    
    render();
    controls.update();
    //video.needsUpdate = true;
};

 // making canvas responsive
 function windowResize() {
    camera.aspect = canvasSize.offsetWidth / canvasSize.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
    render();
};

//start scene
window.onload = init(), 
window.addEventListener('resize', windowResize, false);
animate();