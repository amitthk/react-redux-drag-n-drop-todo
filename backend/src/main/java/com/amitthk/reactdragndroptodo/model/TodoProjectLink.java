package com.amitthk.reactdragndroptodo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@IdClass(TodoProjectId.class)
public class TodoProjectLink {
    @Id
    @Column(name = "todo_id")
    private Long todoId;

    @Id
    @Column(name = "project_id")
    private Long projectId;

    private int displayOrder;
    private int priority;
    private String comments;

    public TodoProjectLink(Long todoId, Long projectId) {
        this.todoId = todoId;
        this.projectId = projectId;
    }
}
