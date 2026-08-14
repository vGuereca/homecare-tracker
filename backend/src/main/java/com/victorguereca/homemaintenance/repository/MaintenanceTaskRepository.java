package com.victorguereca.homemaintenance.repository;

import com.victorguereca.homemaintenance.model.MaintenanceTask;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;
import com.victorguereca.homemaintenance.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface MaintenanceTaskRepository
        extends JpaRepository<MaintenanceTask, Long>, JpaSpecificationExecutor<MaintenanceTask> {

    List<MaintenanceTask> findByOwner(AppUser owner);

    Optional<MaintenanceTask> findByIdAndOwner(Long id, AppUser owner);

    List<MaintenanceTask> findByOwnerAndCategoryIgnoreCase(AppUser owner, String category);

    List<MaintenanceTask> findByOwnerAndStatus(AppUser owner, TaskStatus status);

    List<MaintenanceTask> findByOwnerAndUrgencyLevel(AppUser owner, UrgencyLevel urgencyLevel);

    List<MaintenanceTask> findByOwnerAndTaskNameContainingIgnoreCase(AppUser owner, String taskName);

    List<MaintenanceTask> findByOwnerAndDescriptionContainingIgnoreCase(AppUser owner, String description);
}