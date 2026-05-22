import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
    getTasks,
    getTasksDescriptionOnly, 
    addTask,
    getTask,
    updateTask,
    deleteTask,
    searchTask    
} from "../services/tasksService";

import '../App.css'
import { supabase } from "../services/supabase";

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({ name: "", description: "", is_finished: false })

    const [title, setTitle] = useState("Add New Task")
    const [currentTaskID, setCurrentTaskID] = useState(null)
    const [searchName, setSearchName] = useState('')

    useEffect(() => {
        getTasks(supabase, setTasks);
        // getTasksDescriptionOnly(supabase, setTasks)
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()

        let taskDescription = taskData.description && taskData.description.trim();
        if (taskDescription === "") {
            taskDescription = null;
        }

        try {
            const task = {
                name: taskData.name,
                description: taskDescription,
                is_finished: taskData.is_finished
            }

            if(!currentTaskID) {
                // IF NEW DATA
                const response = await addTask(task, supabase)
                if(response) {
                    alert('Task added successfully')

                    getTasks(supabase, setTasks);
                }
                
                setTaskData({ name: "", description: "", is_finished: false })
            } else {
                // IF UPDATING DATA
                const response = await updateTask(currentTaskID, task, supabase)
                if(response) {
                    alert('Task updated successfully')

                    getTasks(supabase, setTasks);
                }

                console.log(response)
                
                setTaskData({ name: "", description: "", is_finished: false })
            }
        } catch(err) {
            console.error(`Error creating/updating task: ${err.message}`)
            alert(`Failed to create/update task!`)
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

            let taskResponse = await getTask(taskID, supabase)
            if(taskResponse) {
                setTaskData({name: taskResponse.name, description: taskResponse.description, is_finished: taskResponse.is_finished})
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
            const response = await deleteTask(taskID, supabase)
            if(response) {
                alert('Task deleted successfully')

                getTasks(supabase, setTasks);
            }
            
            setTaskData({ name: "", description: "", is_finished: false })
        } catch(err) {
            console.error(`Error deleting task: ${err.message}`)
            alert(`Failed to delete task!`)
        }
    }

    const handleClearFields = () => {
        setTaskData({ name: "", description: "", is_finished: false })
        setTitle("Add New Task")
    }

    const handleSearchClear = async () => {
        setSearchName("")
        await getTasks(supabase, setTasks);
    }

    const handleSearchSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log(searchName + ":" + supabase)
            const response = await searchTask(searchName, supabase)
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


    return (
        <div className="content">
            <div>
                <h3>{title}</h3>
                <form onSubmit={handleSubmit}>
                    <label>Task Name</label>
                    <input type="text" placeholder="Wash the dishes" value={taskData.name} onChange={(e) => setTaskData({...taskData, name: e.target.value})} required /> <br />

                    <label>Task Description (Nullable)</label>
                    <input type="text" placeholder="Wash the dishes" value={taskData.description} onChange={(e) => setTaskData({...taskData, description: e.target.value})} /> <br />

                    <label>Task Status</label>
                    <input type="checkbox" id="finished" checked={taskData.is_finished} onChange={handleCheckboxChange}/> <label>Finished</label> <br />

                    <button type="submit">Submit</button>
                    <button onClick={handleClearFields} className="clear-btn">Clear Fields</button>
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length === 0 ? (
                                <tr className="tasks-table-empty"><td colSpan={5}>No tasks found. Add one above!</td></tr>
                        ) : (
                            tasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.id}</td>
                                    <td>{task.name}</td>
                                    <td>{task.description}</td>
                                    <td>{task.is_finished === true ? "FINISHED" : "UNFINISHED"}</td>
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
        </div>
    );
}

export default Dashboard;