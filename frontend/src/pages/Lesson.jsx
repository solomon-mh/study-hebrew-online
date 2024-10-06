// src/components/Lesson.js

import React, { useEffect, useState } from "react";
import StorySection from "../components/lessons/StorySections";
import GrammarSection from "../components/lessons/GrammarSection";
import ExercisesSection from "../components/lessons/ExercisesSection";
import axios from "axios";

function Lesson() {
	const [lesson, setLesson] = useState(null);
	useEffect(() => {
		axios
			.get("http://54.242.90.146:5000/api/lesson")
			.then((response) => {
				console.log("API response:", response);  // Check this log for errors
				setLesson(response.data);
			})
			.catch((error) => console.error(error));
	}, []);
    console.log(lesson);
	
	if (!lesson) {
		return <p>טוען שיעור...</p>;
	}
	return (
		<div
			style={{
				direction: "rtl",
				textAlign: "right",
				fontFamily: "Arial, sans-serif",
				margin: "20px",
			}}
		>
			<h1>שיעור עברית</h1>
			{lesson.story && <StorySection story={lesson.story} />}
			{lesson.grammar && <GrammarSection grammar={lesson.grammar} />}
			{lesson.exercises && <ExercisesSection exercises={lesson.exercises} />}
		</div>
	);
}

export default Lesson;
