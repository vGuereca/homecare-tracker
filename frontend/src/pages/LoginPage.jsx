import { useState } from 'react';
import { loginUser } from '../services/authService';

export default function LoginPage({ onLogin, onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            const authResponse = await loginUser(formData);
            onLogin(authResponse);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <h1>Log in to HomeCare Tracker</h1>
                <p>Access your personal maintenance dashboard.</p>

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <button type="button" className="link-button" onClick={onSwitchToRegister}>
                    Need an account? Register
                </button>
            </section>
        </main>
    );
}