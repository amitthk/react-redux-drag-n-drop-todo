package com.amitthk.reactdragndroptodo.controller;

import com.amitthk.reactdragndroptodo.model.Project;
import com.amitthk.reactdragndroptodo.model.Todo;
import com.amitthk.reactdragndroptodo.model.TodoProjectLink;
import com.amitthk.reactdragndroptodo.model.TodoProjectLinkDTO;
import com.amitthk.reactdragndroptodo.repository.ProjectRepository;
import com.amitthk.reactdragndroptodo.repository.TodoProjectLinkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TodoProjectLinkRepository todoProjectLinkRepository;

    /** Fetch all projects */
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    /** Fetch a project by ID */
    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** Create a new project */
    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        project.setStatus("NEW"); // Default status
        Project savedProject = projectRepository.save(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
    }

    /** Update an existing project */
    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        return projectRepository.findById(id)
                .map(existingProject -> {
                    existingProject.setName(updatedProject.getName());
                    existingProject.setType(updatedProject.getType());
                    existingProject.setStatus(updatedProject.getStatus());
                    existingProject.setDescription(updatedProject.getDescription());
                    existingProject.setPriority(updatedProject.getPriority());
                    existingProject.setDisplayOrder(updatedProject.getDisplayOrder());
                    existingProject.setCostEstimate(updatedProject.getCostEstimate());
                    Project savedProject = projectRepository.save(existingProject);
                    return ResponseEntity.ok(savedProject);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /** Delete a project */
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        }

        // Remove all links before deleting project
        todoProjectLinkRepository.deleteByProjectId(id);
        projectRepository.deleteById(id);
        return ResponseEntity.ok("Project deleted successfully");
    }


    @GetMapping("/all-links")
    public ResponseEntity<List<TodoProjectLinkDTO>> allLinks() {
        List<TodoProjectLinkDTO> linkedTodos = todoProjectLinkRepository.mapToDTO(todoProjectLinkRepository.findAllLinksWithDetails());
        return ResponseEntity.ok(linkedTodos);
    }

    /** ✅ Fetch all linked todos with full details */
    @GetMapping("/{id}/todos")
    public ResponseEntity<List<Todo>> getLinkedTodos(@PathVariable Long id) {
        List<Todo> linkedTodos = todoProjectLinkRepository.findTodosByProjectId(id);
        return ResponseEntity.ok(linkedTodos);
    }

    /** ✅ Fetch all linked projects with full details */
    @GetMapping("/{id}/projects")
    public ResponseEntity<List<Project>> getLinkedProjects(@PathVariable Long id) {
        List<Project> linkedProjects = todoProjectLinkRepository.findProjectsByTodoId(id);
        return ResponseEntity.ok(linkedProjects);
    }


    /** Link a project to a todo */
    @PostMapping("/{projectId}/link-todo/{todoId}")
    @Transactional
    public ResponseEntity<?> linkProjectToTodo(@PathVariable Long projectId, @PathVariable Long todoId) {
        if (!projectRepository.existsById(projectId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Project not found");
        }

        TodoProjectLink link = new TodoProjectLink(todoId, projectId);
        todoProjectLinkRepository.save(link);
        return ResponseEntity.ok("Project linked to Todo successfully");
    }

    /** Unlink a project from a todo */
    @DeleteMapping("/{projectId}/unlink-todo/{todoId}")
    @Transactional
    public ResponseEntity<?> unlinkProjectFromTodo(@PathVariable Long projectId, @PathVariable Long todoId) {
        Optional<TodoProjectLink> link = todoProjectLinkRepository.findByTodoIdAndProjectId(todoId, projectId);
        if (link.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Link not found");
        }
        todoProjectLinkRepository.delete(link.get());
        return ResponseEntity.ok("Project unlinked from Todo successfully");
    }
}
