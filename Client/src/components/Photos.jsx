import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Fetch from "../Fetch";
import { useUser } from './Client';
import styles from '../Css/Photos.module.css';

const Photos = () => {
    const { albumId } = useParams(); 
    const [photos, setPhotos] = useState([]);  
    const [displayedPhotos, setDisplayedPhotos] = useState([]); 
    const [page, setPage] = useState(1);  
    const [newPhoto, setNewPhoto] = useState(null);  
    const [totalPhotosCount, setTotalPhotosCount] = useState(0); 
    const [editTitle, setEditTitle] = useState({ isEdit: false, value: "" }); 
    const [currentPhotoId, setCurrentPhotoId] = useState(null); 
    const currentUser = useUser();
    currentUser.current = currentUser.current ? currentUser.current : JSON.parse(localStorage.getItem('currentUser'));

    let ApiRequest = new Fetch();

    useEffect(() => {
        const fetchPhotos = async () => {
            let myUrl = `photos?albumId=${albumId}&_limit=10&_start=${(page - 1) * 10}`; 
            let response = await ApiRequest.get(myUrl);
            setPhotos(response);
            if (page === 1) {
                setDisplayedPhotos(response); 
            } else {
                setDisplayedPhotos(prev => [...prev, ...response]);  
            }
        };

        const fetchTotalPhotosCount = async () => {
            let response = await ApiRequest.get(`photos?albumId=${albumId}`);  
            setTotalPhotosCount(response.length); 
        };

        fetchPhotos();
        fetchTotalPhotosCount();
    }, [albumId, page]);

    const loadMorePhotos = () => {
        const nextPage = page + 1;
        setPage(nextPage);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const newPhotoData = {
                albumId: albumId,
                title: file.name,
                url: URL.createObjectURL(file),
                thumbnailUrl: URL.createObjectURL(file)
            };
            setNewPhoto(newPhotoData); 
        }
    };

    const handleUpload = async () => {
        if (newPhoto) {
            const response = await ApiRequest.post('photos', newPhoto); 
            if (response) {
                setPhotos([...photos, response]);  
                setDisplayedPhotos([...displayedPhotos, response]); 
            } else {
                throw new Error("an error occured");
            }
        }
    };

    const handleDeletePhoto = async (id) => {
        const myUrl = `photos/${id}`;
        const response = await ApiRequest.delete(myUrl); 
        if (response === 'Resource deleted successfully') {
            setPhotos(photos.filter(photo => photo.id !== id)); 
            setDisplayedPhotos(displayedPhotos.filter(photo => photo.id !== id));  
        } else {
            throw new Error("Error deleting photo");
        }
    };

    const handleEditTitle = (id, currentTitle) => {
        setEditTitle({ isEdit: true, value: currentTitle }); 
        setCurrentPhotoId(id); 
    };

    const saveTitleDetails = async () => {
        const updatedPhoto = { ...photos.find(photo => photo.id === currentPhotoId), title: editTitle.value };
        const myUrl = `photos/${currentPhotoId}`;
        const response = await ApiRequest.put(myUrl, updatedPhoto);
        if (response) {
            setPhotos(photos.map(photo => (photo.id === currentPhotoId ? updatedPhoto : photo)));  // עדכון שם התמונה במסך
            setDisplayedPhotos(displayedPhotos.map(photo => (photo.id === currentPhotoId ? updatedPhoto : photo)));  // עדכון שם התמונה במסך המוצג
            setEditTitle({ isEdit: false, value: "" });  // סגירת מצב העריכה
            setCurrentPhotoId(null);  // ביטול ה-ID של התמונה המתקנת
        } else {
            throw new Error("Error updating photo title");
        }
    };

    return (
        <div className={styles.container}>
            <Link to={`/users/${currentUser.current.name}/albums`} className={styles.backLink}>Albums</Link>
            <div className={styles.photosGrid}>
                {displayedPhotos.map(photo => (
                    <div key={photo.id} className={styles.photoCard}>
                        <img src={photo.thumbnailUrl} alt={photo.title} className={styles.photoImage}/>
                        <p className={styles.photoTitle}>{photo.title}</p>
                        <div>
                            <button onClick={() => handleDeletePhoto(photo.id)} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
                            <button onClick={() => handleEditTitle(photo.id, photo.title)} className={styles.button}>Edit Title</button>
                            {editTitle.isEdit && currentPhotoId === photo.id && (
                                <div>
                                    <input
                                        type="text"
                                        value={editTitle.value}
                                        onChange={(e) => setEditTitle({ ...editTitle, value: e.target.value })}
                                        className={styles.input}
                                    />
                                    <button onClick={saveTitleDetails} className={styles.button}>Save</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {displayedPhotos.length < totalPhotosCount && (
                <button onClick={loadMorePhotos} className={styles.loadMoreButton}>More photos</button>
            )}

            <div className={styles.uploadSection}>
                <input type="file" onChange={handleFileChange} className={styles.fileInput} />
                {newPhoto && (
                    <div>
                        <p className={styles.photoTitle}>{newPhoto.title}</p>
                        <button onClick={handleUpload} className={styles.button}>Upload Photo</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Photos;
