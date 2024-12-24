import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTodo } from '../reducers/todoSlice';

const TodoInput = () => {
  const [input, setInput] = useState('');
  const [type, setType] = useState('personal');
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (input.trim()) {
      dispatch(createTodo({ text: input, type }));
      setInput('');
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter todo"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <select
        className="form-select"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="personal">Personal</option>
        <option value="office">Office</option>
        <option value="learning">Learning</option>
      </select>
      <button className="btn btn-primary" onClick={handleAdd}>
        Add
      </button>
    </div>
  );
};

export default TodoInput;
