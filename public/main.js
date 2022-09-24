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
        canvas: model_container
    });
    renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 1.5);
    const spotLight1 = new THREE.SpotLight(0xffffff, 0.3);
    const spotLight2 = new THREE.SpotLight(0xffffff, 0.3);
    spotLight1.position.set(20, 30, 0);
    spotLight1.castShadow = true;
    spotLight2.position.set(0, 10, 10);
    spotLight2.castShadow = true;
    scene.add(ambientLight, hemisphereLight, spotLight1, spotLight2);

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
    function add_door() {
        const door_cube_geometry = new THREE.BoxGeometry(2.2, 5, 0.03);
        const door_cube_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.6,
            transparent: true});
        const door_cube = new THREE.Mesh(door_cube_geometry, door_cube_material);
        door_cube.position.set(-3.11, 0.5, -4.8);
        door_cube.userData.name = 'door_cube';
        door_cube.userData.class = 'mouseover_object';
        door_cube.visible = false;
        return door_cube;
    };
    
    // add printer cube
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
    
    // add ball sphere ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function add_ball() {
        const ball_sphere_geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const ball_sphere_material = new THREE.MeshLambertMaterial( 
            {color: 0xff0000, 
            opacity: 0.9,
            transparent: true});
        const ball_sphere = new THREE.Mesh(ball_sphere_geometry, ball_sphere_material);
        ball_sphere.position.set(4.3, -1.47, -4.19);
        ball_sphere.userData.name = 'ball_sphere';
        ball_sphere.userData.class = 'mouseover_object';
        scene.add(ball_sphere);
        ball_sphere.visible = false;
        ball_sphere.material.opacity = 0.2;
        return ball_sphere;
    };
          
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

    ball = add_ball();
    printer = add_printer();
    door = add_door();
    world = add_world();
    
    // BUTTONS /////////////////////////////////////////////////////////////

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

        button_start.addEventListener("click", function() {
            scene.remove(world);
            scene.add(factory);
            controls.enabled = true;
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
            let hl2text = document.createTextNode("How Secure is Your Workplace?");
            hl2.appendChild(hl2text);
            let main = document.querySelector('.flex-container > .main-content');
            main.insertAdjacentElement("afterbegin", hl2);

            // Change description //////////////////////////
            
            // Delete old description
            let description_start = document.querySelector('.flex-container > .main-content > p');
            //description_start.remove();
                   
            // Create and insert new description
            let description2 = document.createElement('p');
            let description2text = document.createTextNode("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.");
            description2.appendChild(description2text);
            
            let maincontent = document.getElementsByClassName("main-content");
            console.log(maincontent);
            description_start.replaceWith(description2);
            
        });

        //Button show office
        button_next_1.addEventListener("click", function () {
            scene.remove(factory);
            scene.add(office, ball, printer, door);
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
            let description3text = document.createTextNode("Jemand musste Josef K. verleumdet haben, denn ohne dass er etwas Böses getan hätte, wurde er eines Morgens verhaftet. »Wie ein Hund!« sagte er, es war, als sollte die Scham ihn überleben. Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt. Und es war ihnen wie eine Bestätigung ihrer neuen Träume und guten Absichten, als am Ziele ihrer Fahrt die Tochter als erste sich erhob und ihren jungen Körper dehnte.");
            description3.appendChild(description3text);
            description2.replaceWith(description3);
            
        });

        //Button show House
        button_next_2.addEventListener("click", function () {
            scene.remove(office, ball, printer, door);
            scene.add(house);
            controls.reset();
            controls.enablePan = false;
            button_restart.style.display = "block";
            button_next_2.style.display = "none";

            // Delete old HL
            let hl3 = document.querySelector('.flex-container > .main-content > h1');
            hl3.remove();
                    
            // Create and insert new Headline
            let hl4 = document.createElement('h1');
            let hl4text = document.createTextNode("How Secure is Your Desktop Computer?");
            hl4.appendChild(hl4text);
            let main = document.querySelector('.flex-container > .main-content');
            main.insertAdjacentElement("afterbegin", hl4);                      

            // Change description //////////////////////////
            
            // Old description
            let description3 = document.querySelector('.flex-container > .main-content > p');
                               
            // Replace description
            let description4 = document.createElement('p');
            let description4text = document.createTextNode("Zwei flinke Boxer jagen die quirlige Eva und ihren Mops durch Sylt. Franz jagt im komplett verwahrlosten Taxi quer durch Bayern. Zwölf Boxkämpfer jagen Viktor quer über den großen Sylter Deich. Vogel Quax zwickt Johnys Pferd Bim. Sylvia wagt quick den Jux bei Pforzheim. Polyfon zwitschernd aßen Mäxchens Vögel Rüben, Joghurt und Quark. Fix, Schwyz! quäkt Jürgen blöd vom Paß. Victor jagt zwölf Boxkämpfer quer über den großen Sylter Deich. Falsches Üben von Xylophonmusik quält jeden größeren Zwerg.");
            description4.appendChild(description4text);
            description3.replaceWith(description4);
            
        });

        //Button restart
        button_restart.addEventListener("click", function () {
            scene.remove(house);
            scene.add(world);
            controls.reset();
            button_restart.style.display = "none";
            button_start.style.display = "block";
            // Delete old HL
            let hl5 = document.querySelector('.flex-container > .main-content > h1');
            hl5.remove();
                    
            // Create and insert new HL
            let hlstart = document.createElement('h1');
            let hlstarttext = document.createTextNode("How Secure is Your Global Work Environment?");
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
            let descriptionstarttext = document.createTextNode("Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen?");
            descriptionstart.appendChild(descriptionstarttext);
            
            description4.replaceWith(descriptionstart);
            
        });

    };

    buttons_init();
};

// RAYCASTER ////////////////////////////////////////////////////////////////////

// Raycaster onClick

const raycaster_click = new THREE.Raycaster();
const clickMouse = new THREE.Vector2();
window.addEventListener('click', event => {
    
    const rect = renderer.domElement.getBoundingClientRect();
    clickMouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    clickMouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    raycaster_click.setFromCamera(clickMouse, camera);

    const found = raycaster_click.intersectObjects(scene.children, true);
        
    switch (found.length > 0 && found[0].object.userData.name) {
        
            case 'printer_cube':
                var modal = document.getElementById("printer");                
                var span_basketball = document.getElementById("close_printer");
                modal.style.display = "block";                
                span_basketball.onclick = function() {
                modal.style.display = "none";
                //click & hover should be disabeld here
                };
            break; 
        
            case 'ball_sphere':
                var modal = document.getElementById("basketball");                
                var span_basketball = document.getElementById("close_basketball");
                modal.style.display = "block";                
                span_basketball.onclick = function() {
                modal.style.display = "none";
                };        
            break;
        
            case 'door_cube':
                var modal = document.getElementById("door");
                var span_door = document.getElementById("close_door");
                modal.style.display = "block";
                span_door.onclick = function() {
                modal.style.display = "none";
            };        
            break;
    };
});

// Raycaster onMouseOver

const raycaster_move = new THREE.Raycaster();
const moveMouse = new THREE.Vector2();

function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	const rect = renderer.domElement.getBoundingClientRect();
    moveMouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
    moveMouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

    // update the picking ray with the camera and pointer position
	raycaster_move.setFromCamera(moveMouse, camera);

	// calculate objects intersecting the picking ray
	const found = raycaster_move.intersectObjects(scene.children);
        
    
    switch (found.length > 0 && found[0].object.userData.name) {
        case 'printer_cube':
            console.log("INFO: Printer");
            printer.visible = true;
            break;   

        case 'ball_sphere':
            console.log("INFO: Basketball");
            ball.visible = true;
            break;

        case 'door_cube':
            console.log("INFO: Door");
            door.visible = true;
            break;

        default:            
            console.log("Default!");
            ball.visible = false;
            printer.visible = false;
            door.visible = false;
            break;
            
    };

};

// Generate Quizzes ////////////////////////////////////////////////////////////////////

function generateQuiz(questions, quizContainer, resultsContainer, submitButton){

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
                        + '<input type="radio" name="question'+i +'" value="'+letter +'">'
                        + letter + ': '
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

	function showResults(questions, quizContainer, resultsContainer){
	
        // gather answer containers from our quiz
        var answerContainers = quizContainer.querySelectorAll('.answers');
        
        // keep track of user's answers
        var userAnswer = '';
        var numCorrect = 0;
        
        // for each question...
        for(var i=0; i<questions.length; i++){
    
            // find selected answer
            userAnswer = (answerContainers[i].querySelector('input[name=question'+i+']:checked')||{}).value;
            
            // if answer is correct
            if(userAnswer===questions[i].correctAnswer){
                // add to the number of correct answers
                numCorrect++;
                console.log(numCorrect++);
                
                // color the answers green
                answerContainers[i].style.color = 'lightgreen';
            }
            // if answer is wrong or blank
            else{
                // color the answers red
                answerContainers[i].style.color = 'red';
            };
        };
    
        // show number of correct answers out of total
        resultsContainer.innerHTML = numCorrect + ' out of ' + questions.length;
    };

	// show the questions
	showQuestions(questions, quizContainer);

	// when user clicks submit, show results
	submitButton.onclick = function(){
		showResults(questions, quizContainer, resultsContainer);
	};
};

var quizContainer = document.getElementById('quiz');
var resultsContainer = document.getElementById('results');
var submitButton = document.getElementById('submit');

var myQuestions = [
	{
		question: "How can an USB drive be misused?",
		answers: {
			a: 'Storing data',
			b: 'Spreading malware',
			c: 'No misuse possible'
		},
		correctAnswer: 'b'
	},
];

generateQuiz(myQuestions, quizContainer, resultsContainer, submitButton);

// Generate Quizzes End /////////////////////////////////////////////////////////////////


window.addEventListener('mousemove', onPointerMove );

// rendering scene and camera
const render = () => {
    renderer.render(scene, camera);
};

// animation recursive function
function animate () {
    requestAnimationFrame(animate);
    // resizing only works when world animation is turned off(?)
    //world.rotation.y += 0.005;
    render();
    
};

 // making canvas responsive
 function windowResize() {
    camera.aspect = canvasSize.offsetWidth / canvasSize.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
    //render();
};

//start scene
window.onload = init();
animate();
window.addEventListener('resize', windowResize, false);
