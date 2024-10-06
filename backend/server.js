// backend/server.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lesson = require("./LessonData");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Endpoints

// Get Lesson Data
app.get("/api/lesson", (req, res) => {
	res.json(lesson);
});

// Validate Answers
app.post("/api/validate", (req, res) => {
	const userAnswers = req.body.userAnswers;

	let totalQuestions = 0;
	let correctAnswers = 0;

	lesson.exercises.forEach((exercise, exerciseIndex) => {
		if (exercise.type === "comprehension") {
			exercise.questions.forEach((question, questionIndex) => {
				totalQuestions += 1;
				const userAnswer = userAnswers[exerciseIndex]?.[questionIndex];
				if (userAnswer === question.correctAnswer) {
					correctAnswers += 1;
				}
			});
		} else if (exercise.type === "matching") {
			exercise.pairs.forEach((pair, index) => {
				totalQuestions += 1;
				const userAnswer = userAnswers[exerciseIndex]?.[index];
				if (userAnswer === pair.english) {
					correctAnswers += 1;
				}
			});
		} else if (exercise.type === "fillInTheBlanks") {
			exercise.sentences.forEach((sentenceObj, questionIndex) => {
				totalQuestions += Object.keys(sentenceObj.correctAnswers).length;
				const userAnswer = userAnswers[exerciseIndex]?.[questionIndex];
				Object.keys(sentenceObj.correctAnswers).forEach((blank) => {
					if (userAnswer?.[blank] === sentenceObj.correctAnswers[blank]) {
						correctAnswers += 1;
					}
				});
			});
		}
	});

	const score = Math.round((correctAnswers / totalQuestions) * 100);
	res.json({ score });
});

// Serve static files from the React app
const buildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(buildPath));

// Handle all other routes by serving index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(buildPath, "index.html"), function (err) {
		if (err) {
			res.status(500).send(err);
		}
	});
});

// Start the server
app.listen(port, () => {
	console.log(`Backend server is running on port ${port}`);
});
