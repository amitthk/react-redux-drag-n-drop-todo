package com.amitthk.reactdragndroptodo.controller;

import com.amitthk.reactdragndroptodo.model.Schedule;
import com.amitthk.reactdragndroptodo.model.ScheduledTodo;
import com.amitthk.reactdragndroptodo.model.Todo;
import com.amitthk.reactdragndroptodo.repository.ScheduleRepository;
import com.amitthk.reactdragndroptodo.repository.ScheduledTodoRepository;
import com.amitthk.reactdragndroptodo.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleRepository scheduleRepository;
    private final TodoRepository todoRepository;
    private final ScheduledTodoRepository scheduledTodoRepository;

    @Autowired
    public ScheduleController(ScheduleRepository scheduleRepository,
                              TodoRepository todoRepository,
                              ScheduledTodoRepository scheduledTodoRepository) {
        this.scheduleRepository = scheduleRepository;
        this.todoRepository = todoRepository;
        this.scheduledTodoRepository = scheduledTodoRepository;
    }

    @GetMapping
    public List<Schedule> getSchedules() {
        return scheduleRepository.findAll();
    }

    @GetMapping("/{date}")
    public Schedule getScheduleByDate(@PathVariable String date) {
        return scheduleRepository.findByDate(date)
                .orElseGet(() -> {
                    // If no schedule exists, create a new one
                    Schedule newSchedule = new Schedule();
                    newSchedule.setDate(date);
                    return scheduleRepository.save(newSchedule);
                });
    }

    @PostMapping("/{date}/todo")
    public Schedule addTodoToSchedule(@PathVariable String date, @RequestBody Todo todo) {
        // Fetch or create the schedule for the given date
        Schedule schedule = scheduleRepository.findByDate(date)
                .orElseGet(() -> {
                    Schedule newSchedule = new Schedule();
                    newSchedule.setDate(date);
                    return scheduleRepository.save(newSchedule);
                });

        // Check if the Todo already exists in the schedule
        boolean todoExists = schedule.getScheduledTodos().stream()
                .anyMatch(scheduledTodo -> scheduledTodo.getTodo().getId().equals(todo.getId()));

        if (!todoExists) {
            // Persist the Todo if it doesn't already exist
            Todo managedTodo = todo.getId() != null
                    ? todoRepository.findById(todo.getId())
                    .orElseThrow(() -> new RuntimeException("Todo not found with ID: " + todo.getId()))
                    : todoRepository.save(todo);

            ScheduledTodo scheduledTodo = new ScheduledTodo();
            scheduledTodo.setSchedule(schedule);
            scheduledTodo.setTodo(managedTodo);
            scheduledTodo.setOrderOfExecution(schedule.getScheduledTodos().size() + 1);

            scheduledTodoRepository.save(scheduledTodo);
            schedule.getScheduledTodos().add(scheduledTodo);
        }

        return scheduleRepository.save(schedule);
    }



    @PutMapping("/{date}/reorder")
    public Schedule reorderTodos(@PathVariable String date, @RequestBody List<ScheduledTodo> reorderedScheduledTodos) {
        // Fetch the schedule by date
        Schedule schedule = scheduleRepository.findByDate(date)
                .orElseThrow(() -> new RuntimeException("Schedule not found for date: " + date));

        List<ScheduledTodo> scheduledTodos = schedule.getScheduledTodos();

        if (scheduledTodos.size() != reorderedScheduledTodos.size()) {
            throw new RuntimeException("Mismatch in scheduled todos count. Expected: " + scheduledTodos.size()
                    + ", Received: " + reorderedScheduledTodos.size());
        }

        for (ScheduledTodo updatedScheduledTodo : reorderedScheduledTodos) {
            if (updatedScheduledTodo.getId() == null) {
                throw new RuntimeException("ScheduledTodo ID cannot be null in reorder request.");
            }

            ScheduledTodo existingScheduledTodo = scheduledTodos.stream()
                    .filter(st -> st.getId().equals(updatedScheduledTodo.getId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("ScheduledTodo with ID " + updatedScheduledTodo.getId() + " not found in schedule"));

            existingScheduledTodo.setOrderOfExecution(updatedScheduledTodo.getOrderOfExecution());
            scheduledTodoRepository.save(existingScheduledTodo);
        }

        return scheduleRepository.findById(schedule.getId())
                .orElseThrow(() -> new RuntimeException("Failed to fetch updated schedule after reordering."));
    }





}
