import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate(); // Initialize useNavigate

    return (
        <div className="landing-box">
            <h1>Decentralized Identity Verification system</h1>
            <button className="button-primary" onClick={() => navigate('/login/admin')}>Login as Admin</button>
            <button className="button-primary" onClick={() => navigate('/login')}>Login as User</button>
            <button className="button-primary" onClick={() => navigate('/company-portal')}>Login to Company Portal</button>
        </div>
    );
}

export default LandingPage;
