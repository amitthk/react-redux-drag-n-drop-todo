import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { getTodoTypeColor, getPriorityColor } from '../services/util';
import { deleteTodo } from '../reducers/todoSlice';

const TodoListPanel = () => {
  const todos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();

  return (
    <Droppable droppableId="todo-list">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="list-group"
          style={{ minHeight: '100px', border: '1px solid #ccc', borderRadius: '5px' }}
        >
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{
                      ...provided.draggableProps.style,
                      margin: '0 0 8px 0',
                      borderLeft: `4px solid ${getTodoTypeColor(todo.type)}`,
                      padding: '10px',
                    }}
                  >
                    <div>
                      <strong>{todo.text}</strong>
                      <small className="text-muted" style={{ color: getTodoTypeColor(todo.type) }}>
                        {todo.type || 'General'}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      <span
                        style={{
                          backgroundColor: getPriorityColor(todo.priorityOrder),
                          borderRadius: '12px',
                          padding: '2px 8px',
                          color: '#fff',
                          fontSize: '12px',
                          marginRight: '8px',
                        }}
                      >
                        {todo.priorityOrder}
                      </span>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => dispatch(deleteTodo(todo.id))}
                      ></i>
                    </div>
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <div className="text-center text-muted">No todos available</div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TodoListPanel;
