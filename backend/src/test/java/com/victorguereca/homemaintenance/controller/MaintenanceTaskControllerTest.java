package com.victorguereca.homemaintenance.controller;

import com.victorguereca.homemaintenance.auth.RegisterRequest;
import com.victorguereca.homemaintenance.dto.MaintenanceTaskRequest;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;
import com.victorguereca.homemaintenance.repository.MaintenanceTaskRepository;
import com.victorguereca.homemaintenance.user.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

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
- Authenticated users can create maintenance tasks.
- Authenticated users can retrieve their own task rows.
- Search returns matching rows for the authenticated user.
- Filtering and sorting can be used together.
- Invalid user input returns 400 Bad Request.
- A missing task ID returns 404 Not Found.
- Validation errors use the custom API error format.
- Dashboard endpoint returns summary metrics for the authenticated user.
- Authenticated users only access their own maintenance tasks.
- Unauthenticated task requests are rejected.
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

    @Autowired
    private AppUserRepository appUserRepository;

    private String authToken;

    @BeforeEach
    void setUp() throws Exception {
        taskRepository.deleteAll();
        appUserRepository.deleteAll();

        authToken = registerAndReturnToken(
                "Test",
                "User",
                "testuser@example.com",
                "password123"
        );
    }

    @Test
    void createTaskReturnsCreatedStatusWhenRequestIsValid() throws Exception {
        MaintenanceTaskRequest request = createValidRequest();

        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + authToken)
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

        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void searchTasksByKeywordReturnsMultipleMatchingRows() throws Exception {
        createTaskThroughApi("Replace HVAC filter", "HVAC");
        createTaskThroughApi("Replace air purifier filter", "Indoor Air");
        createTaskThroughApi("Clean gutters", "Exterior");

        mockMvc.perform(get("/api/tasks/search")
                        .header("Authorization", "Bearer " + authToken)
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
                        .header("Authorization", "Bearer " + authToken)
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

        mockMvc.perform(get("/api/tasks/dashboard")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.openTasks").value(2))
                .andExpect(jsonPath("$.completedTasks").value(1))
                .andExpect(jsonPath("$.totalEstimatedOpenCost").value(65.00));
    }

    @Test
    void reportReturnsTitleTimestampColumnsAndMultipleRows() throws Exception {
        createTaskThroughApi("Replace HVAC filter", "HVAC");
        createTaskThroughApi("Clean gutters", "Exterior");

        mockMvc.perform(get("/api/tasks/report")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Home Maintenance Task Report"))
                .andExpect(jsonPath("$.generatedAt").exists())
                .andExpect(jsonPath("$.columns", hasSize(6)))
                .andExpect(jsonPath("$.rows", hasSize(2)))
                .andExpect(jsonPath("$.rows[0]['Task Name']").exists())
                .andExpect(jsonPath("$.rows[0]['Category']").exists())
                .andExpect(jsonPath("$.rows[0]['Due Date']").exists())
                .andExpect(jsonPath("$.rows[0]['Estimated Cost']").exists())
                .andExpect(jsonPath("$.rows[0]['Urgency']").exists())
                .andExpect(jsonPath("$.rows[0]['Status']").exists());
    }

    @Test
    void createTaskReturnsBadRequestWhenTaskNameIsBlank() throws Exception {
        MaintenanceTaskRequest request = createValidRequest();
        request.setTaskName("");

        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.messages", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.messages[0]", containsString("Task name is required")));
    }

    @Test
    void deleteTaskReturnsNotFoundWhenTaskDoesNotExist() throws Exception {
        mockMvc.perform(delete("/api/tasks/999")
                        .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Resource Not Found"))
                .andExpect(jsonPath("$.messages[0]", containsString("Maintenance task not found")));
    }

    @Test
    void unauthenticatedTaskRequestReturnsForbidden() throws Exception {
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isForbidden());
    }

    @Test
    void authenticatedUsersOnlySeeTheirOwnTasks() throws Exception {
        String userAToken = registerAndReturnToken(
                "User",
                "A",
                "usera@example.com",
                "password123"
        );

        String userBToken = registerAndReturnToken(
                "User",
                "B",
                "userb@example.com",
                "password123"
        );

        createTaskThroughApiWithToken("User A task", "HVAC", userAToken);
        createTaskThroughApiWithToken("User B task", "Plumbing", userBToken);

        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].taskName").value("User A task"));

        mockMvc.perform(get("/api/tasks")
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].taskName").value("User B task"));
    }

    @Test
    void authenticatedUserCannotAccessAnotherUsersTaskById() throws Exception {
        String userAToken = registerAndReturnToken(
                "User",
                "A",
                "owner@example.com",
                "password123"
        );

        String userBToken = registerAndReturnToken(
                "User",
                "B",
                "other@example.com",
                "password123"
        );

        String userATaskJson = createTaskThroughApiWithToken("Private user A task", "HVAC", userAToken);

        Long userATaskId = objectMapper.readTree(userATaskJson)
                .get("id")
                .asLong();

        mockMvc.perform(get("/api/tasks/" + userATaskId)
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void authenticatedTaskCreationSetsTaskOwner() throws Exception {
        String token = registerAndReturnToken(
                "Owner",
                "User",
                "taskowner@example.com",
                "password123"
        );

        String taskJson = createTaskThroughApiWithToken("Owned task", "Electrical", token);

        Long taskId = objectMapper.readTree(taskJson)
                .get("id")
                .asLong();

        var savedTask = taskRepository.findById(taskId)
                .orElseThrow();

        assert savedTask.getOwner() != null;
        assert savedTask.getOwner().getEmail().equals("taskowner@example.com");
    }

    private String createTaskThroughApi(String taskName, String category) throws Exception {
        return createTaskThroughApiWithToken(taskName, category, authToken);
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
                        .header("Authorization", "Bearer " + authToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
    }

    private String registerAndReturnToken(String firstName,
                                          String lastName,
                                          String email,
                                          String password) throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setEmail(email);
        request.setPassword(password);

        String responseJson = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(responseJson)
                .get("token")
                .asText();
    }

    private String createTaskThroughApiWithToken(String taskName,
                                                 String category,
                                                 String token) throws Exception {
        MaintenanceTaskRequest request = createValidRequest();
        request.setTaskName(taskName);
        request.setCategory(category);
        request.setDescription(taskName + " maintenance task description.");
        request.setNotes("Test notes for " + taskName + ".");

        return mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + token)
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