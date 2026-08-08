package com.victorguereca.homemaintenance.controller;

import com.victorguereca.homemaintenance.auth.LoginRequest;
import com.victorguereca.homemaintenance.auth.RegisterRequest;
import com.victorguereca.homemaintenance.user.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        appUserRepository.deleteAll();
    }

    @Test
    void registerCreatesUserAndReturnsCreatedStatus() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Victor");
        request.setLastName("Guereca");
        request.setEmail("victor@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userId").exists())
                .andExpect(jsonPath("$.firstName").value("Victor"))
                .andExpect(jsonPath("$.lastName").value("Guereca"))
                .andExpect(jsonPath("$.email").value("victor@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.token").isNotEmpty());

        var savedUser = appUserRepository.findByEmailIgnoreCase("victor@example.com")
                .orElseThrow();

        assert passwordEncoder.matches("password123", savedUser.getPasswordHash());
    }

    @Test
    void registerReturnsBadRequestWhenEmailAlreadyExists() throws Exception {
        RegisterRequest firstRequest = new RegisterRequest();
        firstRequest.setFirstName("Victor");
        firstRequest.setLastName("Guereca");
        firstRequest.setEmail("duplicate@example.com");
        firstRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstRequest)))
                .andExpect(status().isCreated());

        RegisterRequest duplicateRequest = new RegisterRequest();
        duplicateRequest.setFirstName("Another");
        duplicateRequest.setLastName("User");
        duplicateRequest.setEmail("duplicate@example.com");
        duplicateRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registerReturnsBadRequestWhenPasswordIsTooShort() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Victor");
        request.setLastName("Guereca");
        request.setEmail("shortpassword@example.com");
        request.setPassword("short");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginReturnsUserWhenCredentialsAreValid() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("Victor");
        registerRequest.setLastName("Guereca");
        registerRequest.setEmail("login@example.com");
        registerRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").exists())
                .andExpect(jsonPath("$.firstName").value("Victor"))
                .andExpect(jsonPath("$.lastName").value("Guereca"))
                .andExpect(jsonPath("$.email").value("login@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void loginReturnsBadRequestWhenPasswordIsWrong() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setFirstName("Victor");
        registerRequest.setLastName("Guereca");
        registerRequest.setEmail("wrongpassword@example.com");
        registerRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("wrongpassword@example.com");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginReturnsBadRequestWhenEmailDoesNotExist() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("missing@example.com");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest());
    }
}