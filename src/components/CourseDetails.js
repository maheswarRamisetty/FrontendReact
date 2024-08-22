import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/courses/${id}/`)
      .then((response) => setCourse(response.data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="course-details">
      <h1>{course.title}</h1>
      <p>Course Code: {course.course_code}</p>
      <p>{course.description}</p>

      <div className="course-instances">
        <h3>Instances:</h3>
        {course.instances && course.instances.length > 0 ? (
          course.instances.map((instance) => (
            <div key={instance.id}>
              <p>{instance.year} - Semester {instance.semester}</p>
            </div>
          ))
        ) : (
          <p>No instances available.</p>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;
