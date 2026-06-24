package com.victorguereca.homemaintenance.controller;

import com.victorguereca.homemaintenance.dto.MaintenanceTaskRequest;
import com.victorguereca.homemaintenance.dto.MaintenanceTaskResponse;
import com.victorguereca.homemaintenance.service.MaintenanceTaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class MaintenanceTaskController {

    private final MaintenanceTaskService taskService;

    public MaintenanceTaskController(MaintenanceTaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<MaintenanceTaskResponse> getAllTasks() {
        return taskService.getAllTasks();
    }

    //Endpoint creates API GET /api/tasks/search
    @GetMapping("/search")
    public List<MaintenanceTaskResponse> searchTasks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) UrgencyLevel urgencyLevel,
            @RequestParam(required = false) String sortBy) {

        return taskService.searchTasks(keyword, category, status, urgencyLevel, sortBy);
    }

    @GetMapping("/{id}")
    public MaintenanceTaskResponse getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceTaskResponse createTask(@Valid @RequestBody MaintenanceTaskRequest request) {
        return taskService.createTask(request);
    }

    @PutMapping("/{id}")
    public MaintenanceTaskResponse updateTask(@PathVariable Long id,
                                              @Valid @RequestBody MaintenanceTaskRequest request) {
        return taskService.updateTask(id, request);
    }

    @PatchMapping("/{id}/complete")
    public MaintenanceTaskResponse markTaskCompleted(@PathVariable Long id) {
        return taskService.markTaskCompleted(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}