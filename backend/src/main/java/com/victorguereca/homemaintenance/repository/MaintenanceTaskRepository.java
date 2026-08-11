package com.victorguereca.homemaintenance.repository;

import com.victorguereca.homemaintenance.model.MaintenanceTask;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;
import com.victorguereca.homemaintenance.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MaintenanceTaskRepository extends JpaRepository<MaintenanceTask, Long>,
        JpaSpecificationExecutor<MaintenanceTask> {

    List<MaintenanceTask> findByStatus(TaskStatus status);

    List<MaintenanceTask> findByUrgencyLevel(UrgencyLevel urgencyLevel);

    List<MaintenanceTask> findByDueDateBefore(LocalDate date);

    List<MaintenanceTask> findByCategoryIgnoreCase(String category);

    List<MaintenanceTask> findByTaskNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String taskName,
            String description
    );

    List<MaintenanceTask> findByOwner(AppUser owner);

    List<MaintenanceTask> findByOwnerOrderByDueDateAsc(AppUser owner);

    Optional<MaintenanceTask> findByIdAndOwner(Long id, AppUser owner);

    List<MaintenanceTask> findByOwnerAndStatus(AppUser owner, TaskStatus status);

    List<MaintenanceTask> findByOwnerAndUrgencyLevel(AppUser owner, UrgencyLevel urgencyLevel);

    List<MaintenanceTask> findByOwnerAndCategoryIgnoreCase(AppUser owner, String category);

    List<MaintenanceTask> findByOwnerAndDueDateBefore(AppUser owner, LocalDate date);

    List<MaintenanceTask> findByOwnerAndTaskNameContainingIgnoreCaseOrOwnerAndDescriptionContainingIgnoreCase(
            AppUser taskNameOwner,
            String taskName,
            AppUser descriptionOwner,
            String description
    );
}