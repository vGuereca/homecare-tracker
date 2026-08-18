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
            <section className="auth-layout">
                <div className="auth-intro-panel">
                    <span className="brand-mark auth-brand-mark">HC</span>

                    <p className="eyebrow">HomeCare Tracker</p>

                    <h1>Organize home maintenance before it becomes urgent.</h1>

                    <p className="hero-description">
                        Sign in to manage repair tasks, due dates, estimated costs, urgency levels,
                        and maintenance reports from a secure personal workspace.
                    </p>

                    <div className="auth-feature-list">
                        <div>
                            <strong>Private task data</strong>
                            <span>Tasks are tied to your account after login.</span>
                        </div>

                        <div>
                            <strong>Priority tracking</strong>
                            <span>See open, completed, overdue, and high-urgency work.</span>
                        </div>

                        <div>
                            <strong>Maintenance reports</strong>
                            <span>Review task history and estimated cost data.</span>
                        </div>
                    </div>
                </div>

                <section className="auth-card">
                    <div className="auth-card-header">
                        <p className="eyebrow">Welcome back</p>
                        <h2>Log in</h2>
                        <p>Access your personal maintenance dashboard.</p>
                    </div>

                    {errorMessage && (
                        <div className="alert error-message">
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
                                placeholder="you@example.com"
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
                                placeholder="Enter your password"
                                required
                            />
                        </label>

                        <button type="submit" disabled={isSubmitting} className="full-width-button">
                            {isSubmitting ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <div className="auth-switch-panel">
                        <span>Need an account?</span>
                        <button type="button" className="link-button" onClick={onSwitchToRegister}>
                            Create one
                        </button>
                    </div>
                </section>
            </section>
        </main>
    );
}