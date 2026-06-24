package com.victorguereca.homemaintenance.dto;

import java.math.BigDecimal;

//Defines JSON shape returned by dashboard endpoint

public class DashboardSummaryResponse {

    private long openTasks;
    private long completedTasks;
    private long overdueTasks;
    private BigDecimal totalEstimatedOpenCost;

    public DashboardSummaryResponse(long openTasks,
                                    long completedTasks,
                                    long overdueTasks,
                                    BigDecimal totalEstimatedOpenCost) {
        this.openTasks = openTasks;
        this.completedTasks = completedTasks;
        this.overdueTasks = overdueTasks;
        this.totalEstimatedOpenCost = totalEstimatedOpenCost;
    }

    public long getOpenTasks() {
        return openTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public long getOverdueTasks() {
        return overdueTasks;
    }

    public BigDecimal getTotalEstimatedOpenCost() {
        return totalEstimatedOpenCost;
    }
}