// ResumeList.js
import React, { useState, useEffect } from 'react';
import { getResumes, deleteResume } from '../../api';
import { Link } from 'react-router-dom';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await getResumes();
        setResumes(data);
      } catch (err) {
        setError('Failed to fetch resumes');
      }
    };

    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteResume(id);
      setResumes(resumes.filter((resume) => resume._id !== id));
    } catch (err) {
      setError('Failed to delete resume');
    }
  };

  return (
    <div>
      <h2>Your Resumes</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {resumes.map((resume) => (
          <li key={resume._id}>
            <h3>{resume.title}</h3>
            <Link to={`/resumes/${resume._id}/edit`}>Edit</Link>
            <button onClick={() => handleDelete(resume._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeList;
