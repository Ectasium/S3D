# Cyber Forensics 3D (formerly known as S3D) 

# Fonts

https://fonts.google.com/

## Setup Git

git init

git config --global init.defaultBranch main

git config --global user.name "FIRST_NAME LAST_NAME"

git config --global user.email "MY_NAME@example.com"

git remote add origin https://github.com/Ectasium/S3D.git

git pull origin main 

git add -A

git commit -m "commit message"

git push origin main 


## Install npm Packages

npm init -y

npm --save-dev install parcel

npm install three

npm --save-dev install dat.gui

npm install @tweenjs/tween.js


## Add a ClickObject in a scene

Create Object (function add_clickObject () (130ff)) + call function (260ff))

add Object in clickOnObjects (467ff) as Info or Quiz

add to scene

remove from next scene

add to moveOnObjects (540ff) and set invisible per default

create modal in index.html (either quiz or info)

if quiz, add questions object (665ff)

## NOTES

### cube-Objects: Lifecycle (Example: alexa_cube)

### 616: created as alexa:

function add_alexa() {
        const alexa_cube_geometry = new THREE.BoxGeometry(0.21, 0.37, 0.25);
        const alexa_cube_material = new THREE.MeshLambertMaterial(
            {
                color: 0xff0000,
                opacity: 0.9,
                transparent: true
            });
        const alexa_cube = new THREE.Mesh(alexa_cube_geometry, alexa_cube_material);
        alexa_cube.position.set(-4.27, -0.16, -0.03);
        alexa_cube.userData.name = 'alexa_cube';
        alexa_cube.userData.class = 'mouseover_object';
        alexa_cube.visible = false;
        alexa_cube.material.opacity = 0.2;
        return alexa_cube;
    };
    alexa = add_alexa();

### 951: added to scene:

scene.add(livingroom, cctv, roomba, roombaCube, alexa, smartcontrol, tv, xbox, controller);

### 995: removed from scene:

scene.remove(livingroom, cctv, roomba, roombaCube, alexa, smartcontrol, tv, xbox, controller, roombastartCube);

### 1266: case in Click-Object

 case 'alexa_cube':
            clickQuizObject(quizAlexa, quizContainerAlexa, feedbackContainerAlexa, submitButtonAlexa, "alexa", "closeAlexa");
            break;

### 1447: case in Mouseover-Object

case 'alexa_cube':
            alexa.visible = true;
            break;

### 1535: default in Mouseover-Object

default: alexa.visible = false;


