package com.amitthk.reactdragndroptodo.repository;

import com.amitthk.reactdragndroptodo.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
