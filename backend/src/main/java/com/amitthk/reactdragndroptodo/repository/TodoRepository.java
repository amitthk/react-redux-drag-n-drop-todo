package com.amitthk.reactdragndroptodo.repository;

import com.amitthk.reactdragndroptodo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}
