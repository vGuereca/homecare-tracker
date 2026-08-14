const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:8080' : '');

export function getAuthToken() {
    return localStorage.getItem('homecare_auth_token');
}

export function setAuthToken(token) {
    localStorage.setItem('homecare_auth_token', token);
}

export function clearAuthToken() {
    localStorage.removeItem('homecare_auth_token');
}

export async function apiRequest(path, options = {}) {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let message = `Request failed with status ${response.status}`;

        try {
            const errorBody = await response.json();

            if (errorBody.messages && errorBody.messages.length > 0) {
                message = errorBody.messages.join(', ');
            } else if (errorBody.message) {
                message = errorBody.message;
            } else if (errorBody.error) {
                message = errorBody.error;
            }
        } catch {
            // Keep default message when response body is not JSON.
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}