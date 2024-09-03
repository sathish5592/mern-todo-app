import React, { useEffect, useState } from 'react';

const TodoComponent = () => {
    const apiUrl = "http://localhost:3000/todos";
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, settodos] = useState([]);
    const [editId, setEditId] = useState(-1);
    const [EditTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState("");

    const handleSubmit = () => {
        if (title.trim() === "" || description.trim() === "") {
            alert("Please provide proper values");
            return;
        }

        fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        })
        .then((res) => {
            if (res.ok) {
                alert("Item successfully added to backend");
                getItem(); // Refresh the list
            } else {
                alert("Unable to add the item to the database");
            }
        })
        .catch((error) => {
            console.error("Error during fetch:", error);
            alert("An error occurred while adding the item");
        });
    };

    const getItem = () => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((res) => {
                settodos(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    };

    const deleteItem = (id) => {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        }).then((res) => {
            if (res.ok) {
                alert("Item successfully deleted");
                getItem(); // Refresh the list after deletion
            } else {
                alert("Unable to delete the item");
            }
        }).catch((error) => {
            console.error("Error during fetch:", error);
            alert("An error occurred while deleting the item");
        });
    };

    const HandleUpdate = () => {
        if (EditTitle.trim() === "" || editDescription.trim() === "") {
            alert("Some fields are missing");
            return;
        }

        fetch(`${apiUrl}/${editId}`, {  // Use editId to specify which item to update
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: EditTitle, description: editDescription })  // Send correct fields
        }).then((res) => {
            if (res.ok) {
                alert("Item successfully updated");
                setEditId(-1); // Reset the edit state
                getItem(); // Refresh the list
            } else {
                alert("Something went wrong");
            }
        }).catch((error) => {
            console.error("Error during fetch:", error);
            alert("An error occurred while updating the item");
        });
    };

    useEffect(() => {
        getItem();
    }, []);

    return (
        <>
            <div className='row p-2 bg-success text-light text-center'>
                <h1>Todo App</h1>
            </div>

            <div className='row'>
                <h3>Add item</h3>
                <div className='form-group d-flex gap-2'>
                    <input 
                        placeholder='Title' 
                        className='form-control' 
                        type='text' 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    <input 
                        placeholder='Description' 
                        className='form-control' 
                        type='text' 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                    <button className='btn btn-dark' onClick={handleSubmit}>Submit</button>
                </div>
            </div>

            <div className='pt-5'>
                <h3>Tasks</h3>
                {todos.map((item) => (
                    <ul className='list-group pt-2' key={item._id}>
                        <li className='list-group-item d-flex justify-content-between'>
                            <div className='d-flex flex-column'>
                                { 
                                    editId === -1 || editId !== item._id ? <>
                                    <span className='fw-bold'>{item?.title}</span>
                                    <span>{item?.description}</span></> :

                                    <div className='d-flex justify-content-between gap-5'>
                                        <input 
                                            placeholder='Title' 
                                            className='form-control' 
                                            type='text' 
                                            value={EditTitle} 
                                            onChange={(e) => setEditTitle(e.target.value)} 
                                        />
                                        <input 
                                            placeholder='Description' 
                                            className='form-control' 
                                            type='text' 
                                            value={editDescription} 
                                            onChange={(e) => setEditDescription(e.target.value)} 
                                        />
                                    </div>
                                }
                            </div>
                            <div className='d-flex gap-2'>
                                {editId === -1 || editId !== item._id ? 
                                    <button className='btn btn-warning' onClick={() => {
                                        setEditId(item._id);
                                        setEditTitle(item.title);
                                        setEditDescription(item.description);
                                    }}>Edit</button> :
                                    <button className='btn btn-warning' onClick={HandleUpdate}>Update</button>
                                }
                                <button className='btn btn-danger' onClick={() => deleteItem(item._id)}>Delete</button>
                            </div>
                        </li>
                    </ul>
                ))}
            </div>
        </>
    );
}

export default TodoComponent;
