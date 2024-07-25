import React, { useState } from 'react';
import { createResume } from '../../api';

const ResumeForm = () => {
  const [form, setForm] = useState({
    title: '',
    personalInfo: {},
    workExperience: [],
    education: [],
    skills: [],
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createResume(form);
      alert('Resume created successfully');
    } catch (error) {
      setError(error.response.data.errors || 'Failed to create resume');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
        required
      />
      {/* Add inputs for other sections like personalInfo, workExperience, education, skills */}
      <button type="submit">Create Resume</button>
    </form>
  );
};

export default ResumeForm;
