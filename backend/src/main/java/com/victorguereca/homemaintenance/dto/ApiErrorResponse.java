package com.victorguereca.homemaintenance.dto;

import java.time.LocalDateTime;
import java.util.List;

//this will give a consistent error format for frontend

public class ApiErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private List<String> messages;

    public ApiErrorResponse(int status, String error, List<String> messages) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.messages = messages;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public List<String> getMessages() {
        return messages;
    }
}
