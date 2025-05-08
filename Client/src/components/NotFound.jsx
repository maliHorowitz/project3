import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const errorMessage = location.state?.error;

    const goBackHomeOrLOgin = () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');  
        } else {
            navigate('/home');
        }
    };

    return (
        <>
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <h1>404 - Page Not Found</h1>
                {errorMessage && (
                    <p style={{ color: 'red', marginBottom: '20px' }}>
                        Error: {errorMessage}
                    </p>
                )}
                <button onClick={goBackHomeOrLOgin}>Go Back</button> 
            </div>
        </>
    );
};

export default NotFound;
