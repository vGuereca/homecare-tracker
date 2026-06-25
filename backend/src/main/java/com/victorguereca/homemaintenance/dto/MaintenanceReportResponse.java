package com.victorguereca.homemaintenance.dto;

import com.victorguereca.homemaintenance.report.MaintenanceReport;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class MaintenanceReportResponse {

    private final String title;
    private final LocalDateTime generatedAt;
    private final List<String> columns;
    private final List<Map<String, String>> rows;

    public MaintenanceReportResponse(MaintenanceReport report) {
        this.title = report.getTitle();
        this.generatedAt = report.getGeneratedAt();
        this.columns = report.getColumns();
        this.rows = report.getRows();
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public List<String> getColumns() {
        return columns;
    }

    public List<Map<String, String>> getRows() {
        return rows;
    }
}