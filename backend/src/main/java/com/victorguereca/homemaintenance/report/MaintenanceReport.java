package com.victorguereca.homemaintenance.report;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public abstract class MaintenanceReport {

    private final String title;
    private final LocalDateTime generatedAt;

    protected MaintenanceReport(String title) {
        this.title = title;
        this.generatedAt = LocalDateTime.now();
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public abstract List<String> getColumns();

    public abstract List<Map<String, String>> getRows();
}
