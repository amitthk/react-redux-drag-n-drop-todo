import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  fetchLinkedTodos,
  unlinkProjectFromTodo,
  deleteProject,
  updateProject,
  createProject
} from "../reducers/projectSlice";
import ProjectInput from "../components/ProjectInput";

const ProjectLinks = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.projects);
  const linkedTodos = useSelector((state) => state.projects.linkedTodos);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleProjectClick = (project) => {
    setSelectedProject((prev) => (prev?.id === project.id ? null : project));
    if (project?.id) {
      dispatch(fetchLinkedTodos(project.id));
    }
  };

  const handleSaveProject = (project) => {
    if (editMode) {
      dispatch(updateProject({ id: project.id, updates: project }));
    } else {
      dispatch(createProject(project));
    }
    setEditMode(false);
    setShowProjectForm(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Projects & Linked Todos</h5>
        <button className="btn btn-sm btn-primary" onClick={() => setShowProjectForm(!showProjectForm)}>
          {showProjectForm ? "Hide Project Form" : "Add New Project"}
        </button>
      </div>

      {showProjectForm && <ProjectInput onSave={handleSaveProject} editMode={editMode} project={selectedProject} />}

      <ul className="list-group">
        {projects.map((project) => (
          <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center" style={{ cursor: "pointer" }} onClick={() => handleProjectClick(project)}>
              <i className={`bi ${selectedProject?.id === project.id ? "bi-chevron-down" : "bi-chevron-right"} me-2`}></i>
              <strong>{project.name}</strong>
            </div>

            {selectedProject?.id === project.id && (
              <ul className="list-group mt-2 w-100">
                {linkedTodos[project.id]?.length > 0 ? (
                  linkedTodos[project.id].map((todo) => (
                    <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {todo.text}
                      <i className="bi bi-trash text-danger" style={{ cursor: "pointer" }} onClick={() => dispatch(unlinkProjectFromTodo({ todoId: todo.id, projectId: project.id }))}></i>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">No linked todos</li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectLinks;
