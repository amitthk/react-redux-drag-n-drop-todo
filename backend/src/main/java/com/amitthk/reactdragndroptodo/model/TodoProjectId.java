package com.amitthk.reactdragndroptodo.model;

import java.io.Serializable;
import java.util.Objects;

public class TodoProjectId implements Serializable {
    private Long todoId;
    private Long projectId;

    // Default constructor
    public TodoProjectId() {}

    // Constructor with parameters
    public TodoProjectId(Long todoId, Long projectId) {
        this.todoId = todoId;
        this.projectId = projectId;
    }

    // Getters and Setters
    public Long getTodoId() {
        return todoId;
    }

    public void setTodoId(Long todoId) {
        this.todoId = todoId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    // Override equals() to compare both ID fields
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TodoProjectId that = (TodoProjectId) o;
        return Objects.equals(todoId, that.todoId) &&
                Objects.equals(projectId, that.projectId);
    }

    // Override hashCode() to generate unique hash based on both IDs
    @Override
    public int hashCode() {
        return Objects.hash(todoId, projectId);
    }
}
