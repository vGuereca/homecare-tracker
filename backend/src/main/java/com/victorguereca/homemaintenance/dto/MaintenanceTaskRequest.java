package com.victorguereca.homemaintenance.dto;

import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MaintenanceTaskRequest {

    @NotBlank(message = "Task name is required.")
    private String taskName;

    @NotBlank(message = "Category is required.")
    private String category;

    private String description;

    @NotNull(message = "Due date is required.")
    @FutureOrPresent(message = "Due date cannot be in the past.")
    private LocalDate dueDate;

    @NotNull(message = "Estimated cost is required.")
    @DecimalMin(value = "0.00", message = "Estimated cost cannot be negative.")
    private BigDecimal estimatedCost;

    @NotNull(message = "Urgency level is required.")
    private UrgencyLevel urgencyLevel;

    @NotNull(message = "Status is required.")
    private TaskStatus status;

    private String notes;

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(BigDecimal estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public UrgencyLevel getUrgencyLevel() {
        return urgencyLevel;
    }

    public void setUrgencyLevel(UrgencyLevel urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}