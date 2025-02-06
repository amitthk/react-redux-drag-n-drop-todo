import React from 'react';
import axios from 'axios';

const CSVUploadPanel = () => {
  const uploadCSV = async (endpoint, fileInputId) => {
    const file = document.getElementById(fileInputId).files[0];
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post(`/api/csv-upload/${endpoint}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Upload Successful");
    } catch (error) {
      alert(`Error uploading CSV: ${error.message}`);
    }
  };

  return (
    <div>
      <h4>CSV Upload</h4>
      <label>Upload Todos
        <input type="file" id="todoCsv" />
      </label>
      <button onClick={() => uploadCSV('todos', 'todoCsv')}>Upload Todos</button>

      <label>Upload Projects
        <input type="file" id="projectCsv" />
      </label>
      <button onClick={() => uploadCSV('projects', 'projectCsv')}>Upload Projects</button>

      <label>Upload Links
        <input type="file" id="linkCsv" />
      </label>
      <button onClick={() => uploadCSV('links', 'linkCsv')}>Upload Links</button>
    </div>
  );
};

export default CSVUploadPanel;
