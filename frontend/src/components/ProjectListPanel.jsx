import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { deleteProject } from "../reducers/projectSlice";

const ProjectListPanel = () => {
  const projects = useSelector((state) => state.projects.projects);
  const dispatch = useDispatch();

  return (
    <div>
      {projects.length > 0 ? (
        projects.map((project) => (
          <Droppable key={project.id} droppableId={`project-${project.id}`}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="list-group mb-3"
                style={{
                  minHeight: "100px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <strong>{project.name}</strong>
                <Draggable draggableId={`project-${project.id}`} index={project.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      style={{
                        padding: "10px",
                        userSelect: "none",
                        backgroundColor: "white",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <div>
                        <small className="text-muted d-block">
                          Type: {project.type} | Status: {project.status}
                        </small>
                        <small className="text-muted">
                          Priority: {project.priority} | Cost: ${project.costEstimate}
                        </small>
                      </div>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => dispatch(deleteProject(project.id))}
                      ></i>
                    </div>
                  )}
                </Draggable>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))
      ) : (
        <div className="text-center text-muted">No projects available</div>
      )}
    </div>
  );
};

export default ProjectListPanel;
