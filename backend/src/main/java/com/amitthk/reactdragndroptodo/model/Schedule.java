package com.amitthk.reactdragndroptodo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "schedule", uniqueConstraints = @UniqueConstraint(columnNames = "date"))
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String date;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderOfExecution ASC") // Automatically order by `orderOfExecution`
    @JsonManagedReference
    private List<ScheduledTodo> scheduledTodos = new ArrayList<>();

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<ScheduledTodo> getScheduledTodos() {
        return scheduledTodos;
    }

    public void setScheduledTodos(List<ScheduledTodo> scheduledTodos) {
        this.scheduledTodos = scheduledTodos;
    }
}
