import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Schedules from './pages/Schedules';
import Calendar from './pages/Calendar';
import Projects from './pages/Project';
import TodoLinks from './pages/TodoLinks';
import ProjectLinks from './pages/ProjectLinks';
import CSVUploads from './pages/CSVUpload';

const App = () => {
  return (
    <Router>
<div className="d-flex" style={{ height: '100vh' }}>
  <Sidebar />
  <div className="content flex-grow-1" style={{ overflow: 'auto' }}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/todo-links" element={<TodoLinks />} />
          <Route path="/project-links" element={<ProjectLinks />} />
          <Route path="/csv-uploads" element={<CSVUploads />} />
      <Route path="/schedules" element={<Schedules />} />
      <Route path="/calendar" element={<Calendar />} />
    </Routes>
  </div>
</div>

    </Router>
  );
};

export default App;
