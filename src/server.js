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
const port = 6000;
// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
