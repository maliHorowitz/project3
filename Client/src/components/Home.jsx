import { useUser } from './Client';
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Info from './Info';
import styles from '../Css/Home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faTasks, faImages, faInfoCircle, faSignOutAlt, faUsers, faHome } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    const navigate = useNavigate()
    const currentUser = useUser();
    currentUser.current = currentUser.current ? currentUser.current : JSON.parse(localStorage.getItem('currentUser'));
    
    useEffect(() => {
        if (!currentUser.current) {
            navigate('/404', { state: { error: 'Please login to access this page' } });
            return;
        }
    }, []);

    const [showInfo, setShowInfo] = useState(false);
    const logOut = () => {
        localStorage.setItem('currentUser', null);
        
        navigate('/login', { replace: true });
    }

    if (!currentUser.current) {
        return null;
    }

    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <div className={styles.logoSection}>
                    <FontAwesomeIcon icon={faUsers} className={styles.logo} />
                    <span className={styles.logoText}>Social Hours</span>
                </div>
                <div className={styles.navLinks}>
                    <Link to={`/users/${currentUser.current.name}/posts`} className={styles.navLink}>
                        <FontAwesomeIcon icon={faNewspaper} />
                        Posts
                    </Link>
                    <Link to={`/users/${currentUser.current.name}/todos`} className={styles.navLink}>
                        <FontAwesomeIcon icon={faTasks} />
                        Todos
                    </Link>
                    {/* <Link to={`/users/${currentUser.current.name}/albums`} className={styles.navLink}>
                        <FontAwesomeIcon icon={faImages} />
                        Albums
                    </Link> */}
                    <button onClick={() => setShowInfo(true)} className={styles.navLink}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Info
                    </button>
                    <button onClick={logOut} className={styles.logoutButton}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Logout
                    </button>
                </div>
            </nav>
            <div className={styles.content}>hi, {currentUser.current.name}!</div>
            {showInfo && <Info setShowInfo={setShowInfo} />}
            <Outlet />
        </div>
    );
};

export default Home;
