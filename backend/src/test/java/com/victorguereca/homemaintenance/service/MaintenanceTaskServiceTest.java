package com.victorguereca.homemaintenance.service;

import com.victorguereca.homemaintenance.dto.MaintenanceTaskRequest;
import com.victorguereca.homemaintenance.dto.MaintenanceTaskResponse;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;
import com.victorguereca.homemaintenance.repository.MaintenanceTaskRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class MaintenanceTaskServiceTest {

    @Autowired
    private MaintenanceTaskService taskService;

    @Autowired
    private MaintenanceTaskRepository taskRepository;

    @Test
    void createTaskSavesMaintenanceTaskSuccessfully() {
        taskRepository.deleteAll();

        MaintenanceTaskRequest request = new MaintenanceTaskRequest();
        request.setTaskName("Replace HVAC filter");
        request.setCategory("HVAC");
        request.setDescription("Replace the home HVAC filter.");
        request.setDueDate(LocalDate.now().plusDays(30));
        request.setEstimatedCost(new BigDecimal("25.00"));
        request.setUrgencyLevel(UrgencyLevel.MEDIUM);
        request.setStatus(TaskStatus.OPEN);
        request.setNotes("Use correct filter size.");

        MaintenanceTaskResponse response = taskService.createTask(request);

        assertNotNull(response.getId());
        assertEquals("Replace HVAC filter", response.getTaskName());
        assertEquals("HVAC", response.getCategory());
        assertEquals(new BigDecimal("25.00"), response.getEstimatedCost());
        assertEquals(UrgencyLevel.MEDIUM, response.getUrgencyLevel());
        assertEquals(TaskStatus.OPEN, response.getStatus());
    }
}