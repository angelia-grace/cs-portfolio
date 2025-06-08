import React from "react"
import ExerciseForm from "../components/ExerciseForm"

function CreateExercise() {
    return (
        <>
            <h2>Create an exercise!</h2>
            <p>Add a new exercise to your database!</p>

            <ExerciseForm />

        </>
    );
};

export default CreateExercise;