package com.victorguereca.homemaintenance.report;

import com.victorguereca.homemaintenance.model.MaintenanceTask;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MaintenanceTaskReport extends MaintenanceReport {

    private final List<MaintenanceTask> tasks;

    public MaintenanceTaskReport(List<MaintenanceTask> tasks) {
        super("Home Maintenance Task Report");
        this.tasks = tasks;
    }

    @Override
    public List<String> getColumns() {
        return List.of(
                "Task Name",
                "Category",
                "Due Date",
                "Estimated Cost",
                "Urgency",
                "Status"
        );
    }

    @Override
    public List<Map<String, String>> getRows() {
        List<Map<String, String>> rows = new ArrayList<>();

        for (MaintenanceTask task : tasks) {
            rows.add(Map.of(
                    "Task Name", task.getTaskName(),
                    "Category", task.getCategory(),
                    "Due Date", task.getDueDate().toString(),
                    "Estimated Cost", task.getEstimatedCost().toPlainString(),
                    "Urgency", task.getUrgencyLevel().toString(),
                    "Status", task.getStatus().toString()
            ));
        }

        return rows;
    }
}