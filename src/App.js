import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [downloadStatus, setDownloadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    //const [filesList, setFilesList] = useState([]);
    const [fileKey, setFileKey] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFilenameChange = (event) => {
        setFilename(event.target.value);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('File uploaded successfully.');
            } else {
                setUploadStatus('Upload failed.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('Upload failed.');
        }
        setIsUploading(false);
    };




    const handleDownload = async () => {
        if (!filename) {
            alert('Please enter a filename to download.');
            return;
        }

        window.fetch(`/download/${filename}`)
            .then((response) => {
                if (response.ok) {
                    response.blob().then((blob) => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        setDownloadStatus('Download started.');
                    });
                } else {
                    setDownloadStatus('File not found.');
                }
            })
            .catch((error) => {
                console.error('Download error:', error);
                setDownloadStatus('Download failed.');
            });
    };

    return (
        <div className="App">
            {/* File Upload Section */}
            <div>
                <h2>File Upload</h2>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
                <div className="status-message">
                    {isUploading ? 'Uploading...' : uploadStatus}
                </div>
            </div>

            {/* File Download Section */}
            <div>
                <h2>File Download</h2>
                <input
                    type="text"
                    value={filename}
                    onChange={handleFilenameChange}
                    placeholder="Enter filename to download"
                />
                <button onClick={handleDownload}>Download</button>
                <div className="status-message">
                    {downloadStatus}
                </div>
            </div>
        </div>
    );


}

export default App;
