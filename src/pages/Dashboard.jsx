import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
    getTasks,
    getTasksDescriptionOnly, 
    addTask,
    getTask,
    updateTask,
    deleteTask,
    searchTask,
    logout,
    getSession,
    getUser,
    uploadImage,
    deleteImage
} from "../services/tasksService";
import { useNavigate } from "react-router-dom";

import '../App.css'
import { supabase } from "../services/supabase";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({ name: "", description: "", is_finished: false, image_url: null })

    const [title, setTitle] = useState("Add New Task")
    const [currentTaskID, setCurrentTaskID] = useState(null)
    const [searchName, setSearchName] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const [imageFile, setImageFile] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)

    const navigate = useNavigate()

    useEffect(() => {
        const initialize = async () => {
            await getTasks(setTasks);

            const { email } = await getUser()
            console.log(email)
            setCurrentUser(email)
        }

        initialize()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()

        let taskDescription = taskData.description && taskData.description.trim();
        if (taskDescription === "") {
            taskDescription = null;
        }

        try {
            let imageUrl = null
            if(imageFile) {
                setIsUploading(true)
                imageUrl = await uploadImage(imageFile)
            }

            // TASK DATA
            const task = {
                name: taskData.name,
                description: taskDescription,
                is_finished: taskData.is_finished,
                image_url: imageUrl
            }

            if(!currentTaskID) {
                // IF NEW DATA
                const response = await addTask(task)
                if(response) {
                    alert('Task added successfully')
                }
            } else {
                // IF UPDATING DATA
                const response = await updateTask(currentTaskID, task)
                const deleteImageResponse = await deleteImage(taskData.image_url)
                if(response) {
                    alert('Task updated successfully')
                }
            }

            setTaskData({ name: "", description: "", is_finished: false, image_url: null })
            setImageFile(null)
            getTasks(setTasks)
            if(fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } catch(err) {
            console.error(`Error creating/updating task: ${err.message}`)
            alert(`Failed to create/update task!`)
        } finally {
            setIsUploading(false)
        }
    }

    const handleCheckboxChange = (e) => {
        if(e.target.checked) {
            setTaskData({...taskData, is_finished: true});
        } else {
            setTaskData({...taskData, is_finished: false})
        }
    }

    const handleUpdate = async (taskID) => {
        try {
            // 1. kunin yung existing task
            // 2. ilapat yung existing task sa fields ng form
            // 3. update yung title ng form
            // 4. update yung state kung "editing" state, IF OO ang task service function call `updatetask()` if not `createtask()`
            if(fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            let taskResponse = await getTask(taskID)
            if(taskResponse) {
                setTaskData({name: taskResponse.name, description: taskResponse.description, is_finished: taskResponse.is_finished, image_url: taskResponse.image_url})
                setCurrentTaskID(taskID)
                setTitle("Update Task")
            } else {
                console.log(`getTask failed: ${taskResponse}`)
            }

        } catch(err) {
            console.error(`Error updating task: ${err.message}`)
            alert(`Failed to update task!`)
        }
    }

    const handleDelete = async (taskID) => {
        try {
            const response = await deleteTask(taskID)
            if(response) {
                alert('Task deleted successfully')

                getTasks(setTasks);
            }
            
            setTaskData({ name: "", description: "", is_finished: false })
        } catch(err) {
            console.error(`Error deleting task: ${err.message}`)
            alert(`Failed to delete task!`)
        }
    }

    const handleClearFields = () => {
        setTaskData({ name: "", description: "", is_finished: false, image_url: null })
        setImageFile(null)
        setTitle("Add New Task")
        if(fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSearchClear = async () => {
        setSearchName("")
        await getTasks(setTasks);
    }

    const handleSearchSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await searchTask(searchName)
            console.log(response)
            if(response) {
                alert('Task(s) searched successfully')

                setTasks(response)
            }
            
            setTaskData({ name: "", description: "", is_finished: false })
        } catch(err) {
            alert(`Error searching a task`)
            console.error(`Error searching task: ${err.message}`)
        }
    }

    const handleLogout = async (e) => {
        logout()
        navigate('/')
    }

    const handleGetSession = async (e) => {
        const { session } = await getSession()
        console.log(session)
        alert(session.access_token)
    }


    return (
        <div className="content">
            <div>
                <h1>Hello, {currentUser} Welcome! Today is {Date.now()}</h1>
                <h3>{title}</h3>
                <form onSubmit={handleSubmit}>
                    <label>Task Name</label>
                    <input type="text" placeholder="Wash the dishes" value={taskData.name} onChange={(e) => setTaskData({...taskData, name: e.target.value})} required /> <br />

                    <label>Task Description (Nullable)</label>
                    <input type="text" placeholder="Wash the dishes" value={taskData.description} onChange={(e) => setTaskData({...taskData, description: e.target.value})} /> <br />

                    <label>Task Status</label>
                    <input type="checkbox" id="finished" checked={taskData.is_finished} onChange={handleCheckboxChange}/> <label>Finished</label> <br />

                    <label>Task Image (Nullable)</label>
                    <input type="file" accept="image/png, image/jpeg" onChange={(e) => setImageFile(e.target.files[0])} ref={fileInputRef} /> <br />

                    <button type="submit" disabled={isUploading}>{isUploading ? 'Saving...' : 'Submit'}</button>
                    <button onClick={handleClearFields} className="clear-btn" disabled={isUploading}>Clear Fields</button>
                </form>
            </div>

            <div className="tasks-table-wrapper">
                <div>
                    <form onSubmit={handleSearchSubmit}>
                        <label>Find a task</label>
                        <input type="text" id="search-input" placeholder="Search via name.." onChange={(e) => setSearchName(e.target.value)} value={searchName} />
                        <button type="submit">Search</button>
                        <button type="button" onClick={handleSearchClear}>Clear</button>
                    </form>
                </div>
                <table className="tasks-table">
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Is Finished</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 ? (
                                <tr className="tasks-table-empty"><td colSpan={6}>No tasks found. Add one above!</td></tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.id}</td>
                                    <td>{task.name}</td>
                                    <td>{task.description}</td>
                                    <td>{task.is_finished === true ? "FINISHED" : "UNFINISHED"}</td>
                                    <td>
                                        <div className="task-image-wrapper">
                                            <img src={task.image_url} alt="Task attachment" className="task-image" />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button onClick={() => handleUpdate(task.id)}>Update</button>
                                            <button className="btn-delete" onClick={() => handleDelete(task.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                <button onClick={handleGetSession}>Get Session</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Dashboard;