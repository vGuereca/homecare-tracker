package com.victorguereca.homemaintenance.dto;

import com.victorguereca.homemaintenance.model.MaintenanceTask;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MaintenanceTaskResponse {

    private Long id;
    private String taskName;
    private String category;
    private String description;
    private LocalDate dueDate;
    private BigDecimal estimatedCost;
    private UrgencyLevel urgencyLevel;
    private TaskStatus status;
    private String notes;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public MaintenanceTaskResponse(MaintenanceTask task) {
        this.id = task.getId();
        this.taskName = task.getTaskName();
        this.category = task.getCategory();
        this.description = task.getDescription();
        this.dueDate = task.getDueDate();
        this.estimatedCost = task.getEstimatedCost();
        this.urgencyLevel = task.getUrgencyLevel();
        this.status = task.getStatus();
        this.notes = task.getNotes();
        this.createdDate = task.getCreatedDate();
        this.updatedDate = task.getUpdatedDate();
    }

    public Long getId() {
        return id;
    }

    public String getTaskName() {
        return taskName;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public UrgencyLevel getUrgencyLevel() {
        return urgencyLevel;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }
}