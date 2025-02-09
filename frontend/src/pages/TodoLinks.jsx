import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  deleteTodo,
  updateTodo,
  createTodo,
  unlinkTodoFromProject,
  linkTodoToProject,
} from "../reducers/todoSlice";
import { fetchProjects, fetchLinkedProjects } from "../reducers/projectSlice";
import NetworkGraph from "../components/NetworkGraph";

const TodoLinks = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos || []);
  const projects = useSelector((state) => state.projects.projects || []);
  const linkedProjects = useSelector((state) => state.projects.linkedProjects || {});

  const [selectedTodo, setSelectedTodo] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [newTodoText, setNewTodoText] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState({});

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleTodoClick = (todo) => {
    setSelectedTodo(todo);
    if (todo?.id) {
      dispatch(fetchLinkedProjects(todo.id)); // ✅ Fetch projects only for the selected todo
    }
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo);
    setNewTodoText(todo.text);
  };

  const handleSaveEdit = (id) => {
    dispatch(updateTodo({ id, updates: { text: newTodoText } }));
    setEditingTodo(null);
  };

  const handleCreateTodo = () => {
    if (newTodoText.trim()) {
      dispatch(createTodo({ text: newTodoText, type: "general" }));
      setNewTodoText("");
      setShowAddForm(false);
    }
  };

  const toggleProjectSelection = (projectId) => {
    setSelectedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handleConfirmLinking = () => {
    Object.keys(selectedProjects).forEach((projectId) => {
      if (selectedProjects[projectId]) {
        dispatch(linkTodoToProject({ todoId: selectedTodo.id, projectId }));
      }
    });

    setShowProjectModal(false);
    setSelectedProjects({});
  };

  return (
    <div className="container mt-4">
      {/* Add Todo Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Todos & Linked Projects</h3>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Todo"}
        </button>
      </div>

      {/* Add Todo Form */}
      {showAddForm && (
        <div className="card p-3 mb-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter new todo"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleCreateTodo}>
            Add Todo
          </button>
        </div>
      )}

      {/* Todo List */}
      <div className="list-group">
        {todos.map((todo) => (
          <div key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
            {editingTodo?.id === todo.id ? (
              <input
                type="text"
                className="form-control"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onBlur={() => handleSaveEdit(todo.id)}
                autoFocus
              />
            ) : (
              <span onClick={() => handleTodoClick(todo)} style={{ cursor: "pointer" }}>
                {todo.text}
              </span>
            )}
            <div>
              <i className="bi bi-pencil-square text-primary me-2" style={{ cursor: "pointer" }} onClick={() => handleEditTodo(todo)}></i>
              <i className="bi bi-trash text-danger" style={{ cursor: "pointer" }} onClick={() => handleDeleteTodo(todo.id)}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Linked Projects for Selected Todo */}
      {selectedTodo && (
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between">
            <h5>Projects Linked to: {selectedTodo.text}</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowProjectModal(true)}>
              Link Projects
            </button>
          </div>
          <div className="card-body">
            {linkedProjects[selectedTodo.id]?.length > 0 ? (
              linkedProjects[selectedTodo.id].map((project) => (
                <div key={project.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {project.name}
                  <i
                    className="bi bi-trash text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => dispatch(unlinkTodoFromProject({ todoId: selectedTodo.id, projectId: project.id }))}
                  ></i>
                </div>
              ))
            ) : (
              <div className="text-muted">No linked projects</div>
            )}
          </div>
        </div>
      )}

      {/* Network Visualization */}
      <div className="card mt-4">
        <div className="card-header">
          <h5>Todo-Project Network</h5>
        </div>
        <div className="card-body">
          <NetworkGraph
            todos={todos}
            projects={Object.values(linkedProjects).flat()} // Flatten project lists
            links={Object.entries(linkedProjects).flatMap(([todoId, projects]) =>
              projects.map((project) => ({ todoId: parseInt(todoId), projectId: project.id }))
            )}
          />
        </div>
      </div>

      {/* Project Selection Modal */}
      {showProjectModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Projects</h5>
                <button type="button" className="btn-close" onClick={() => setShowProjectModal(false)}></button>
              </div>
              <div className="modal-body">
                {projects.map((project) => (
                  <div key={project.id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`project-${project.id}`}
                      checked={selectedProjects[project.id] || false}
                      onChange={() => toggleProjectSelection(project.id)}
                    />
                    <label className="form-check-label" htmlFor={`project-${project.id}`}>
                      {project.name}
                    </label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowProjectModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleConfirmLinking}>
                  Link Selected Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoLinks;
