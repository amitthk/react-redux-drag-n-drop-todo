import React, { useEffect } from "react";
import TodoInput from '../components/TodoInput';
import ProjectInput from '../components/ProjectInput';
import TodoListPanel from '../components/TodoListPanel';
import ProjectListPanel from '../components/ProjectListPanel';
import TodoProjectPanel from '../components/TodoProjectPanel';
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";

import {
    linkTodoToProject,
  } from "../reducers/todoSlice";
  import {
    fetchTodos,
    fetchProjects,
  } from "../reducers/todoSlice";
const Projects = () => {

    const dispatch = useDispatch();
    const todos = useSelector((state) => state.todos.todos);
    const projects = useSelector((state) => state.projects.projects);
  
    useEffect(() => {
      dispatch(fetchTodos());
      dispatch(fetchProjects());
    }, [dispatch]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;
    
        const { source, destination } = result;
    
        // Link Todo to Project when dragged
        if (source.droppableId === "todo-list" && destination.droppableId === "project-list") {
          const todoId = todos[source.index].id;
          const projectId = projects[destination.index].id;
          dispatch(linkTodoToProject({ todoId, projectId }));
        }
      };

  return (
    <div className="container mt-4">
            <DragDropContext onDragEnd={handleDragEnd}>
      <h2>Projects Management</h2>
      <div className="row">
        {/* Todos Section */}
        <div className="col-md-5">
          <h4>Todos</h4>
          <TodoInput />
          <TodoListPanel />
        </div>

        {/* Projects Section */}
        <div className="col-md-5">
          <h4>Projects</h4>
          <ProjectInput />
          <ProjectListPanel />
        </div>

        {/* Drag and Drop Section */}
        <div className="col-md-10 mt-4">
          <h4>Link Todos to Projects</h4>
          <TodoProjectPanel />
        </div>
      </div>
      </DragDropContext>
    </div>
  );
};

export default Projects;
