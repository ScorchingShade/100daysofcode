import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/items");
    }

  }, [navigate]);

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/user/create', { name, username, password });

      // clear input fields
      setName('');
      setUsername('');
      setPassword('');

       localStorage.setItem("token", response.data.token);
      // redirect to list items page on successful login
      navigate('/items',{ state: { signedUp: true } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Sign up</h2>
      <form onSubmit={handleSignup}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(event) => setName(event.target.value)} />

        <label htmlFor="username">Username:</label>
        <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />

        <button type="submit">Sign up</button>
        <button onClick={() =>navigate("/")}>Already a user? Login here!</button>
      </form>
    </div>
  );
};

export default Signup;