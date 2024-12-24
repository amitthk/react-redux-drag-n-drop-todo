package com.amitthk.reactdragndroptodo.model;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String date;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "schedule_todos",
            joinColumns = @JoinColumn(name = "schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "todos_id")
    )
    private Set<Todo> todos = new HashSet<>();


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

    public Set<Todo> getTodos() {
        return todos;
    }

    public void setTodos(Set<Todo> todos) {
        this.todos = todos;
    }
}
