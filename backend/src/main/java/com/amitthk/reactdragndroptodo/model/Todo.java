package com.amitthk.reactdragndroptodo.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private String type; // e.g., personal, work, etc.
    private Integer priorityOrder; // Order of priority

    private String name;
    private Double estimatedCost;
    private Long displayOrder;
    private Long priority;


//    @ManyToMany
//    @JoinTable(
//        name = "todo_project_link",
//        joinColumns = @JoinColumn(name = "todo_id"),
//        inverseJoinColumns = @JoinColumn(name = "project_id")
//    )
//    @JsonBackReference
//    private List<Project> linkedProjects;

}
