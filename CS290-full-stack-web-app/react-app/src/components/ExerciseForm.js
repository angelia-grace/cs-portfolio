import React, { useState, useEffect } from 'react';

function ExerciseForm() {
    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('');
    const [date, setDate] = useState('');

    const addExercise = async () => {
        const newExercise = { name, reps, weight, unit, date };
        const response = await fetch('/exercises', {
            method: 'POST',
            body: JSON.stringify(newExercise),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 201) {
            alert("Successfully added the exercise!");
        } else {
            alert(`Failed to add exercise, status code = ${response.status}`);
        }
    };

    return (
        <>
            <form>
                <fieldset>
                    <legend>Exercise Info</legend>
                    <label>Name:
                        <input type="text" name="name" value={name} size="30" onChange={e => setName(e.target.value)}>
                        </input>
                    </label>
                    <br />
                    <label>Reps:
                        <input type="text" name="reps" value={reps} size="30" onChange={e => setReps(e.target.value)}>
                        </input>
                    </label>
                    <br />
                    <label>Weight:
                        <input type="text" name="weight" value={weight} size="30" onChange={e => setWeight(e.target.value)}>
                        </input>
                    </label>
                    <br />
                    <label>Unit:
                        <input type="text" name="unit" value={unit} size="30" onChange={e => setUnit(e.target.value)}>
                        </input>
                    </label>
                    <br />
                    <label>Date:
                        <input type="text" name="date" value={date} size="30" onChange={e => setDate(e.target.value)}>
                        </input>
                    </label>
                    <br />
                </fieldset>
                <button onClick={e => {
                    setName(e.target.value);
                    addExercise();
                    alert(`You created the exercise ${name} with ${reps} reps, ${weight} ${unit} weight,
                        on ${date} date.`);
                    e.preventDefault();
                }}>Submit</button>
            </form>
        </>
    );
}
export default ExerciseForm;