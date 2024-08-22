import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [courses, setCourses] = useState([]);
  const [instances, setInstances] = useState([]);
  const [searchCourse, setSearchCourse] = useState('');
  const [searchInstance, setSearchInstance] = useState('');
  const [selectedCourseDetails, setSelectedCourseDetails] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch('http://localhost:8000/api/courses/');
      const data = await response.json();
      setCourses(data);
    };
    
    const fetchInstances = async () => {
      const response = await fetch('http://localhost:8000/api/instances/');
      const data = await response.json();
      setInstances(data);
    };
    
    fetchCourses();
    fetchInstances();
  }, []);

  const addCourse = async (course) => {
    const response = await fetch('http://localhost:8000/api/courses/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    });
    const newCourse = await response.json();
    setCourses([...courses, newCourse]);
  };

  const addInstance = async (instance) => {
    const response = await fetch('http://localhost:8000/api/instances/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(instance),
    });
    const newInstance = await response.json();
    setInstances([...instances, newInstance]);
  };

  const deleteCourse = async (id) => {
    await fetch(`http://localhost:8000/api/courses/${id}/`, {
      method: 'DELETE',
    });
    setCourses(courses.filter(course => course.id !== id));
  };

  const deleteInstance = async (id) => {
    await fetch(`http://localhost:8000/api/instances/${id}/`, {
      method: 'DELETE',
    });
    setInstances(instances.filter(instance => instance.id !== id));
  };

  const handleSearchCourse = (e) => {
    setSearchCourse(e.target.value);
  };

  const handleSearchInstance = (e) => {
    setSearchInstance(e.target.value);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchCourse.toLowerCase())
  );

  const filteredInstances = instances.filter(instance =>
    instance.course.title.toLowerCase().includes(searchInstance.toLowerCase())
  );

  return (
    <div>
      <h1>Courses and Instances</h1>
      <CourseForm onAddCourse={addCourse} />
      <input
        type="text"
        placeholder="Search Courses"
        value={searchCourse}
        onChange={handleSearchCourse}
      />
      <CourseTable courses={filteredCourses} onDeleteCourse={deleteCourse} />
      <InstanceForm courses={courses} onAddInstance={addInstance} />
      <input
        type="text"
        placeholder="Search Instances"
        value={searchInstance}
        onChange={handleSearchInstance}
      />
      <InstanceTable instances={filteredInstances} onDeleteInstance={deleteInstance} />
    </div>
  );
}

function CourseForm({ onAddCourse }) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCourse({ title, course_code: code, description });
    setTitle('');
    setCode('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Course title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Course code" value={code} onChange={(e) => setCode(e.target.value)} />
      <input type="text" placeholder="Course description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button type="submit">Add Course</button>
    </form>
  );
}

function InstanceForm({ courses, onAddInstance }) {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [courseData, setCourseData] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseThroughId(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourseThroughId = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/courses/${id}/`);
      if (response.ok) {
        const courseData1 = await response.json();
        setCourseData(courseData1);
      } else {
        console.log("Failed to fetch details with id");
      }
    } catch (error) {
      console.error("Failed to fulfill the request", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddInstance({ course: courseData, year, semester, custom_course_id: 2 });
    setSelectedCourse('');
    setYear('');
    setSemester('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
      <input type="text" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
      <input type="text" placeholder="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} />
      <button type="submit">Add Instance</button>
    </form>
  );
}

function CourseTable({ courses, onDeleteCourse }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Course Title</th>
          <th>Code</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.title}</td>
            <td>{course.course_code}</td>
            <td>
              <button onClick={() => onDeleteCourse(course.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InstanceTable({ instances, onDeleteInstance }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Course Title</th>
          <th>Year</th>
          <th>Semester</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {instances.map((instance) => (
          <tr key={instance.id}>
            <td>{instance.course.title}</td>
            <td>{instance.year}</td>
            <td>{instance.semester}</td>
            <td>
              <button onClick={() => onDeleteInstance(instance.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
