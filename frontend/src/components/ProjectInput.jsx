import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProject } from '../reducers/projectSlice';

const ProjectInput = () => {
  const [input, setInput] = useState('');
  const [type, setType] = useState('development');
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (input.trim()) {
      dispatch(createProject({ projectName: input, projectType: type }));
      setInput('');
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter project name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="development">Development</option>
        <option value="marketing">Marketing</option>
        <option value="finance">Finance</option>
      </select>
      <button className="btn btn-primary" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
};

export default ProjectInput;
