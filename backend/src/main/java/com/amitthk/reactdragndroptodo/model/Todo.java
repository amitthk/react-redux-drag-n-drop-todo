package com.amitthk.reactdragndroptodo.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private String type; // e.g., personal, work, etc.
    private Integer priorityOrder; // Order of priority

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getPriorityOrder() {
        return priorityOrder;
    }

    public void setPriorityOrder(Integer priorityOrder) {
        this.priorityOrder = priorityOrder;
    }
}
