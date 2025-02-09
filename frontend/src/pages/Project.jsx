import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import TodoInput from "../components/TodoInput";
import ProjectInput from "../components/ProjectInput";
import TodoListPanel from "../components/TodoListPanel";
import ProjectListPanel from "../components/ProjectListPanel";
import { linkTodoToProject, fetchTodos } from "../reducers/todoSlice";
import { fetchProjects, linkProjectToTodo } from "../reducers/projectSlice";

const Projects = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const projects = useSelector((state) => state.projects.projects);

  const [confirmLink, setConfirmLink] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    console.log("Drag Ended - Source:", source, "Destination:", destination, "DraggableId:", draggableId);

    // Validate and extract ID from `draggableId`
    const draggedItemMatch = draggableId.match(/(todo|project)-(\d+)/);
    if (!draggedItemMatch) return;
    const draggedItemId = parseInt(draggedItemMatch[2]);

    // Validate and extract ID from `droppableId`
    const destinationMatch = destination.droppableId.match(/(todo|project)-(\d+)/);
    if (!destinationMatch) return;
    const destinationId = parseInt(destinationMatch[2]);

    // Linking logic based on drag-and-drop
    if (source.droppableId.startsWith("todo-") && destination.droppableId.startsWith("project-")) {
      setConfirmLink({ todoId: draggedItemId, projectId: destinationId, type: "todo-to-project" });
    } else if (source.droppableId.startsWith("project-") && destination.droppableId.startsWith("todo-")) {
      setConfirmLink({ todoId: destinationId, projectId: draggedItemId, type: "project-to-todo" });
    }
  };

  const handleConfirmLink = () => {
    if (confirmLink) {
      if (confirmLink.type === "todo-to-project") {
        dispatch(linkTodoToProject({ todoId: confirmLink.todoId, projectId: confirmLink.projectId }));
      } else {
        dispatch(linkProjectToTodo({ projectId: confirmLink.projectId, todoId: confirmLink.todoId }));
      }
      setConfirmLink(null);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="row mb-4">
          {/* Todos Panel */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Todos</div>
              <div className="card-body">
                <TodoInput />
                <TodoListPanel />
              </div>
            </div>
          </div>

          {/* Projects Panel */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Projects</div>
              <div className="card-body">
                <ProjectInput />
                <ProjectListPanel />
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Confirmation Modal */}
      {confirmLink && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Link</h5>
                <button type="button" className="btn-close" onClick={() => setConfirmLink(null)}></button>
              </div>
              <div className="modal-body">
                <p>
                  Do you want to link <strong>Todo #{confirmLink.todoId}</strong> to{" "}
                  <strong>Project #{confirmLink.projectId}</strong>?
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setConfirmLink(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleConfirmLink}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
