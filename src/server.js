const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');




const app = express();
const port = 5000;

const cors = require('cors');
app.use(cors());


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back the index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});


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
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully.');
});

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



// Start the server,, here write your own machine IP adress IPv4 address find that usning termainal and type ipconfig
app.listen(port, "10.245.111.51", () => {
    console.log(`Server listening on port${port}`);
});
