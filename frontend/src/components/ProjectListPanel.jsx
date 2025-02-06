import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProject } from '../reducers/projectSlice';

const ProjectListPanel = () => {
  const projects = useSelector((state) => state.projects.projects);
  const dispatch = useDispatch();

  return (
    <div className="list-group" style={{ minHeight: '100px', border: '1px solid #ccc', borderRadius: '5px' }}>
      {projects.length > 0 ? (
        projects.map((project) => (
          <div
            key={project.id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{ padding: '10px' }}
          >
            <div>
              <strong>{project.projectName}</strong>
              <small className="text-muted"> {project.projectType} </small>
            </div>
            <i
              className="bi bi-trash text-danger"
              style={{ cursor: 'pointer' }}
              onClick={() => dispatch(deleteProject(project.id))}
            ></i>
          </div>
        ))
      ) : (
        <div className="text-center text-muted">No projects available</div>
      )}
    </div>
  );
};

export default ProjectListPanel;
