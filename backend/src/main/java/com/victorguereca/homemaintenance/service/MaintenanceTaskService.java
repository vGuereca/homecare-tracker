package com.victorguereca.homemaintenance.service;

import com.victorguereca.homemaintenance.dto.MaintenanceTaskRequest;
import com.victorguereca.homemaintenance.dto.MaintenanceTaskResponse;
import com.victorguereca.homemaintenance.exception.ResourceNotFoundException;
import com.victorguereca.homemaintenance.model.MaintenanceTask;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.repository.MaintenanceTaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceTaskService {

    private final MaintenanceTaskRepository taskRepository;

    public MaintenanceTaskService(MaintenanceTaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<MaintenanceTaskResponse> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(MaintenanceTaskResponse::new)
                .toList();
    }

    public MaintenanceTaskResponse getTaskById(Long id) {
        MaintenanceTask task = findTaskOrThrow(id);
        return new MaintenanceTaskResponse(task);
    }

    public MaintenanceTaskResponse createTask(MaintenanceTaskRequest request) {
        MaintenanceTask task = new MaintenanceTask(
                request.getTaskName(),
                request.getCategory(),
                request.getDescription(),
                request.getDueDate(),
                request.getEstimatedCost(),
                request.getUrgencyLevel(),
                request.getStatus(),
                request.getNotes()
        );

        MaintenanceTask savedTask = taskRepository.save(task);
        return new MaintenanceTaskResponse(savedTask);
    }

    public MaintenanceTaskResponse updateTask(Long id, MaintenanceTaskRequest request) {
        MaintenanceTask task = findTaskOrThrow(id);

        task.setTaskName(request.getTaskName());
        task.setCategory(request.getCategory());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setEstimatedCost(request.getEstimatedCost());
        task.setUrgencyLevel(request.getUrgencyLevel());
        task.setStatus(request.getStatus());
        task.setNotes(request.getNotes());

        MaintenanceTask updatedTask = taskRepository.save(task);
        return new MaintenanceTaskResponse(updatedTask);
    }

    public MaintenanceTaskResponse markTaskCompleted(Long id) {
        MaintenanceTask task = findTaskOrThrow(id);
        task.setStatus(TaskStatus.COMPLETED);

        MaintenanceTask updatedTask = taskRepository.save(task);
        return new MaintenanceTaskResponse(updatedTask);
    }

    public void deleteTask(Long id) {
        MaintenanceTask task = findTaskOrThrow(id);
        taskRepository.delete(task);
    }

    private MaintenanceTask findTaskOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance task not found with id: " + id));
    }
}