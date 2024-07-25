// ResumePreview.js
import React from 'react';

const ResumePreview = ({ resume }) => {
  if (!resume) {
    return <p>No resume selected</p>;
  }

  return (
    <div>
      <h2>Resume Preview</h2>
      <h3>{resume.title}</h3>
      <section>
        <h4>Personal Information</h4>
        <p>Name: {resume.personalInfo.name}</p>
        <p>Email: {resume.personalInfo.email}</p>
        {/* Add more personal info fields */}
      </section>
      <section>
        <h4>Work Experience</h4>
        {resume.workExperience.map((job, index) => (
          <div key={index}>
            <h5>{job.position}</h5>
            <p>{job.company}</p>
            <p>{job.description}</p>
            <p>{job.startDate} - {job.endDate}</p>
          </div>
        ))}
      </section>
      <section>
        <h4>Education</h4>
        {resume.education.map((school, index) => (
          <div key={index}>
            <h5>{school.degree}</h5>
            <p>{school.institution}</p>
            <p>{school.graduationDate}</p>
          </div>
        ))}
      </section>
      <section>
        <h4>Skills</h4>
        <ul>
          {resume.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ResumePreview;
