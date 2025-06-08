import React, { useState, useEffect } from 'react';
import ExerciseTable from "../components/ExerciseTable"

function HomePage() {

    const [exercises, setExercises] = useState([]);

    const loadExercises = async () => {
        const response = await fetch('/exercises');
        const exercises = await response.json();
        setExercises(exercises);
    }

    useEffect(() => {
        loadExercises();
    }, []);

    return (

        <>

            <h2>Home Page</h2>
            <p>Welcome to the Exercise Data App!
                Here you can view all of your saved exercises, edit them,
                delete them, and add new ones.
            </p>

            <ExerciseTable exercises={exercises}></ExerciseTable>

        </>
    );
};

export default HomePage;