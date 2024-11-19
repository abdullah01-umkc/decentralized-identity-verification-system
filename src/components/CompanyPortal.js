import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CompanyPortal() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Dummy check for successful login (you can replace with actual authentication logic)
        if (username  && password) {
            alert('Login successful!');
            navigate('/background-image');  // Navigate to the background image page
        } else {
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="company-portal">
            <h2>Company Portal</h2>
            <p>Enter your credentials to log in.</p>
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

export default CompanyPortal;
