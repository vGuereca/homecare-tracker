import { apiRequest, clearAuthToken, setAuthToken } from './apiClient';

const AUTH_USER_KEY = 'homecare_auth_user';

export async function registerUser(registerData) {
    const authResponse = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(registerData),
    });

    saveAuthResponse(authResponse);
    return authResponse;
}

export async function loginUser(loginData) {
    const authResponse = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
    });

    saveAuthResponse(authResponse);
    return authResponse;
}

export function saveAuthResponse(authResponse) {
    if (authResponse.token) {
        setAuthToken(authResponse.token);
    }

    const user = {
        userId: authResponse.userId,
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        email: authResponse.email,
        role: authResponse.role,
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    return user;
}

export function getCurrentUser() {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch {
        localStorage.removeItem(AUTH_USER_KEY);
        clearAuthToken();
        return null;
    }
}

export function logoutUser() {
    localStorage.removeItem(AUTH_USER_KEY);
    clearAuthToken();
}