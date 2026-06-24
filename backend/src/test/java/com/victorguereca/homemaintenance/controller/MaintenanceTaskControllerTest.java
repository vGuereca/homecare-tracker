package com.victorguereca.homemaintenance.controller;

import tools.jackson.databind.ObjectMapper;
import com.victorguereca.homemaintenance.dto.MaintenanceTaskRequest;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;
import com.victorguereca.homemaintenance.repository.MaintenanceTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/*
These verify -
Valid task request creates a task
Invalid user input returns 400 Bad Request
A Missing task ID returns 404 Not Found
Validation errors use custom API error format
API is behaving predictably bor both success and failure paths
 */

@SpringBootTest
@AutoConfigureMockMvc
class MaintenanceTaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MaintenanceTaskRepository taskRepository;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
    }

    @Test
    void createTaskReturnsCreatedStatusWhenRequestIsValid() throws Exception {
        MaintenanceTaskRequest request = createValidRequest();

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.taskName").value("Replace HVAC filter"))
                .andExpect(jsonPath("$.category").value("HVAC"))
                .andExpect(jsonPath("$.urgencyLevel").value("MEDIUM"))
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    void createTaskReturnsBadRequestWhenTaskNameIsBlank() throws Exception {
        MaintenanceTaskRequest request = createValidRequest();
        request.setTaskName("");

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.messages", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.messages[0]", containsString("Task name is required")));
    }

    @Test
    void deleteTaskReturnsNotFoundWhenTaskDoesNotExist() throws Exception {
        mockMvc.perform(delete("/api/tasks/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Resource Not Found"))
                .andExpect(jsonPath("$.messages[0]", containsString("Maintenance task not found")));
    }

    private MaintenanceTaskRequest createValidRequest() {
        MaintenanceTaskRequest request = new MaintenanceTaskRequest();
        request.setTaskName("Replace HVAC filter");
        request.setCategory("HVAC");
        request.setDescription("Replace the home HVAC filter.");
        request.setDueDate(LocalDate.now().plusDays(30));
        request.setEstimatedCost(new BigDecimal("25.00"));
        request.setUrgencyLevel(UrgencyLevel.MEDIUM);
        request.setStatus(TaskStatus.OPEN);
        request.setNotes("Use correct filter size.");
        return request;
    }
}