import React, { useState, useEffect } from 'react';
import EditExerciseForm from "../components/ExerciseForm"

function CreateExercise() {
    return (
        <>
            <h2>Create an exercise!</h2>
            <p>Add a new exercise to your database!</p>

            <EditExerciseForm />

        </>
    );
};

export default CreateExercise;