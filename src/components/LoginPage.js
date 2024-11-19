import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ role }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Dummy authentication logic based on role
        if ((username === 'admin' && password === 'adminpass' && role === 'admin') || 
            (username === 'user' && password === 'userpass' && role === 'user')) {
            alert('Login successful!');
            // Navigate to different pages based on role
            navigate(role === 'admin' ? '/admin' : '/user-request');
        } else {
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-box">
            <h2>{role === 'admin' ? 'Admin Login' : 'User Login'}</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="button-primary">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
