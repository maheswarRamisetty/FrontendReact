import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/courses")
      .then((response) => setCourses(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="course-list">
      <h1>Course List</h1>
      <Link to="/add-course">
        <button>Add New Course</button>
      </Link>
      <div className="courses">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <h2>{course.title}</h2>
            <p>{course.code}</p>
            <p>{course.description}</p>
            <Link to={`/course/${course.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;
