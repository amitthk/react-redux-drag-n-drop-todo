package com.amitthk.reactdragndroptodo.controller;

import com.amitthk.reactdragndroptodo.model.Todo;
import com.amitthk.reactdragndroptodo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
    @Autowired
    private TodoRepository todoRepository;

    @GetMapping
    public List<Todo> getTodos() {
        return todoRepository.findAll();
    }

    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        int maxOrder = todoRepository.findAll().stream()
                .mapToInt(Todo::getPriorityOrder)
                .max()
                .orElse(0);
        todo.setPriorityOrder(maxOrder + 1);
        return todoRepository.save(todo);
    }


    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        return todoRepository.findById(id).map(existingTodo -> {
            existingTodo.setText(todo.getText());
            existingTodo.setType(todo.getType());
            return todoRepository.save(existingTodo);
        }).orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoRepository.deleteById(id);
    }

    @PutMapping("/order")
    public List<Todo> updateTodosOrder(@RequestBody List<Todo> todos) {
        todos.forEach(todo -> {
            todoRepository.findById(todo.getId()).ifPresent(existingTodo -> {
                existingTodo.setPriorityOrder(todo.getPriorityOrder());
                todoRepository.save(existingTodo);
            });
        });
        return todoRepository.findAll();
    }

}
