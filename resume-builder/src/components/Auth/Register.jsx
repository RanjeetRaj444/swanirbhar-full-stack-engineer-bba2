import React, { useState } from 'react';
import { register } from '../../api';

const Register = () => {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert('User registered successfully');
    } catch (error) {
      setError(error.response.data.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
