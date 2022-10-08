import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'dat.gui';

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
    camera.translateX(-6);
    camera.translateY(11);
    camera.translateZ(7); 
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
    /* renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0); */

   //CONTROLS //////////////////////////////////////////////////////////////////
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.target.set(0,0,0);
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.dampingFactor = 3;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 5;
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
    
        var gui = new GUI();

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

    //testObject();

    // Load/Create OBJECTS //////////////////////////////////////////////////////////////////////
    
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

    // create bin cube ////////////////////////////////////////////////////////////////////
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
         livingroom.updateMatrix();
         //livingroom.rotation.x = Math.PI/-2;
         //livingrrom.rotation.y = 0.8;
         //scene.add(gltf.scene);
     });

     //add camera_cube //////////
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
        cctv_cube.material.opacity = 0.2;
        return cctv_cube;
    };

    //add roomba_cube //////////
    function add_roomba() {
        const roomba_cube_geometry = new THREE.BoxGeometry(1.4, 0.48, 1.3);
        const roomba_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const roomba_cube = new THREE.Mesh(roomba_cube_geometry, roomba_cube_material);
        roomba_cube.position.set(-4.05, -1.58, -1.4);
        roomba_cube.userData.name = 'roomba_cube';
        roomba_cube.userData.class = 'mouseover_object';
        roomba_cube.visible = false;
        roomba_cube.material.opacity = 0.2;
        return roomba_cube;
    };

     // load world ////////
     function add_world() {
     const world_loader = new GLTFLoader();
     url = new URL( './model/world.glb', import.meta.url );
     url = "" + url;
     world_loader.load(url, (gltf) => {
         world = gltf.scene.children[0];
         world.visible = true;
         world.scale.set(10, 10, 10);
         world.position.set(0, 0.7, 0);
         world.matrixAutoUpdate = true;
         world.updateMatrix();
         scene.add(world);
         return world;
        });
    };     

     // load factory
     const factory_loader = new GLTFLoader();
     url = new URL( './model/factory.glb', import.meta.url );
     url = "" + url;
     factory_loader.load(url, (gltf) => {
         factory = gltf.scene.children[0];
         factory.visible = true;
         factory.scale.set(1, 1, 1);
         factory.position.set(0, 3.2, 0);
         //factory.rotation.x = Math.PI/-2;
         //factory.rotation.y = 0.8;
         //scene.add(gltf.scene);
     });

     // load score
     const score_loader = new GLTFLoader();
     url = new URL( './model/score.glb', import.meta.url );
     url = "" + url;
     score_loader.load(url, (gltf) => {
         score = gltf.scene.children[0];
         score.visible = true;
         score.scale.set(10, 10, 10);
         score.position.set(0, 0.7, 0);         
     });

    bin = add_bin();
    printer = add_printer();
    door = add_door();
    note = add_note();
    cctv = add_cctv();
    world = add_world();
    roomba = add_roomba();

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
        
        //Button start and show livingroom
        let button_start = document.getElementById("button_start");        

        button_start.addEventListener("click", function() {
            scene.remove(world);
            scene.add(livingroom, cctv, roomba);
            controls.enabled = true;
            addEventListener('mousemove', moveOnObjects);
            addEventListener('click', clickOnObjects);
            controls.reset(); 
            controls.enablePan = false; 
            button_start.style.display = "none";
            button_next_1.style.display = "block";
            
            // Change Headline //////////////////////////
            
            // Delete old Headline
            let hlstart = document.querySelector('.flex-container > .main-content > h1');
            hlstart.remove();
                   
            // Create and insert new Headline
            let hl2 = document.createElement('h1');
            let hl2text = document.createTextNode("How Secure is Your Leisure Time?");
            hl2.appendChild(hl2text);
            let main = document.querySelector('.flex-container > .main-content');
            main.insertAdjacentElement("afterbegin", hl2);

            // Change description //////////////////////////
            
            // Delete old description
            let description_start = document.querySelector('.flex-container > .main-content > p');
            //description_start.remove();
                   
            // Create and insert new description
            let description2 = document.createElement('p');
            let description2text = document.createTextNode("Leisure Time: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.");
            description2.appendChild(description2text);
            description_start.replaceWith(description2);            
        });

        //Button show office
        button_next_1.addEventListener("click", function () {
            scene.remove(livingroom, cctv, roomba);
            scene.add(office, bin, printer, door, note);
            controls.reset();
            controls.enablePan = false;
            button_next_1.style.display = "none";
            button_next_2.style.display = "block";
            
            // Delete old Headline
            let hl2 = document.querySelector('.flex-container > .main-content > h1');
            hl2.remove();
                   
            // Create and insert new Headline
            let hl3 = document.createElement('h1');
            let hl3text = document.createTextNode("How Secure is Your Office at Home?");
            hl3.appendChild(hl3text);
            let main = document.querySelector('.flex-container > .main-content');
            main.insertAdjacentElement("afterbegin", hl3);                       

            // Change description //////////////////////////
            
            // Old description
            let description2 = document.querySelector('.flex-container > .main-content > p');                               
            // Replace description
            let description3 = document.createElement('p');
            let description3text = document.createTextNode("Office at Home: Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. »Wie ein Hund!« sagte er, es war, als sollte die Scham ihn überleben. Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt. Und es war ihnen wie eine Bestätigung ihrer neuen Träume und guten Absichten, als am Ziele ihrer Fahrt die Tochter als erste sich erhob und ihren jungen Körper dehnte.");
            description3.appendChild(description3text);
            description2.replaceWith(description3);            
        });

        //Button show Factory
        button_next_2.addEventListener("click", function () {
            scene.remove(office, bin, printer, door, note);
            scene.add(factory);
            controls.reset();
            controls.enablePan = false;
            button_next_2.style.display = "none";
            button_next_3.style.display = "block";

            // Delete old HL
            let hl3 = document.querySelector('.flex-container > .main-content > h1');
            hl3.remove();                    
            // Create and insert new Headline
            let hl4 = document.createElement('h1');
            let hl4text = document.createTextNode("How Secure is Your Workplace?");
            hl4.appendChild(hl4text);
            let main = document.querySelector('.flex-container > .main-content');
            main.insertAdjacentElement("afterbegin", hl4);                      

            // Change description //////////////////////////
            
            // Old description
            let description3 = document.querySelector('.flex-container > .main-content > p');                               
            // Replace description
            let description4 = document.createElement('p');
            let description4text = document.createTextNode("Workplace: Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. Fix, Schwyz! quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg.");
            description4.appendChild(description4text);
            description3.replaceWith(description4);                                    
        });

    // Button show Score page
    button_next_3.addEventListener("click", function () {
        scene.remove(factory);
        scene.add(score);
        controls.reset();
        controls.enablePan = false;
        button_next_3.style.display = "none";
        button_restart.style.display = "block";

        // Delete old HL
        let hl4 = document.querySelector('.flex-container > .main-content > h1');
        hl4.remove();                    
        // Create and insert new Headline
        let hl5 = document.createElement('h1');
        let hl5text = document.createTextNode("This is the End of the Training - and this is Your Score");
        hl5.appendChild(hl5text);
        let main = document.querySelector('.flex-container > .main-content');
        main.insertAdjacentElement("afterbegin", hl5);                      

        // Change description //////////////////////////
        
        // Old description
        let description4 = document.querySelector('.flex-container > .main-content > p');                               
        // Replace description
        let description5 = document.createElement('p');
        let description5text = document.createTextNode("The End of the Training: Thank you very much. We hope you had the same fun playing what we had creating this game. See you next time!");
        description5.appendChild(description5text);
        description4.replaceWith(description5);
        alert("You Correctly Answered " + window.numCorrect + " Questions.");                             
    });
        
        //Button restart
        button_restart.addEventListener("click", function () {
            scene.remove(score);
            scene.add(world);
            controls.reset();
            removeEventListener('mousemove', moveOnObjects);
            removeEventListener('click', clickOnObjects);
            button_restart.style.display = "none";
            button_start.style.display = "block";
            // Delete old HL
            let hl5 = document.querySelector('.flex-container > .main-content > h1');
            hl5.remove();
                    
            // Create and insert new HL
            let hlstart = document.createElement('h1');
            let hlstarttext = document.createTextNode("How Secure is Your Global Work Environment");
            hlstart.appendChild(hlstarttext);
            let main = document.querySelector('.flex-container > .main-content');
            main.insertAdjacentElement("afterbegin", hlstart);
            controls.enablePan = false;
            controls.enabled = false;            

            // Change description //////////////////////////
            
            // Old description
            let description4 = document.querySelector('.flex-container > .main-content > p');
                               
            // Replace description
            let descriptionstart = document.createElement('p');
            let descriptionstarttext = document.createTextNode("Global Work Environment: Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? ");
            descriptionstart.appendChild(descriptionstarttext);            
            description4.replaceWith(descriptionstart);                         
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

            case 'printer_cube':
                clickQuizObject(quizPrinter, quizContainerPrinter, feedbackContainerPrinter, submitButtonPrinter, "printer", "closePrinter");                               
            break;

            case 'roomba_cube':
                clickQuizObject(quizRoomba, quizContainerRoomba, feedbackContainerRoomba, submitButtonRoomba, "roomba", "closeRoomba");                               
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
                roomba.visible = true;
                break;

            default:
                bin.visible = false;
                printer.visible = false;
                door.visible = false;
                note.visible = false;
                cctv.visible = false;
                roomba.visible = false;
                break;
        };
    };

window.addEventListener('mousemove', moveOnObjects);


// Generate Quizzes ////////////////////////////////////////////////////////////////////

window.numCorrect = 0;

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
                        + '<input type="radio" name="question'+i +'" value="'+letter +'">'
                        + ' '
                        + questions[i].answers[letter]
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
            userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;            
            
            // Case correct answer
            if(userAnswer===questions[i].correctAnswer){
                window.numCorrect += 1;
                feedbackContainer.style.color = 'mediumseagreen';
                //get feedback CORRECT from additiopnal property in questions[]
                feedback = '<br>' + questions[0].feedbackRight + '<br>' + '<br>';
                submitButton.disabled = true;
                }
            
            // Case wrong answer
            else{
                
                feedbackContainer.style.color = 'firebrick';
                //get feedback WRONG from additiopnal property in myQuestions[]
                feedback = '<br>' + questions[0].feedbackWrong + '<br>' + '<br>';
                submitButton.disabled = true;
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
		question: "This is a bin. But if it were, what dangers would it pose? Choose the correct answer.",
		answers: {
			a: 'It could store too much data.',
			b: 'It could spread malware when thoughtlessly used.',
			c: 'It is just a USB drive, no misuse possible.',
            d: 'It depends on the operating system, you are using.',
        },
		correctAnswer: 'b', 
        feedbackRight: 'Yes, that was right! USB drives can be quite dangerous.',
        feedbackWrong: 'Sorry, this is not the right answer. A USB drive is anything but harmless.'
	},
];

//Quiz content printer ////////////////////////////////////

var quizContainerPrinter = document.getElementById('quizPrinter');
var feedbackContainerPrinter = document.getElementById('feedbackPrinter');
var submitButtonPrinter = document.getElementById('submitPrinter');

var quizPrinter = [
	{
		question: "This is a printer. What should you consider, when using it?",
		answers: {
			a: 'Nothing',
			b: 'Do not forget to take out all printouts.',
        },
		correctAnswer: 'b',
        feedbackRight: 'Yes, that was right! Never leave printouts lying in the printer.',
        feedbackWrong: 'No, that is not the right mindset! Consider printouts lying in the printer for too long, for example.'
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
			a: 'Why not? The note is well hidden.',
			b: 'No, that is not a good idea at all!',
        },
		correctAnswer: 'b',
        feedbackRight: 'You are right. Writing down passswords on notes is never a good idea.',
        feedbackWrong: 'Are you sure? What if not you, but someone else finds it?'
	},
];

// Quiz content roomba //////////

var quizContainerRoomba = document.getElementById('quizRoomba');
var feedbackContainerRoomba = document.getElementById('feedbackRoomba');
var submitButtonRoomba = document.getElementById('submitRoomba');

var quizRoomba = [
	{
		question: "This is a robot vacuum cleaner. It relies on a Wifi connection to work properly. Which problems could occur?",
		answers: {
			a: 'It could suck away lego bricks.',
			b: 'When connected to your Wifi it could be misused by hackers.',
			c: 'When left alone it could stop working.',
            d: 'This is a save device, it should be fine.',
        },
		correctAnswer: 'b', 
        feedbackRight: 'Yes, that was right! All devices connected to your Wifi are potential backdors for hackers.',
        feedbackWrong: 'Sorry, this is not the right answer. Any device connected to a Wifi could be misused from outside.'
	},
];

// Generate Quizzes End /////////////////////////////////////////////////////////////////


// Render scene and camera
const render = () => {
    renderer.render(scene, camera);
};

// animation recursive function
function animate () {
    requestAnimationFrame(animate);
    world.rotation.y += 0.005;
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
animate();