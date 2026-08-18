import { useState } from 'react';
import { registerUser } from '../services/authService';

export default function RegisterPage({ onRegister, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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
            const authResponse = await registerUser(formData);
            onRegister(authResponse);
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

                    <h1>Start tracking the work your home needs.</h1>

                    <p className="hero-description">
                        Create an account to save maintenance tasks, organize repairs by urgency,
                        monitor estimated costs, and keep your home maintenance history in one place.
                    </p>

                    <div className="auth-feature-list">
                        <div>
                            <strong>Task ownership</strong>
                            <span>Your tasks are stored under your authenticated account.</span>
                        </div>

                        <div>
                            <strong>Dashboard visibility</strong>
                            <span>Track active, completed, overdue, and estimated-cost totals.</span>
                        </div>

                        <div>
                            <strong>Portfolio-grade architecture</strong>
                            <span>Built with React, Spring Boot, JWT auth, and PostgreSQL.</span>
                        </div>
                    </div>
                </div>

                <section className="auth-card">
                    <div className="auth-card-header">
                        <p className="eyebrow">Create account</p>
                        <h2>Register</h2>
                        <p>Set up your personal home maintenance workspace.</p>
                    </div>

                    {errorMessage && (
                        <div className="alert error-message">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-row">
                            <label>
                                First name
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First name"
                                    required
                                />
                            </label>

                            <label>
                                Last name
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last name"
                                    required
                                />
                            </label>
                        </div>

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
                                placeholder="Minimum 8 characters"
                                minLength="8"
                                required
                            />
                        </label>

                        <button type="submit" disabled={isSubmitting} className="full-width-button">
                            {isSubmitting ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <div className="auth-switch-panel">
                        <span>Already have an account?</span>
                        <button type="button" className="link-button" onClick={onSwitchToLogin}>
                            Log in
                        </button>
                    </div>
                </section>
            </section>
        </main>
    );
}