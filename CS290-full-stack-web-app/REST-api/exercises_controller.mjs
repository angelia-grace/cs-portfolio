import 'dotenv/config';
import express from 'express';
import * as exercises from './exercises_model.mjs';

const app = express();

const PORT = process.env.PORT;

app.post("/exercises", (req, res) => {
    exercises.createExercise(req.query.name, req.query.reps, req.query.weight, req.query.unit, req.query.date)
        .then(exercise => {
                res.status(201).json(exercise);
        })
});

app.get("/exercises", (req, res) => {
    exercises.findAllExercises()
        .then(exercise => {
            res.status(200).json(exercise);
        })
});

app.get("/exercises/:id", (req, res) => {
    const exercise_id = req.params.id
    exercises.findOneExercise(exercise_id)
        .then(exercise => {
            res.status(200).json(exercise);
        })
});

app.put("/exercises/:id", (req, res) => {
    exercises.updateExercise(req.params.id, req.query.name, req.query.reps, req.query.weight, req.query.unit, req.query.date)
        .then(updated_exercise => {
            res.status(200).json(updated_exercise);
        })    
});

app.delete("/delete/:id", (req, res) => {
    exercises.deleteExercise(req.params.id)
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});