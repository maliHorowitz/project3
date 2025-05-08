import React, { useState, useEffect } from "react";
import { useUser, usePost } from './Client';
import Fetch from "../Fetch";
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../Css/AllPosts.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const AllPosts = () => {
    const currentPost = usePost();
    const [posts, setPosts] = useState([]);
    const [openPost, setOpenPost] = useState({ isOpen: false, post: null });
    const [addadPost, setAddadPost] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchId, setSearchId] = useState('');
    const [searchOwnPosts, setSearchOwnPosts] = useState(false); 
    const navigate = useNavigate();
    const { username } = useParams();
    const currentUser = useUser();
    currentUser.current = currentUser.current ? currentUser.current : JSON.parse(localStorage.getItem('currentUser'));
    let ApiRequest = new Fetch();

    useEffect(() => {
        if (username !== currentUser.current?.name) {
            navigate('/404', { replace: true });
        }
    }, [username, currentUser]);

    useEffect(() => {
        const fetchPosts = async () => {
            let myUrl = `posts`;
            let response = await ApiRequest.get(myUrl);
            setPosts(response);
        };
        fetchPosts();
    }, []);

    const addPostToDB = async (myInputs) => {
        const myTitle = myInputs[0].value;
        const myBody = myInputs[1].value;
        let postDetails = { userId: currentUser.current.id, title: myTitle, body: myBody };
        let myUrl = `posts/`;
        let response = await ApiRequest.post(myUrl, postDetails);
        if (response) {
            setPosts([...posts, response]);
        } else {
            throw new Error("an error occurred");
        }
    };

    const addPost = () => {
        return (
            <div className={styles.addPostForm}>
                <input type="text" placeholder="Add title" className={styles.addPostInput} />
                <input type="text" placeholder="Add body" className={styles.addPostInput} />
                <button 
                    className={styles.addButton}
                    onClick={(event) => {
                        addPostToDB(event.target.parentElement.childNodes);
                        event.target.parentElement.childNodes[0].value='';
                        event.target.parentElement.childNodes[1].value='';
                        setAddadPost(false)
                    }}
                >
                    <FontAwesomeIcon icon={faPlus} /> Add
                </button>
            </div>
        );
    };

    const displayAllPosts = (post) => {
        const { userId, body, ...rest } = post;
        return (
            <div key={post.id} className={styles.postItem}>
                <div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postId}>#{post.id}</p>
                </div>
                <div className={styles.postActions}>
                    <button 
                        className={styles.openButton}
                        onClick={() => {
                            setOpenPost({ isOpen: true, post: post });
                            currentPost.current = { post: post, isMyPost: post.userId == currentUser.current.id };
                        }}
                    >
                        <FontAwesomeIcon icon={faExternalLinkAlt} /> Open
                    </button>
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (openPost.isOpen) {
            navigate(`/users/${currentUser.current.name}/posts/${openPost.post.id}`);
        }
    }, [openPost, currentUser, navigate]);


    const filteredPosts = posts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(searchValue.toLowerCase());
        const idMatch = post.id.toString().includes(searchId);
        const ownPostMatch = !searchOwnPosts || post.userId === currentUser.current.id; 
        return titleMatch && idMatch && ownPostMatch;
    });

    return (
        <>
            <Link to={`/home`} className={styles.homeLink}>
                <FontAwesomeIcon icon={faHome} />
            </Link>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search by title"
                    className={styles.searchInput}
                />
                <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Search by ID"
                    className={styles.searchInput}
                />
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={searchOwnPosts}
                        onChange={(e) => setSearchOwnPosts(e.target.checked)}
                    />
                    Show only my posts
                </label>
            </div>

            {!openPost.isOpen && (
                <>
                    <div className={styles.postsContainer}>
                        {filteredPosts.map((post) => displayAllPosts(post))}
                    </div>
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        {!addadPost ? (
                            <button className={styles.addButton} onClick={() => setAddadPost(true)}>
                                <FontAwesomeIcon icon={faPlus} /> Add a new post
                            </button>
                        ) : (
                            addPost()
                        )}
                    </div>
                </>
            )}
        </>
    );
};

export default AllPosts;
