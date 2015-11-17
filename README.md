Project used for transform parts of structured json into name/value parts and table.

This tool can be used to simplify requirements creation for Oracle responsys.

Prerequisites:

Install nodejs, mongodb

Install
1) cd into project, run
npm install

2) Create folder, where your database should be stored. For example: c:/mongodbdatabase
cd into mongodb installiation path bin folder, like c:/Program Files/..., run mongodb with next command:
mongod.exe --dbpath c:\mongodbdatabase

3) cd into project, run
node server.js

4) Open in your browser
http://localhost:3000
