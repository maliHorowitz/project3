import React, { useState } from "react";
import Fetch from "../Fetch";
import { useUser, usePost } from './Client';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from '../Css/Post.module.css';

const Post = () => {
    const navigate = useNavigate();
    const currentUser = useUser();
    currentUser.current = currentUser.current || JSON.parse(localStorage.getItem('currentUser'));
    const props = usePost();
    const currentPost = props.current.post;
    const isMyPost = props.current.isMyPost;
    const ApiRequest = new Fetch();
    const [edited, setEdited] = useState(false);
    const [editTitle, setEditTitle] = useState({ isEdit: false, value: null });
    const [editBody, setEditBody] = useState({ isEdit: false, value: null });
    const [viewComments, setViewComments] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentsState, setCommentsState] = useState([]);
    const [commentIndex, setCommentIndex] = useState(null);
    const [saveCom, setsaveCom] = useState(false);

    const deletePost = async () => {
        const myUrl = `posts/${currentPost.id}`;
        const response = await ApiRequest.delete(myUrl);
        if (response === 'Resource deleted successfully') {
            navigate(`/users/${currentUser.current.name}/posts/`);
        }
    };

    const displayComments = async () => {
        setLoadingComments(true);
        const myUrl = `comments?postId=${currentPost.id}`;
        const response = await ApiRequest.get(myUrl);
        if (response) setCommentsState(response);
        setLoadingComments(false);
    };

    const handleViewComments = async () => {
        setViewComments(true);
        await displayComments();
    };

    const saveTitleDetails = async () => {
        currentPost.title = editTitle.value;
        const myUrl = `posts/${currentPost.id}`;
        const response = await ApiRequest.put(myUrl, currentPost);
        if (response) {
            setEditTitle({ isEdit: false, value: editTitle.value });
            props.current.post.title = editTitle.value;
        }
    };

    const saveBodyDetails = async () => {
        currentPost.body = editBody.value;
        const myUrl = `posts/${currentPost.id}`;
        const response = await ApiRequest.put(myUrl, currentPost);
        if (response) {
            setEditBody({ isEdit: false, value: editBody.value });
            props.current.post.body = editBody.value;
        }
    };

    const addComments = async () => {
        const commentDetails = { postId: currentPost.id, body: commentText, email: currentUser.current.email };
        const myUrl = `comments/`;
        const response = await ApiRequest.post(myUrl, commentDetails);
        if (response) {
            setCommentsState([...commentsState, response]);
            setCommentText("");
        }
    };

    const saveComment = async (commentId, updatedBody) => {
        const myUrl = `comments/${commentId}`;
        const commentDetails = { id: commentId, postId: currentPost.id, body: updatedBody, email: currentUser.current.email };
        const response = await ApiRequest.put(myUrl, commentDetails);
        if (response) {
            const updatedComments = commentsState.map(comment =>
                comment.id === commentId ? { ...comment, body: updatedBody } : comment
            );
            setsaveCom(false);
            setCommentsState(updatedComments);
            setCommentIndex(null);
            setCommentText('');
        }
    };

    const deleteComment = async (commentId) => {
        const myUrl = `comments/${commentId}`;
        const response = await ApiRequest.delete(myUrl);
        if (response === 'Resource deleted successfully') {
            setCommentsState(commentsState.filter(comment => comment.id !== commentId));
            setViewComments(true);
        }
    };

    return (
        <div className={styles.container}>
            <Link to={`/users/${currentUser.current.name}/posts`} className={styles.backLink}>Back</Link>
            <p className={styles.postId}>#{currentPost.id}</p>
            {editTitle.isEdit ? (
                <input 
                    type="text" 
                    value={editTitle.value} 
                    onChange={(e) => setEditTitle({ ...editTitle, value: e.target.value })}
                    className={styles.input}
                />
            ) : (
                <h1 className={styles.postTitle}>{currentPost.title}</h1>
            )}
            {editBody.isEdit ? (
                <input 
                    type="text" 
                    value={editBody.value} 
                    onChange={(e) => setEditBody({ ...editBody, value: e.target.value })}
                    className={styles.input}
                />
            ) : (
                <p className={styles.postBody}>{currentPost.body}</p>
            )}
            {isMyPost && <button onClick={() => setEdited(true)} className={styles.button}>Edit</button>}
            <button onClick={handleViewComments} className={styles.button}>View all comments</button>

            <div>
                <textarea 
                    value={commentText} 
                    onChange={(e) => setCommentText(e.target.value)} 
                    placeholder="Enter your comment..." 
                    className={styles.textarea}
                />
                <button 
                    onClick={addComments} 
                    disabled={!commentText.trim()}
                    className={styles.button}
                >
                    Add Comment
                </button>
            </div>

            {viewComments && (
                <div className={styles.commentsSection}>
                    <button onClick={() => setViewComments(false)} className={styles.button}>Close comments</button>
                    {loadingComments ? (
                        <p className={styles.loadingText}>Loading comments...</p>
                    ) : (
                        <div>
                            <h2>Comments:</h2>
                            <ul className={styles.commentsList}>
                                {commentsState.map((comment) => (
                                    <li key={comment.id} className={styles.commentItem}>
                                        <p className={styles.postId}><strong>#</strong> {comment.id}</p>
                                        <p className={styles.commentEmail}><strong>E-mail:</strong> {comment.email}</p>
                                        {comment.email === currentUser.current.email && (
                                            <div>
                                                <button 
                                                    onClick={() => {
                                                        setCommentIndex(comment.id);
                                                        setCommentText(comment.body);
                                                        setsaveCom(true);
                                                        setViewComments(true);
                                                    }}
                                                    className={styles.button}
                                                >
                                                    Edit comment
                                                </button>
                                                <button 
                                                    onClick={() => deleteComment(comment.id)}
                                                    className={`${styles.button} ${styles.deleteButton}`}
                                                >
                                                    Delete comment
                                                </button>
                                            </div>
                                        )}
                                        {commentIndex === comment.id ? (
                                            <div>
                                                <textarea 
                                                    value={commentText} 
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    className={styles.textarea}
                                                />
                                                {saveCom && 
                                                    <button 
                                                        onClick={() => saveComment(comment.id, commentText)}
                                                        className={styles.button}
                                                    >
                                                        Save comment
                                                    </button>
                                                }
                                            </div>
                                        ) : (
                                            <p className={styles.commentBody}>{comment.body}</p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            {edited && (
                <div>
                    {editTitle.isEdit ? (
                        <div>
                            <button onClick={saveTitleDetails} className={styles.button}>Save</button>
                            <button onClick={() => setEditTitle({ isEdit: false, value: null })} className={styles.button}>Cancel</button>
                        </div>
                    ) : (
                        <button onClick={() => setEditTitle({ isEdit: true, value: currentPost.title })} className={styles.button}>Edit Title</button>
                    )}
                    {editBody.isEdit ? (
                        <div>
                            <button onClick={saveBodyDetails} className={styles.button}>Save</button>
                            <button onClick={() => setEditBody({ isEdit: false, value: null })} className={styles.button}>Cancel</button>
                        </div>
                    ) : (
                        <button onClick={() => setEditBody({ isEdit: true, value: currentPost.body })} className={styles.button}>Edit Body</button>
                    )}
                    <button onClick={deletePost} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default Post;
