import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    'mongodb+srv://marticad:k4tieled3cky@cluster0.otq2vz5.mongodb.net/exercises_db?retryWrites=true&w=majority',
    { useNewUrlParser: true }
);

const db = mongoose.connection;

const exerciseSchema = mongoose.Schema({
	name: { type: String, required: true },
	reps: { type: Number, required: true },
	weight: { type: Number, required: true },
	unit: { type: String, required: true },
    date: { type: String, required: true },
});

const Exercise = mongoose.model("Exercise", exerciseSchema)

const createExercise = async (name, reps, weight, unit, date) => {
	const new_exercise = new Exercise({name:name, reps:reps, weight:weight, unit:unit, date:date});
	return new_exercise.save();
};

const findOneExercise = async (filter) => {
    const query = Exercise.find(filter)
    return query.exec();
};

const findAllExercises = async () => {
    const query = Exercise.find()
    return query.exec();
};


const updateExercise = async (filter, name, reps, weight, unit, date) => {
    const updated_exercise = await Exercise.updateOne(filter, name, reps, weight, unit, date)
    return updated_exercise;
};

const deleteExercise = async (_id) => {
    const deleted_exercise = await Exercise.deleteOne({ _id: _id })
    return;
};

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export{createExercise, findOneExercise, findAllExercises, updateExercise, deleteExercise};