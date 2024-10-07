// src/components/ExercisesSection.js

import React, { useState } from "react";
import ExerciseComprehension from "./ExerciseComprehension";
import ExerciseMatching from "./ExerciseMatching";
import ExerciseFillInTheBlanks from "./ExerciseFillInTheBlanks";

function ExercisesSection({ exercises }) {
	const [userAnswers, setUserAnswers] = useState({});
	const [score, setScore] = useState(null);

	const handleAnswerChange = (exerciseIndex, questionIndex, answer) => {
		setUserAnswers((prevAnswers) => {
			const updatedAnswers = { ...prevAnswers };
			if (!updatedAnswers[exerciseIndex]) {
				updatedAnswers[exerciseIndex] = {};
			}
			updatedAnswers[exerciseIndex][questionIndex] = answer;
			return updatedAnswers;
		});
	};

	const handleSubmit = () => {
		let totalQuestions = 0;
		let correctAnswers = 0;

		exercises.forEach((exercise, exerciseIndex) => {
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

		const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
		setScore(calculatedScore);
	};

	return (
		<div>
			<h2>תרגילים</h2>
			{exercises.map((exercise, exerciseIndex) => (
				<div key={exerciseIndex}>
					{exercise.type === "comprehension" && (
						<ExerciseComprehension
							exercise={exercise}
							exerciseIndex={exerciseIndex}
							userAnswers={userAnswers}
							handleAnswerChange={handleAnswerChange}
						/>
					)}
					{exercise.type === "matching" && (
						<ExerciseMatching
							exercise={exercise}
							exerciseIndex={exerciseIndex}
							userAnswers={userAnswers}
							handleAnswerChange={handleAnswerChange}
						/>
					)}
					{exercise.type === "fillInTheBlanks" && (
						<ExerciseFillInTheBlanks
							exercise={exercise}
							exerciseIndex={exerciseIndex}
							userAnswers={userAnswers}
							handleAnswerChange={handleAnswerChange}
						/>
					)}
				</div>
			))}
			<button
				onClick={handleSubmit}
				style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}
			>
				בדוק תשובות
			</button>
			{score !== null && (
				<div style={{ marginTop: "20px" }}>
					<h3>הציון שלך: {score}%</h3>
				</div>
			)}
		</div>
	);
}

export default ExercisesSection;
