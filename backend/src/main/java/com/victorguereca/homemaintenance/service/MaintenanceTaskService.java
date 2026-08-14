package com.victorguereca.homemaintenance.service;

import com.victorguereca.homemaintenance.dto.DashboardSummaryResponse;
import com.victorguereca.homemaintenance.dto.MaintenanceReportResponse;
import com.victorguereca.homemaintenance.dto.MaintenanceTaskRequest;
import com.victorguereca.homemaintenance.dto.MaintenanceTaskResponse;
import com.victorguereca.homemaintenance.exception.ResourceNotFoundException;
import com.victorguereca.homemaintenance.model.MaintenanceTask;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;
import com.victorguereca.homemaintenance.repository.MaintenanceTaskRepository;
import com.victorguereca.homemaintenance.report.MaintenanceReport;
import com.victorguereca.homemaintenance.report.MaintenanceTaskReport;
import com.victorguereca.homemaintenance.specification.MaintenanceTaskSpecification;
import com.victorguereca.homemaintenance.user.AppUser;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceTaskService {

    private final MaintenanceTaskRepository taskRepository;

    public MaintenanceTaskService(MaintenanceTaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<MaintenanceTaskResponse> getAllTasks() {
        Optional<AppUser> currentUser = getCurrentUser();

        List<MaintenanceTask> tasks = currentUser
                .map(taskRepository::findByOwner)
                .orElseGet(taskRepository::findAll);

        return tasks.stream()
                .map(MaintenanceTaskResponse::new)
                .toList();
    }

    public List<MaintenanceTaskResponse> searchTasks(String keyword,
                                                     String category,
                                                     TaskStatus status,
                                                     UrgencyLevel urgencyLevel,
                                                     String sortBy) {

        Optional<AppUser> currentUser = getCurrentUser();

        Specification<MaintenanceTask> specification = Specification
                .where(MaintenanceTaskSpecification.keywordContains(keyword))
                .and(MaintenanceTaskSpecification.categoryEquals(category))
                .and(MaintenanceTaskSpecification.statusEquals(status))
                .and(MaintenanceTaskSpecification.urgencyEquals(urgencyLevel));

        if (currentUser.isPresent()) {
            specification = specification.and(ownerEquals(currentUser.get()));
        }

        Sort sort = buildSort(sortBy);

        return taskRepository.findAll(specification, sort)
                .stream()
                .map(MaintenanceTaskResponse::new)
                .toList();
    }

    public DashboardSummaryResponse getDashboardSummary() {
        Optional<AppUser> currentUser = getCurrentUser();

        List<MaintenanceTask> tasks = currentUser
                .map(taskRepository::findByOwner)
                .orElseGet(taskRepository::findAll);

        LocalDate today = LocalDate.now();

        long openTasks = tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.OPEN || task.getStatus() == TaskStatus.IN_PROGRESS)
                .count();

        long completedTasks = tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.COMPLETED)
                .count();

        long overdueTasks = tasks.stream()
                .filter(task -> task.getStatus() != TaskStatus.COMPLETED)
                .filter(task -> task.getDueDate().isBefore(today))
                .count();

        BigDecimal totalEstimatedOpenCost = tasks.stream()
                .filter(task -> task.getStatus() == TaskStatus.OPEN || task.getStatus() == TaskStatus.IN_PROGRESS)
                .map(MaintenanceTask::getEstimatedCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardSummaryResponse(
                openTasks,
                completedTasks,
                overdueTasks,
                totalEstimatedOpenCost
        );
    }

    public MaintenanceReportResponse getMaintenanceTaskReport() {
        Optional<AppUser> currentUser = getCurrentUser();

        List<MaintenanceTask> tasks;

        if (currentUser.isPresent()) {
            Specification<MaintenanceTask> specification = ownerEquals(currentUser.get());
            tasks = taskRepository.findAll(specification, Sort.by(Sort.Direction.ASC, "dueDate"));
        } else {
            tasks = taskRepository.findAll(Sort.by(Sort.Direction.ASC, "dueDate"));
        }

        MaintenanceReport report = new MaintenanceTaskReport(tasks);

        return new MaintenanceReportResponse(report);
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

        getCurrentUser().ifPresent(task::setOwner);

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
        Optional<AppUser> currentUser = getCurrentUser();

        if (currentUser.isPresent()) {
            return taskRepository.findByIdAndOwner(id, currentUser.get())
                    .orElseThrow(() -> new ResourceNotFoundException("Maintenance task not found with id: " + id));
        }

        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance task not found with id: " + id));
    }

    private Optional<AppUser> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof AppUser appUser) {
            return Optional.of(appUser);
        }

        return Optional.empty();
    }

    private Specification<MaintenanceTask> ownerEquals(AppUser owner) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("owner"), owner);
    }

    private Sort buildSort(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "dueDate");
        }

        return switch (sortBy) {
            case "taskName" -> Sort.by(Sort.Direction.ASC, "taskName");
            case "category" -> Sort.by(Sort.Direction.ASC, "category");
            case "estimatedCost" -> Sort.by(Sort.Direction.ASC, "estimatedCost");
            case "urgencyLevel" -> Sort.by(Sort.Direction.ASC, "urgencyLevel");
            case "status" -> Sort.by(Sort.Direction.ASC, "status");
            case "dueDate" -> Sort.by(Sort.Direction.ASC, "dueDate");
            default -> Sort.by(Sort.Direction.ASC, "dueDate");
        };
    }
}