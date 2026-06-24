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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/*
These tests verify:
- A valid task request creates a task.
- The API can return multiple task rows.
- Search returns multiple matching rows.
- Filtering and sorting can be used together.
- Invalid user input returns 400 Bad Request.
- A missing task ID returns 404 Not Found.
- Validation errors use the custom API error format.
- The API behaves predictably for both success and failure paths.
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
    void getAllTasksReturnsMultipleRows() throws Exception {
        createTaskThroughApi("Replace HVAC filter", "HVAC");
        createTaskThroughApi("Clean gutters", "Exterior");

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void searchTasksByKeywordReturnsMultipleMatchingRows() throws Exception {
        createTaskThroughApi("Replace HVAC filter", "HVAC");
        createTaskThroughApi("Replace air purifier filter", "Indoor Air");
        createTaskThroughApi("Clean gutters", "Exterior");

        mockMvc.perform(get("/api/tasks/search")
                        .param("keyword", "filter"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].taskName").exists())
                .andExpect(jsonPath("$[1].taskName").exists());
    }

    @Test
    void searchTasksCanFilterByStatusAndSortByEstimatedCost() throws Exception {
        createTaskThroughApi("Clean dryer vent", "Safety");
        createTaskThroughApi("Inspect plumbing", "Plumbing");

        mockMvc.perform(get("/api/tasks/search")
                        .param("status", "OPEN")
                        .param("sortBy", "estimatedCost"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].status").value("OPEN"))
                .andExpect(jsonPath("$[1].status").value("OPEN"));
    }

    @Test
    void dashboardReturnsSummaryMetrics() throws Exception {
        createTaskThroughApi("Replace HVAC filter", "HVAC", TaskStatus.OPEN, new BigDecimal("25.00"));
        createTaskThroughApi("Clean dryer vent", "Safety", TaskStatus.IN_PROGRESS, new BigDecimal("40.00"));
        createTaskThroughApi("Test smoke detectors", "Safety", TaskStatus.COMPLETED, new BigDecimal("15.00"));

        mockMvc.perform(get("/api/tasks/dashboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.openTasks").value(2))
                .andExpect(jsonPath("$.completedTasks").value(1))
                .andExpect(jsonPath("$.totalEstimatedOpenCost").value(65.00));
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

    private String createTaskThroughApi(String taskName, String category) throws Exception {
        MaintenanceTaskRequest request = createValidRequest();
        request.setTaskName(taskName);
        request.setCategory(category);
        request.setDescription(taskName + " maintenance task description.");
        request.setNotes("Test notes for " + taskName + ".");

        return mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
    }

    private String createTaskThroughApi(String taskName,
                                        String category,
                                        TaskStatus status,
                                        BigDecimal estimatedCost) throws Exception {
        MaintenanceTaskRequest request = createValidRequest();
        request.setTaskName(taskName);
        request.setCategory(category);
        request.setStatus(status);
        request.setEstimatedCost(estimatedCost);
        request.setDescription(taskName + " maintenance task description.");
        request.setNotes("Test notes for " + taskName + ".");

        return mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
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