# S3D (aka **Cyber Forensics 3D**) 


## Setup Git

git init

git config --global user.name "FIRST_NAME LAST_NAME"

git config --global user.email "MY_NAME@example.com"

git remote add origin https://github.com/Ectasium/S3D.git

git add -A

git commit -m "commit message"

git push origin main 


## Install npm Packages

npm init

npm --save-dev install parcel

npm install three

npm --save dat.gui


## Add a ClickObject in a scene

Create Object (function add_clickObject () (130ff)) + call function (260ff))

add Object in clickOnObjects (467ff) as Info or Quiz

add to scene

remove from next scene

add to moveOnObjects (540ff) and set invisible per default

if quiz, add questions object (665ff)

create modal in indexed.html (either quiz or info)
