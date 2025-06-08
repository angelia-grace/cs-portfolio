import React, { useState, useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';

function EditDelete() {
    const [exercises, setExercises] = useState([]);
    const onDelete = async id => {
        const response = await fetch(`/exercises/${id}`, { method: 'DELETE' });
        if (response.status === 204) {
            const getResponse = await fetch('/exercises');
            const exercises = await getResponse.json();
            setExercises(exercises);
        } else {
            console.error(`Failed to delete exercise with id = ${id}, status code = ${response.status}`)
        }
    }

    return (
        <>
            <MdEdit onClick={() => { "/edit" }} />
            <MdDeleteForever onClick={() => { onDelete() }} />
        </>
    );
}
export default EditDelete;