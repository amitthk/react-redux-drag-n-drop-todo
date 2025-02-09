import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../reducers/projectSlice';

const ProjectInput = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('development');
  const [status, setStatus] = useState('NEW');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [costEstimate, setCostEstimate] = useState(0.0);

  const dispatch = useDispatch();

  const handleAdd = () => {
    if (name.trim()) {
      dispatch(
        createProject({
          name,
          type,
          status,
          description,
          priority,
          displayOrder,
          costEstimate,
        })
      );
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPriority(1);
    setDisplayOrder(0);
    setCostEstimate(0.0);
    setShowForm(false);
  };

  return (
    <div className="mb-3">
      {!showForm ? (
        // Show the button initially
        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add New Project
          </button>
        </div>
      ) : (
        // Show the form when the button is clicked
        <div className="card p-3">
          <h5>Create New Project</h5>

          <div className="mb-2">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Project Type</label>
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="development">Development</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label">Status</label>
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-2">
            <label className="form-label">Priority</label>
            <input
              type="number"
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              className="form-control"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Cost Estimate</label>
            <input
              type="number"
              className="form-control"
              value={costEstimate}
              onChange={(e) => setCostEstimate(Number(e.target.value))}
            />
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAdd}>
              Add Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectInput;
