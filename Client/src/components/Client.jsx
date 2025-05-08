import React, { createContext, useContext, useState, useRef } from 'react';
import Login from './Login'
import SignUp from './SignUp'
import Home from './Home'
import Todos from './Todos'
import AllPosts from './AllPosts';
import Albums from './Albums';
import Photos from './Photos';
import NotFound from './NotFound';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Post from './Post';

const UserContext = createContext(null);
const PostContext = createContext(null);


const Client = () => {
    const [signUp, setSignUp] = useState(false);
    const userDetails = useRef({});
    const currentUser = useRef();
    const currentPost = useRef();

    const handleSignUp = (value, userDet) => {
        handleUserDetails(userDet);
        setSignUp(value);
    }
    const handleUserDetails = (value) => {
        userDetails.current = {
            ...userDetails.current,
            value
        };
    }
    return (
        <UserContext.Provider value={currentUser}>
            <PostContext.Provider value={currentPost}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<SignUp signedUp={signUp} finishedSignUp={handleSignUp} userDetails={userDetails} />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/users/:username/todos" element={<Todos />} />
                        <Route path="/users/:username/posts" element={<AllPosts />} />
                        <Route path="/users/:username/posts/:id" element={<Post />} />
                        <Route path="/users/:username/albums" element={<Albums />} />
                        <Route path="/users/:username/albums/:albumId" element={<Photos />} />
                        <Route path="*" element={<NotFound />} />

                    </Routes>
                </Router>
            </PostContext.Provider>
        </UserContext.Provider>

    )
}
export const useUser = () => useContext(UserContext);  
export const usePost = () => useContext(PostContext); 

export default Client