import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login
        console.log('Logging in with:', email, password);
        navigate('/home');
    };

    return (
        <div className="login-page">
            <div className="login-bg-overlay"></div>
            <div className="login-container">
                <div className="login-card glass-panel">
                    <div className="login-header">
                        <div className="login-logo-wrapper">
                            <img src="/login-logo.png" alt="She Shield Logo" className="login-logo" />
                        </div>
                        <h1 className="login-title">SheShield</h1>
                        <p className="login-subtitle">Empower. Protect. Thrive.</p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label className="input-label" htmlFor="email">
                                <User size={18} /> Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="input-field"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label" htmlFor="password">
                                <Lock size={18} /> Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="login-options">
                            <label className="remember-me">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" className="btn btn-primary login-submit">
                            Sign In <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Don't have an account? <a href="#" className="signup-link">Create Account</a></p>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="bg-decoration-1"></div>
            <div className="bg-decoration-2"></div>
        </div>
    );
};

export default Login;
