package com.amitthk.reactdragndroptodo.controller;

import com.amitthk.reactdragndroptodo.model.Project;
import com.amitthk.reactdragndroptodo.model.Todo;
import com.amitthk.reactdragndroptodo.model.TodoProjectLink;
import com.amitthk.reactdragndroptodo.repository.ProjectRepository;
import com.amitthk.reactdragndroptodo.repository.TodoProjectLinkRepository;
import com.amitthk.reactdragndroptodo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.function.Consumer;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TodoProjectLinkRepository todoProjectLinkRepository;

    /** Fetch all todos */
    @GetMapping
    public List<Todo> getTodos() {
        return todoRepository.findAll();
    }

    /** Create a new Todo with auto-incremented priority */
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        int maxOrder = todoRepository.findAll().stream()
                .mapToInt(Todo::getPriorityOrder)
                .max()
                .orElse(0);
        todo.setPriorityOrder(maxOrder + 1);
        return todoRepository.save(todo);
    }

    /** Update a Todo */
    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
        return todoRepository.findById(id)
                .map(existingTodo -> {
                    existingTodo.setName(updatedTodo.getName());
                    existingTodo.setType(updatedTodo.getType());
                    existingTodo.setPriority(updatedTodo.getPriority());
                    return todoRepository.save(existingTodo);
                })
                .orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    /** Delete a Todo */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        if (!todoRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
        }
        todoRepository.deleteById(id);
        return ResponseEntity.ok("Todo deleted successfully");
    }

    /** Update order of todos */
    @PutMapping("/order")
    @Transactional
    public ResponseEntity<List<Todo>> updateTodosOrder(@RequestBody List<Todo> todos) {
        todos.forEach(todo -> {
            todoRepository.findById(todo.getId()).ifPresent(existingTodo -> {
                existingTodo.setPriority(todo.getPriority());
                todoRepository.save(existingTodo);
            });
        });
        return ResponseEntity.ok(todoRepository.findAll());
    }

    /** Fetch all projects */
    @GetMapping("/projects")
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    /** Link a Todo to a Project */
    @PostMapping("/link")
    @Transactional
    public ResponseEntity<?> linkTodoToProject(@RequestParam Long todoId, @RequestParam Long projectId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        TodoProjectLink link = new TodoProjectLink();
        link.setTodoId(todoId);
        link.setProjectId(projectId);

        todoProjectLinkRepository.save(link);
        return ResponseEntity.ok("Todo linked to Project successfully");
    }

    /** Unlink a Todo from a Project */
    @DeleteMapping("/unlink")
    @Transactional
    public ResponseEntity<?> unlinkTodoFromProject(@RequestParam Long todoId, @RequestParam Long projectId) {
        Optional<TodoProjectLink> link = todoProjectLinkRepository.findByTodoIdAndProjectId(todoId, projectId);
        if (link.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Link not found");
        }
        todoProjectLinkRepository.delete(link.get());
        return ResponseEntity.ok("Todo unlinked from Project successfully");
    }

    /** Process external API data */
    public void fetchAndProcessAPIData() {
        // Simulating an API fetch (Replace with actual API call)
        List<Map<String, Object>> mockApiResponse = new ArrayList<>();

        // Process the API response
        processAPIData(mockApiResponse);
    }

    private void processAPIData(List<Map<String, Object>> data) {
        List<Todo> todos = new ArrayList<>();
        List<Project> projects = new ArrayList<>();
        List<TodoProjectLink> links = new ArrayList<>();

        for (Map<String, Object> projectData : data) {
            Long projectId = Long.parseLong(projectData.get("id").toString());
            String projectName = projectData.get("name").toString();

            Project project = new Project();
            project.setId(projectId);
            project.setName(projectName);
            projects.add(project);

            List<Map<String, Object>> todosData = (List<Map<String, Object>>) projectData.get("todos");
            for (Map<String, Object> todoData : todosData) {
                Long todoId = Long.parseLong(todoData.get("id").toString());

                Todo todo = new Todo();
                todo.setId(todoId);
                todo.setName(todoData.get("name").toString());
                todo.setType(todoData.get("type").toString());
                todo.setPriority(Long.parseLong(todoData.get("priority").toString()));

                todos.add(todo);
                links.add(new TodoProjectLink(todoId, projectId));
            }
        }

        todoRepository.saveAll(todos);
        projectRepository.saveAll(projects);
        todoProjectLinkRepository.saveAll(links);
    }

    /** Process Todo CSV Upload */
    @Transactional
    public void processTodoUpload(MultipartFile file) throws Exception {
        processCSVUpload(file, (tokens) -> {
            Todo todo = new Todo();
            todo.setId(Long.parseLong(tokens[0].trim()));
            todo.setName(tokens[1].trim());
            todo.setType(tokens[2].trim());
            todo.setPriority(Long.parseLong(tokens[3].trim()));
            todoRepository.save(todo);
        });
    }

    /** Process Project CSV Upload */
    @Transactional
    public void processProjectUpload(MultipartFile file) throws Exception {
        processCSVUpload(file, (tokens) -> {
            Project project = new Project();
            project.setId(Long.parseLong(tokens[0].trim()));
            project.setName(tokens[1].trim());
            project.setDescription(tokens[2].trim());
            projectRepository.save(project);
        });
    }

    /** Process Link CSV Upload */
    @Transactional
    public void processLinkUpload(MultipartFile file) throws Exception {
        processCSVUpload(file, (tokens) -> {
            Long todoId = Long.parseLong(tokens[0].trim());
            Long projectId = Long.parseLong(tokens[1].trim());

            if (todoRepository.existsById(todoId) && projectRepository.existsById(projectId)) {
                todoProjectLinkRepository.save(new TodoProjectLink(todoId, projectId));
            }
        });
    }

    private void processCSVUpload(MultipartFile file, Consumer<String[]> processor) throws Exception {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean headerSkipped = false;
            while ((line = br.readLine()) != null) {
                if (!headerSkipped) {
                    headerSkipped = true;
                    continue;
                }
                String[] tokens = line.split(",");
                if (tokens.length < 2) continue;
                processor.accept(tokens);
            }
        }
    }
}
