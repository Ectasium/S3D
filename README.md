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

if quiz, add questions object (665ff)

create modal in indexed.html (either quiz or info)


