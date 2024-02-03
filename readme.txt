step1: download and install node JS
step2: check the version by node --version
step3: clone the project 
step4: cd in to main project directory
step4: npm start
this should start a chrome page
step5: install Express "npm install express"
step6: to run the server "node src/server.js"
in chrome open the server by typing the address "http://localhost:3000"
step7: install multer by command "npm install multer"
{
for testing the server 
1: Open Postman:
If you don't have Postman, you can download it from postman.com.
2: Create a New POST Request:
Set the request type to POST.
Enter the URL http://localhost:3000/upload.
3: Add File to the Request:
In Postman, go to the 'Body' tab.
Select 'form-data'.
In the 'Key' field, type file. Set the type to 'File'.
Click on 'Select Files' or the file upload area to choose a file from your computer.
4: Send the Request:
Click the 'Send' button.
If everything is set up correctly, you should receive a response indicating the file was uploaded successfully.
}

date: 3feb24
changed some ui for user and fixed download functionality by changing the port address from 3000 to 5000 and some minor changes in the server.js