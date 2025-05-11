import React, { useState } from "react";
import Fetch from "../Fetch";
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from './Client';
import styles from '../Css/Signup.module.css';

const SignUp = () => {
    const [showLoginLink, setShowLoginLink] = useState(false);
    const [verification, setVerification] = useState(true);
    const [userDetailsState, setUserDetailsState] = useState({
        username: "",
        password: "",
        verifyPassword: "",
        email: "",
        phone: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const currentUser = useUser();
    let ApiRequest = new Fetch();

    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     const { username, password, verifyPassword } = userDetailsState;
    //     try {
    //         let answer = await checkIfUserInDB(username);
    //         if (!answer.length) {
    //             // User was not found, proceed to signup
    //             if (password === verifyPassword) {
    //                 setIsSubmitted(true);
    //                 setVerification(true);
    //             } else {
    //                 setVerification(false);
    //             }
    //         } else {
    //             // User was found, show login link
    //             setShowLoginLink(true);
    //         }
    //     } catch (error) {
    //         console.log(error.message);
    //         navigate('/404', { state: { error: 'Failed to check if user exists' } });
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { username, password, verifyPassword } = userDetailsState;
        try {
            let answer = await checkIfUserInDB(username);
            console.log(answer);
            if (answer.length) {
                console.log(answer);
                setShowLoginLink(true);
            } else {
                if (password === verifyPassword) {
                    setIsSubmitted(true);
                    setVerification(true);
                } else {
                    setVerification(false);
                }
            }
        } catch (error) {
            console.log(error.message);
            navigate('/404', { state: { error: 'Failed to check if user exists' } });
        }
    };


    const checkIfUserInDB = async (user) => {
        let myUrl = `users?username=${user}`;
        let response = await ApiRequest.get(myUrl);
        return response;
    };

    const setDetailsInDB = async (event) => {
        event.preventDefault();
        const { username, password, email, phone } = userDetailsState;
        const userDet = {
            username,
            password,
            email,
            phone
        };

        let myUrl = `users/`;
        try {
            let response = await ApiRequest.post(myUrl, userDet);
            if (response) {
                console.log(response);
                const { username, id } = response;
                currentUser.current = { name: username, id: id, email: email };
                localStorage.setItem('currentUser', JSON.stringify(currentUser.current));
                navigate("/home");
            }
        } catch (error) {
            setError('Failed to register');

            //navigate('/404', { state: { error: 'Failed to save user details' } });
        }

        setUserDetailsState({
            username: "",
            password: "",
            verifyPassword: "",
            email: "",
            phone: "",
        });
    };

    return (
        <div className={styles.container}>
            {!isSubmitted ? (
                <form className={styles.signupForm} onSubmit={handleSubmit}>
                    {showLoginLink && (
                        <div>
                            <p>Go to <Link to="/login">Login</Link></p>
                        </div>
                    )}
                    {!verification && (
                        <div>
                            <p>Please sign up again, passwords do not match.</p>
                        </div>
                    )}
                    <h2 className={styles.title}>Create Your <span>Account</span></h2>

                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Username:</label>
                            <input
                                type="text"
                                value={userDetailsState.username}
                                onChange={(e) => setUserDetailsState({ ...userDetailsState, username: e.target.value })}
                                className={styles.input}
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Password:</label>
                            <input
                                type="password"
                                value={userDetailsState.password}
                                onChange={(e) => setUserDetailsState({ ...userDetailsState, password: e.target.value })}
                                className={styles.input}
                                placeholder="Create a password"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Verify Password:</label>
                            <input
                                type="password"
                                value={userDetailsState.verifyPassword}
                                onChange={(e) => setUserDetailsState({ ...userDetailsState, verifyPassword: e.target.value })}
                                className={styles.input}
                                placeholder="Verify password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                    >
                        Submit
                    </button>
                    <div className={styles.formFooter}>
                        Already have an account? <Link to="/login">Login here</Link>
                    </div>
                    {error && <p className={styles.error}>{error}</p>}

                </form>
            ) : (
                <form className={styles.signupForm} onSubmit={setDetailsInDB}>
                    <h2 className={styles.title}>Create Your <span>Account</span></h2>

                    <div className={styles.grid}>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Email:</label>
                            <input
                                type="email"
                                value={userDetailsState.email}
                                onChange={(e) => setUserDetailsState({ ...userDetailsState, email: e.target.value })}
                                className={styles.input}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.grid}>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Phone:</label>
                            <input
                                type="text"
                                value={userDetailsState.phone}
                                onChange={(e) => setUserDetailsState({ ...userDetailsState, phone: e.target.value })}
                                className={styles.input}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                    >
                        Sign Up
                    </button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            )}
        </div>
    );
};

export default SignUp;
