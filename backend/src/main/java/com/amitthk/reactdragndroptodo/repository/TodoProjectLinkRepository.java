package com.amitthk.reactdragndroptodo.repository;

import com.amitthk.reactdragndroptodo.model.*;
import jakarta.persistence.Tuple;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public interface TodoProjectLinkRepository extends JpaRepository<TodoProjectLink, TodoProjectId> {
    Optional<TodoProjectLink> findByTodoIdAndProjectId(Long todoId, Long projectId);

    void deleteByProjectId(Long projectId);

        // ✅ Fetch all linked projects with full details for a specific todo
        @Query("SELECT p FROM Project p " +
                "JOIN TodoProjectLink tpl ON p.id = tpl.projectId " +
                "WHERE tpl.todoId = :todoId")
        List<Project> findProjectsByTodoId(Long todoId);

        // ✅ Fetch all linked todos with full details for a specific project
        @Query("SELECT t FROM Todo t " +
                "JOIN TodoProjectLink tpl ON t.id = tpl.todoId " +
                "WHERE tpl.projectId = :projectId")
        List<Todo> findTodosByProjectId(Long projectId);

        // ✅ Fetch all links with full project and todo details
        @Query("SELECT t.id as todoId, t.name as todoName, " +
                "p.id as projectId, p.name as projectName " +
                "FROM TodoProjectLink tpl " +
                "JOIN Todo t ON tpl.todoId = t.id " +
                "JOIN Project p ON tpl.projectId = p.id")
        List<Tuple> findAllLinksWithDetails();

        // ✅ Helper method to convert Tuple to DTO (use in service layer)
        default List<TodoProjectLinkDTO> mapToDTO(List<Tuple> tuples) {
            return tuples.stream()
                    .map(tuple -> new TodoProjectLinkDTO(
                            tuple.get("todoId", Long.class),
                            tuple.get("todoName", String.class),
                            tuple.get("projectId", Long.class),
                            tuple.get("projectName", String.class)
                    ))
                    .collect(Collectors.toList());
        }
    }
