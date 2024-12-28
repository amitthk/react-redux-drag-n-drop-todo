package com.amitthk.reactdragndroptodo.repository;

import com.amitthk.reactdragndroptodo.model.ScheduledTodo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduledTodoRepository extends JpaRepository<ScheduledTodo, Long> {
}
