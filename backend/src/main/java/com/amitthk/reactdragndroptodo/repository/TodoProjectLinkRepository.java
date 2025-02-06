package com.amitthk.reactdragndroptodo.repository;

import com.amitthk.reactdragndroptodo.model.TodoProjectId;
import com.amitthk.reactdragndroptodo.model.TodoProjectLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TodoProjectLinkRepository extends JpaRepository<TodoProjectLink, TodoProjectId> {
    Optional<TodoProjectLink> findByTodoIdAndProjectId(Long todoId, Long projectId);
}
