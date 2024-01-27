import React, { useState, useRef } from 'react';
import './App.css';

function App() {
    const [mediaKey, setMediaKey] = useState('');
    const [uploaded, setUploaded] = useState(false);
    const fileInputRef = useRef();

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        console.log('Uploading file:', file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const text = await response.text();
                console.log("Response from server:", text); // Log the server response
                alert('File uploaded successfully: ' + text);
            } else {
                console.error('Upload failed');
                alert('Upload failed');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleDownloadClick = () => {
        console.log('Downloading media with key:', mediaKey);
        // Your download logic here
    };

    const handleCopyKey = () => {
        navigator.clipboard.writeText(mediaKey).then(() => {
            alert('Media key copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Photo Sharing</h1>

                <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <button onClick={handleUploadClick}>Upload</button>

                {uploaded && (
                    <div className="media-key-display">
                        <input type="text" value={mediaKey} readOnly />
                        <button onClick={handleCopyKey}>Copy</button>
                    </div>
                )}

                <div style={{ margin: '20px' }} />

                <input
                    type="text"
                    value={mediaKey}
                    onChange={(e) => setMediaKey(e.target.value)}
                    placeholder="Enter media key"
                />
                <button onClick={handleDownloadClick}>Download</button>
            </header>
        </div>
    );
}

export default App;
