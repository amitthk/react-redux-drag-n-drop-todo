package com.amitthk.reactdragndroptodo.controller;

import com.amitthk.reactdragndroptodo.model.Schedule;
import com.amitthk.reactdragndroptodo.model.Todo;
import com.amitthk.reactdragndroptodo.repository.ScheduleRepository;
import com.amitthk.reactdragndroptodo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleRepository scheduleRepository;
    private final TodoRepository todoRepository;

    @Autowired
    public ScheduleController(ScheduleRepository scheduleRepository, TodoRepository todoRepository) {
        this.scheduleRepository = scheduleRepository;
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<Schedule> getSchedules() {
        return scheduleRepository.findAll();
    }

    @GetMapping("/{date}")
    public Schedule getScheduleByDate(@PathVariable String date) {
        return scheduleRepository.findByDate(date)
                .orElseGet(() -> {
                    Schedule newSchedule = new Schedule();
                    newSchedule.setDate(date);
                    newSchedule.setTodos(new HashSet<>()); // Use a mutable Set
                    return newSchedule;
                });
    }

    @PostMapping
    public Schedule createOrUpdateSchedule(@RequestBody Schedule schedule) {
        Optional<Schedule> existingSchedule = scheduleRepository.findByDate(schedule.getDate());
        if (existingSchedule.isPresent()) {
            Schedule updatedSchedule = existingSchedule.get();
            updatedSchedule.setTodos(schedule.getTodos());
            return scheduleRepository.save(updatedSchedule);
        } else {
            return scheduleRepository.save(schedule);
        }
    }

    @PostMapping("/{date}/todo")
    public Schedule addTodoToSchedule(@PathVariable String date, @RequestBody Todo todo) {
        Schedule schedule = scheduleRepository.findByDate(date)
                .orElseGet(() -> {
                    Schedule newSchedule = new Schedule();
                    newSchedule.setDate(date);
                    newSchedule.setTodos(new HashSet<>());
                    return newSchedule;
                });

        // Check if the Todo is already associated
        boolean todoExists = schedule.getTodos().stream()
                .anyMatch(existingTodo -> existingTodo.getId().equals(todo.getId()));

        if (!todoExists) {
            Todo managedTodo = todo.getId() != null
                    ? todoRepository.findById(todo.getId())
                    .orElseThrow(() -> new RuntimeException("Todo not found with ID: " + todo.getId()))
                    : todo;

            schedule.getTodos().add(managedTodo);
        }

        return scheduleRepository.save(schedule);
    }


    @PutMapping("/{date}/reorder")
    public Schedule reorderTodos(@PathVariable String date, @RequestBody List<Todo> reorderedTodos) {
        Schedule schedule = scheduleRepository.findByDate(date)
                .orElseThrow(() -> new RuntimeException("Schedule not found for date: " + date));

        schedule.setTodos(new HashSet<>(reorderedTodos)); // Convert to Set
        return scheduleRepository.save(schedule);
    }
}
