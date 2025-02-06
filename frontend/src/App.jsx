import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Schedules from './pages/Schedules';
import Calendar from './pages/Calendar';
import Projects from './pages/Project';

const App = () => {
  return (
    <Router>
<div className="d-flex" style={{ height: '100vh' }}>
  <Sidebar />
  <div className="content flex-grow-1" style={{ overflow: 'auto' }}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/schedules" element={<Schedules />} />
      <Route path="/calendar" element={<Calendar />} />
    </Routes>
  </div>
</div>

    </Router>
  );
};

export default App;
