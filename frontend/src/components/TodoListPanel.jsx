import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { getTodoTypeColor, getPriorityColor } from '../services/util';

const TodoListPanel = () => {
  const todos = useSelector((state) => state.todos.todos);

  return (
    <Droppable droppableId="todo-list">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="list-group"
          style={{
            minHeight: '100px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="list-group-item"
                    style={{
                      ...provided.draggableProps.style,
                      margin: '0 0 8px 0',
                      borderLeft: `4px solid ${getTodoTypeColor(todo.type)}`,
                      padding: '10px',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{todo.text}</strong>
                      <span
                        style={{
                          backgroundColor: getPriorityColor(todo.priorityOrder),
                          borderRadius: '12px',
                          padding: '2px 8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      >
                        {todo.priorityOrder}
                      </span>
                    </div>
                    <small
                      className="text-muted"
                      style={{
                        color: getTodoTypeColor(todo.type),
                      }}
                    >
                      {todo.type || 'General'}
                    </small>
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
