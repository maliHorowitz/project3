import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from './Client';
import Fetch from "../Fetch";
import styles from '../Css/Login.module.css';

const Login = () => {
    const [showSignUpLink, setShowSignUpLink] = useState(false);
    const [userDetails, setUserDetails] = useState({ username: "", website: "" });
    const navigate = useNavigate();
    const currentUser = useUser();
    let ApiRequest = new Fetch();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, website } = userDetails;

        try {
            let response = await checkIfUserInDB(username, website);
            if (response.length) {
                const user = response[0];
                currentUser.current = { name: user.username, id: user.id };
                localStorage.setItem('currentUser', JSON.stringify(currentUser.current));
                navigate("/home");
            } else {
                setShowSignUpLink(true);
            }
        } catch (error) {
            navigate('/404', { state: { error: 'Failed to login' } });
        }
    };

    const checkIfUserInDB = async (username, website) => {
        let myUrl = `users?username=${username}&website=${website}`;
        let response = await ApiRequest.get(myUrl);
        return response;
    };

    return (
        <div className={styles.container}>
            {showSignUpLink && (
                <div>
                    <p>Go to <Link to="/register">Sign Up</Link></p>
                </div>
            )}
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Welcome to <span>Social</span></h2>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={userDetails.username}
                        onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })}
                        className={styles.input}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={userDetails.website}
                        onChange={(e) => setUserDetails({ ...userDetails, website: e.target.value })}
                        className={styles.input}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className={styles.button}
                >
                    Login
                </button>
                <div className={styles.formFooter}>
                    Don't have an account? <Link to="/register">Sign up here</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
