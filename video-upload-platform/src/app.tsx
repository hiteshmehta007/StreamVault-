import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VideoUploadForm from './components/upload/VideoUploadForm';
import ProcessingStatus from './components/processing/ProcessingStatus';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoUploadForm />} />
        <Route path="/processing" element={<ProcessingStatus />} />
      </Routes>
    </Router>
  );
};

export default App;