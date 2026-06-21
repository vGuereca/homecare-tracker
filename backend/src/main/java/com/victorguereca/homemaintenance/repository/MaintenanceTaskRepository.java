package com.victorguereca.homemaintenance.repository;

import com.victorguereca.homemaintenance.model.MaintenanceTask;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceTaskRepository extends JpaRepository<MaintenanceTask, Long> {
}
