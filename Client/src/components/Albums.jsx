import React, { useState, useEffect } from "react";
import Fetch from "../Fetch";
import { useUser } from './Client';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import styles from '../Css/Albums.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Albums = () => {
    let ApiRequest = new Fetch();

    const [albums, setAlbums] = useState([]);
    const [albumTitle, setAlbumTitle] = useState(""); 
    const [searchTitle, setSearchTitle] = useState("");  
    const [searchId, setSearchId] = useState(""); 
    const currentUser = useUser();
    const { username } = useParams();
    const navigate = useNavigate();
    currentUser.current = currentUser.current ? currentUser.current : JSON.parse(localStorage.getItem('currentUser'));


    useEffect(() => {
        if (username !== currentUser.current?.name) {
            navigate('/404', { replace: true });
        }
    }, [username, currentUser]);

    useEffect(() => {
        const fetchAlbums = async () => {
            let myUrl = `albums?userId=${currentUser.current.id}`;
            let response = await ApiRequest.get(myUrl);
            setAlbums(response);
        };
        fetchAlbums();
    }, []);

    const addAlbumToDB = async () => {
        const newAlbum = { userId: currentUser.current.id, title: albumTitle };
        let myUrl = `albums/`;
        let response = await ApiRequest.post(myUrl, newAlbum);
        if (response) {
            setAlbums([...albums, response]);
            setAlbumTitle("");
        } else {
            throw new Error("an error occured");
        }
    };

    const filteredAlbums = albums.filter(album => {
        const titleMatch = album.title.toLowerCase().includes(searchTitle.toLowerCase());
        const idMatch = album.id.toString().includes(searchId);
        return titleMatch && idMatch;
    });

    return (
        <div className={styles.container}>
            <Link to={`/home`} className={styles.homeLink}>
                <FontAwesomeIcon icon={faHome} />
            </Link>

            <div className={styles.searchContainer}>
                <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
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
            </div>

            <div className={styles.albumsGrid}>
                {filteredAlbums.map(album => (
                    <div key={album.id} className={styles.albumCard}>
                        <div>
                            <p className={styles.albumId}>#{album.id}</p>
                            <Link to={`/users/${currentUser.current.name}/albums/${album.id}`} className={styles.albumTitle}>
                                {album.title}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.addAlbumContainer}>
                <input
                    type="text"
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    placeholder="Album name"
                    className={styles.searchInput}
                />
                <button 
                    onClick={addAlbumToDB}
                    disabled={!albumTitle.trim()}
                    className={styles.addButton}
                >
                    Create a new album
                </button>
            </div>
        </div>
    );
};

export default Albums;
