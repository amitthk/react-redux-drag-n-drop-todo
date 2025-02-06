package com.amitthk.reactdragndroptodo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String status;
    private String description;
    private Long priority;
    private Long displayOrder;
    private Double costEstimate;

//    @ManyToMany(mappedBy = "linkedProjects")
//    @JsonManagedReference
//    private List<Todo> linkedTodos;
}

