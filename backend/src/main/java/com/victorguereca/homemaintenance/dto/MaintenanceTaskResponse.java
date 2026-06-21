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
    private String description;;
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

    }
}
