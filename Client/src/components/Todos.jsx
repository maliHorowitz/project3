import React, { useState, useEffect, useRef } from "react";
import { useUser } from './Client';
import Fetch from "../Fetch";
import styles from '../Css/Todos.module.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTimes, faTrash, faPlus, faSave, faHome } from '@fortawesome/free-solid-svg-icons';

const Todos = () => {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [checkboxes, setCheckboxes] = useState({});
    const [saveButton, setSaveButton] = useState({});
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [searchTitle, setSearchTitle] = useState('');
    const [searchId, setSearchId] = useState('');
    const [searchCompleted, setSearchCompleted] = useState('');
    const [showAddTask, setShowAddTask] = useState(false); // מצב של תצוגת תיבת הקלט
    const [inputTitle, setInputTitle] = useState(''); // שדה עבור כותרת המשימה
    const prevTitle = useRef('');
    let ApiRequest = new Fetch();
    const currentUser = useUser();
    currentUser.current = currentUser.current ? currentUser.current : JSON.parse(localStorage.getItem('currentUser'));
    const { username } = useParams();

    useEffect(() => {
        if (username !== currentUser.current?.name) {
            navigate('/404', { replace: true });
        }
    }, [username, currentUser]);

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                let myUrl = `todos`;
                console.log("im here", currentUser.current.id);
                let response = await ApiRequest.get(myUrl, {
                    headers: {
                        'userId': currentUser.current.id
                    }
                });
                let objComplete = {};
                let objSaveButtons = {};
                console.log(response, "responseTodos");
                response.forEach((todo) => {
                    objSaveButtons[todo.id] = false;
                    if (!todo.completed) objComplete[todo.id] = false;
                    else
                        objComplete[todo.id] = true;
                });
                setTodos(response);
                setCheckboxes(objComplete);
                setSaveButton(objSaveButtons);
            } catch (error) {
                navigate('/404', { state: { error: 'Failed to fetch todos' } });  // Sending error to NotFound page
            }
        };
        fetchTodos();
    }, []);

    const handleCheckboxChange = (event) => {
        const { id, checked } = event.target;
        setCheckboxes((prevState) => ({
            ...prevState,
            [id]: checked,
        }));
    };

    const saveDetailsInDB = async (todo) => {
        let inputVal = editingIndex === null ? todo.title : editedTitle;
        setEditingIndex(null);
        setSaveButton((prevState) => ({
            ...prevState,
            [todo.id]: false,
        }));
        let taskId = todo.id;
        let completed = checkboxes[todo.id];
        let taskDet = { id: taskId, title: inputVal, completed: completed, userId: currentUser.current.id };
        let myUrl = `todos/${todo.id}`
        try {
            let response = await ApiRequest.put(myUrl, taskDet);
            if (response) {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === taskId ? { ...response } : todo
                    )
                );
            }
        } catch (error) {
            navigate('/404', { state: { error: 'Failed to save todo details' } });  // Sending error to NotFound page
        }
    }

    const handleEditClick = (index, title) => {
        setEditingIndex(index);
        setEditedTitle(title);
        prevTitle.current = title;
    };

    const handleCancelClick = (index) => {
        todos[index].title = prevTitle.current;
        setEditingIndex(null);
    };

    const handleSaveButton = (id) => {
        setSaveButton((prevState) => ({
            ...prevState,
            [id]: true,
        }));
    }

    const filteredTodos = todos.filter(todo => {
        const titleMatch = todo.title.toLowerCase().includes(searchTitle.toLowerCase());
        const idMatch = todo.id.toString().includes(searchId);
        const completedMatch = searchCompleted === '' || todo.completed.toString() === searchCompleted;
        return titleMatch && idMatch && completedMatch;
    });

    const sortTodos = (criterion) => {
        switch (criterion) {
            case 'id':
                setTodos([...todos].sort((a, b) => {
                    if (typeof a.id === 'number' && typeof b.id === 'number') {
                        return a.id - b.id;
                    } else {
                        return a.id.localeCompare(b.id);
                    }
                }));
                break;
            case 'alphabetical':
                setTodos([...todos].sort((a, b) => a.title.localeCompare(b.title)));
                break;
            case 'completed':
                setTodos([...todos].sort((a, b) => a.completed - b.completed));
                break;
            case 'random':
                setTodos([...todos].sort(() => Math.random() - 0.5));
                break;
            default:
                setTodos(todos);
                break;
        }
    }

    const createTaskOnScreen = (todo, index) => {
        return (
            <div key={index} className={styles.todoItem}>
                {editingIndex === index ? (
                    <>
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className={styles.todoInput}
                        />
                        <div className={styles.todoActions}>
                            <button className={styles.cancelButton} onClick={() => handleCancelClick(index)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <button className={styles.saveButton} onClick={() => saveDetailsInDB(todo)}>
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className={styles.todoTitle}>{todo.title}</h3>
                        <h3 className={styles.todoId}>#{todo.id}</h3>
                        <p className={styles.todoStatus}>{todo.completed ? 'Completed' : 'Not Completed'}</p>
                        {!todo.completed && (
                            <label className={styles.checkboxLabel}>
                                <input
                                    id={todo.id}
                                    type="checkbox"
                                    onChange={(e) => { handleSaveButton(todo.id); handleCheckboxChange(e) }}
                                />
                                Mark as Completed
                            </label>
                        )}
                        <div className={styles.todoActions}>
                            <button className={styles.editButton} onClick={() => handleEditClick(index, todo.title)}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </button>
                            <button className={styles.deleteButton} onClick={() => { deleteTask(todo.id) }}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                            {saveButton[todo.id] &&
                                <button className={styles.saveButton} onClick={() => saveDetailsInDB(todo)}>
                                    <FontAwesomeIcon icon={faSave} />
                                </button>
                            }
                        </div>
                    </>
                )}
            </div>
        )
    }

    const addTaskToDB = async () => {
        let taskDet = { userId: currentUser.current.id, title: inputTitle, completed: false };
        let myUrl = `todos/`;
        try {
            let response = await ApiRequest.post(myUrl, taskDet);
            console.log(response);
            if (response) {
                setTodos([...todos, response]);
                setInputTitle('');
                setShowAddTask(false);
            }
        } catch (error) {
            navigate('/404', { state: { error: 'Failed to add new task' } });
        }
    }

    const deleteTask = async (id) => {
        let myUrl = `todos/${id}`
        try {
            let response = await ApiRequest.delete(myUrl);
            if (response == 'Resource deleted successfully')
                setTodos(todos.filter((task) => task.id != id));
        } catch (error) {
            navigate('/404', { state: { error: 'Failed to delete task' } });  // Sending error to NotFound page
        }
    }

    const addTask = () => {
        return (
            <div>
                <input
                    type="text"
                    placeholder="Add title"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className={styles.todoInput}
                />
                <button
                    onClick={addTaskToDB}
                    disabled={!inputTitle.trim()}
                    className={styles.editButton}
                >
                    Add
                </button>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Link to={`/home`} className={styles.homeLink}>
                <FontAwesomeIcon icon={faHome} />
            </Link>
            <div>
                <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder="Search by title"
                    className={styles.todoInput}
                />
                <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Search by ID"
                    className={styles.todoInput}
                />
                <select
                    value={searchCompleted}
                    onChange={(e) => setSearchCompleted(e.target.value)}
                    className={styles.todoSelect}
                >
                    <option value="">Search by status</option>
                    <option value="true">Completed</option>
                    <option value="false">Not Completed</option>
                </select>
            </div>

            <label htmlFor="sort">Sort by: </label>
            <select id="sort" onChange={(e) => sortTodos(e.target.value)} className={styles.todoSelect}>
                <option value="">Select criterion</option>
                <option value="id">ID</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="completed">Completion Status</option>
                <option value="random">Random</option>
            </select>

            {!showAddTask ? (
                <button onClick={() => setShowAddTask(true)} className={styles.editButton}>
                    <FontAwesomeIcon icon={faPlus} /> Add a new task
                </button>
            ) : (
                addTask()
            )}

            <div className={styles.todoContainer}>
                {filteredTodos.map((todo, index) => (
                    createTaskOnScreen(todo, index)
                ))}
            </div>
        </div>
    );
};

export default Todos;