import { useEffect, useState } from 'react';
import { useUser } from './Client';
import React from 'react';
import Fetch from '../Fetch';

const Info = (props) => {
    let ApiRequest = new Fetch();
    const currentUser = useUser();
    const [userInfo, setUserInfo] = useState(null); // state לאחסון פרטי המשתמש
    const [loading, setLoading] = useState(true);   // state למעקב אחרי מצב הטעינה
    const [error, setError] = useState(null);       // state לשמירת שגיאות

    const getInfoOfUser = async () => {
        try {
            let myUrl = `users?username=${currentUser.current.name}`;
            let response = await ApiRequest.get(myUrl);
            if (response && response.length > 0) {
                setUserInfo(response[0]); // שומר את המשתמש הראשון שהוחזר
            } else {
                setError('User not found');
            }
        } catch (error) {
            setError('Failed to fetch user info');
        } finally {
            setLoading(false); // מסיים את מצב הטעינה
        }
    };

    useEffect(() => {
        getInfoOfUser(); // קריאה לפונקציה בעת טעינת הקומפוננטה
    }, []);

    if (loading) {
        return <p>Loading...</p>; // הצגת הודעת טעינה
    }

    if (error) {
        return <p>{error}</p>; // הצגת הודעת שגיאה
    }

    const renderUserInfo = (userInfo) => {
        const { website,id, ...restOfUserInfo } = userInfo;
    
        return (
            <div>
                {Object.keys(restOfUserInfo).map((key) => {
                    const value = restOfUserInfo[key];
                    
                    if (typeof value === 'object' && value !== null) {
                        return (
                            <div key={key}>
                                <strong>{key}:</strong>
                                <div style={{ paddingLeft: '1rem' }}>
                                    {Object.keys(value).map((subKey) => (
                                        <div key={subKey}>
                                            <strong>{subKey}:</strong> {JSON.stringify(value[subKey])}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    }
    
                    // הדפסה רגילה עבור ערכים שאינם אובייקטים
                    return (
                        <div key={key}>
                            <strong>{key}:</strong> {value}
                        </div>
                    );
                })}
            </div>
        );
    };
    


    return (
       <> <div>
            <h2>User Info</h2>
            {userInfo && renderUserInfo(userInfo)}
        </div>
        <button onClick={()=>{props.setShowInfo(false)}}>close</button>
        </>
    );
};

export default Info;
