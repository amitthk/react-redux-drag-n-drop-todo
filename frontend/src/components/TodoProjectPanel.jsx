import React, { useEffect } from "react";
import {  Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  fetchProjects,
} from "../reducers/todoSlice";

const TodoProjectPanel = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const projects = useSelector((state) => state.projects.projects);

  useEffect(() => {
    dispatch(fetchTodos());
    dispatch(fetchProjects());
  }, [dispatch]);


  return (
      <div className="d-flex justify-content-between">
        {/* Todo Panel */}
        <Droppable droppableId="todo-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="panel border p-3">
              <h5>Todos</h5>
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="draggable-item p-2 border rounded mb-2"
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      {todo.text} - {todo.type}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Project Panel */}
        <Droppable droppableId="project-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="panel border p-3">
              <h5>Projects</h5>
              {projects.map((project, index) => (
                <Draggable key={project.id} draggableId={project.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="draggable-item p-2 border rounded mb-2"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {project.projectName} - {project.projectType}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
  );
};

export default TodoProjectPanel;
