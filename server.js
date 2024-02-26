const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());


// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
fs.existsSync(uploadsDir) || fs.mkdirSync(uploadsDir);

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now() + fileExt);
    }
});
const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
    const userName = req.body.userName; //get the suername fromt the request loby
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    //res.send('File uploaded successfully.');
    res.json({ fileName: req.file.filename });//used to send the dilename to the front wnd, the server side file name not the origninal file name that is used as the key to doenload the file


    // After the file is saved
    const uploadsData = require('./uploads.json');
    uploadsData.uploads.push({
        userName: userName,
        fileName: req.file.filename,
        uploadTime: new Date().toISOString()
    });
    fs.writeFileSync('./uploads.json', JSON.stringify(uploadsData, null, 2));


});





app.delete('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);



    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('error deleting the file : $(filename)', err);
            return res.status(500).send('error deleting file..');
        }
        //upate uploads.json
        const uploadsData = require('./uploads.json');
        uploadsData.uploads = uploadsData.uploads.filter((file) => file.fileName != filename);
        fs.writeFileSync('/uploads.json', JSON.stringify(uploadsData, null, 2));


        res.send('File deleted successfullyyy.');
    }
    );
}


);








app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    res.download(filePath, filename, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error(`File not found: ${filename}`);
                return res.status(404).send('File not found.');
            }
            console.error(`Error downloading file: ${filename}`, err);
            return res.status(500).send('Error downloading file.');
        }
    });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'path-to-admin.html'));
});




app.get('/uploads', (req, res) => {
    const uploadsData = require('./uploads.json');
    res.json(uploadsData);
});

const port = 6000;
// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});