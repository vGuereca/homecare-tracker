package com.victorguereca.homemaintenance.auth;

import com.victorguereca.homemaintenance.user.UserRole;

public class AuthResponse {

    private final Long userId;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final UserRole role;
    private final String token;

    public AuthResponse(Long userId,
                        String firstName,
                        String lastName,
                        String email,
                        UserRole role,
                        String token) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}

