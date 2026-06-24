package com.victorguereca.homemaintenance.repository;

import com.victorguereca.homemaintenance.model.MaintenanceTask;
import com.victorguereca.homemaintenance.model.TaskStatus;
import com.victorguereca.homemaintenance.model.UrgencyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface MaintenanceTaskRepository extends JpaRepository<MaintenanceTask, Long>,
        JpaSpecificationExecutor<MaintenanceTask> {

    List<MaintenanceTask> findByStatus(TaskStatus status);

    List<MaintenanceTask> findByUrgencyLevel(UrgencyLevel urgencyLevel);

    List<MaintenanceTask> findByCategoryIgnoreCase(String category);
}