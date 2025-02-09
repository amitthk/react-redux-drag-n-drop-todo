package com.amitthk.reactdragndroptodo.model;

public class TodoProjectLinkDTO {
    private Long todoId;
    private String todoName;
    private Long projectId;
    private String projectName;

    public TodoProjectLinkDTO(Long todoId, String todoName, Long projectId, String projectName) {
        this.todoId = todoId;
        this.todoName = todoName;
        this.projectId = projectId;
        this.projectName = projectName;
    }

    // ✅ Getters and Setters
    public Long getTodoId() { return todoId; }
    public void setTodoId(Long todoId) { this.todoId = todoId; }

    public String getTodoName() { return todoName; }
    public void setTodoName(String todoName) { this.todoName = todoName; }

    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }
}
