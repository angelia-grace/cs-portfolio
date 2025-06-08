import React from "react";
import EditDelete from "./EditDelete"

function ExerciseRow({ exercise }) {
    return (
        <>
            <tr>
                <td>{exercise.name}</td>
                <td>{exercise.reps}</td>
                <td>{exercise.unit}</td>
                <td>{exercise.weight}</td>
                <td>{exercise.date}</td>
                <td> <EditDelete></EditDelete> </td>
            </tr>
        </>
    );
}
export default ExerciseRow;