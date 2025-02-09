import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`d-flex flex-column sidebar ${collapsed ? 'collapsed' : ''}`}>
      <button
        className="btn btn-outline-primary my-2"
        onClick={() => setCollapsed(!collapsed)}
      >
        <i className={`bi ${collapsed ? 'bi-arrow-right' : 'bi-arrow-left'}`}></i>
      </button>
      <nav className="nav flex-column">
        <Link className="nav-link" to="/">
          <i className="bi bi-house"></i>
          {!collapsed && <span className="ms-2">Home</span>}
        </Link>
        <Link className="nav-link" to="/projects">
          <i className="bi bi-book"></i>
          {!collapsed && <span className="ms-2">My Projects</span>}
        </Link>
        <Link className="nav-link" to="/todo-links">
          <i className="bi bi-list"></i>
          {!collapsed && <span className="ms-2">Todo Links</span>}
        </Link>
        <Link className="nav-link" to="/project-links">
          <i className="bi bi-book"></i>
          {!collapsed && <span className="ms-2">Project Links</span>}
        </Link>
        <Link className="nav-link" to="/csv-uploads">
          <i className="bi bi-file"></i>
          {!collapsed && <span className="ms-2">CSV Uploads</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
