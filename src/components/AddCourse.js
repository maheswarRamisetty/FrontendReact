import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  

function AddCourse() {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();  

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCourse = 
    {
        title: title,
        course_code: code,
        description: description
    };
    
    axios.post("http://127.0.0.1:8000/api/courses/", newCourse,{
        headers: {
            'Content-Type': 'application/json'
          }
    })
      .then((response) => {
        console.log("Courses Added");
        console.log(response.data)
        navigate("/")
  }) 
      .catch((error) => console.log(error));
  };

  return (
    <div className="add-course">
      <h1>Add New Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Course Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Course</button>
      </form>
    </div>
  );
}

export default AddCourse;
