import React, { useState } from 'react';
import './App.css';

function App() {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');
    const [downloadStatus, setDownloadStatus] = useState('');
    const [serverFileName, setServerFileName] = useState('');
    //const [isAdminMode, setIsAdminMode] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);
    const [userName, setUserName] = useState('');

    const [uploadsList, setUploadsList] = useState([]);

    const adminKey = 'salah';

    const enterAdminMode = () => {
        const key = prompt('Please enter the admin key:');
        if (key === adminKey) {
            setShowAdmin(true); // This will be used to conditionally render the admin UI
            // Clear other state variables if necessary

            fetchUploads();  //calling feth function when wnetring admin mode
        } else {
            alert('Incorrect key!');
        }
    };



    const fetchUploads = async () =>
    {
        try {
            const response = await fetch('/uploads');
            if (!response.ok) {
                throw new Error('FIle Uploads.json fetch fail, please check the file present in the src folder');

            }
            const data = await response.json();
            setUploadsList(data.uploads);
        }
        catch (error) {
            console.error('error fetching uploas:',error)
        }
    }




    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFilenameChange = (event) => {
        setFilename(event.target.value);
    };

    const copyToClipboard = (text) => {
        // Newer clipboard API method
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback method
            let textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed"; // avoid scrolling to bottom
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                alert('Text copied to clipboard');
            } catch (err) {
                console.error('Unable to copy to clipboard', err);
            }

            document.body.removeChild(textArea);
        }
    };







    const deleteUpload = async (fileName) => {
        try {
            const response = await fetch(`/uploads/${fileName}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete');
            }

            //Filter out the deleted file from the uploadsList state
            setUploadsList(uploadsList.filter((file) => file.fileName !== fileName));
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };






    const handleUpload = async () => {
        if (!file) {
            alert('You must enter your name and select file :)');//exception when you click upload button without performing the necessory steps
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userName', userName);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                setUploadStatus('File uploaded successfully. Below is your key to download');
                setServerFileName(result.fileName); // Set the new filename here
            } else {
                setUploadStatus('Upload failed.');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('Upload failed.');
        }
    };

    const handleDownload = async () => {
        if (!filename) {
            alert('Please enter key to download.');
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
            {!showAdmin && (
                <>
                    <div>
                        <h2>File Upload</h2>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="enter your name please"
                            required
                        />

                        <input type="file" onChange={handleFileChange} />


                        <button onClick={handleUpload}>Upload</button>
                        {uploadStatus && <p>{uploadStatus}</p>}
                        {serverFileName && (
                            <div>
                                <input value={serverFileName} readOnly />
                                <button onClick={() => copyToClipboard(serverFileName)}>
                                    Copy Key to Share
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2>File Download</h2>
                        <input
                            type="text"
                            value={filename}
                            onChange={handleFilenameChange}
                            placeholder="Enter Key to download"
                        />
                        <button onClick={handleDownload}>Download</button>
                        {downloadStatus && <p>{downloadStatus}</p>}
                    </div>
                    <button onClick={enterAdminMode} className="admin-button">Admin</button>
                </>
            )}






            {showAdmin && (
                <div>
                    <h2>Hey admin, control the system</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>File Name</th>
                                <th>Upload Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploadsList.map((upload, index) => (
                                <tr key={index}>
                                    <td>{upload.userName || 'Anonymous'}</td>
                                    <td>{upload.fileName}</td>
                                    <td>{new Date(upload.uploadTime).toLocaleString()}</td>
                                    <td>
                                        {/* Add button for delete action */}
                                        <button onClick={() => deleteUpload(upload.fileName)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}



        </div>
    );

}

export default App; 