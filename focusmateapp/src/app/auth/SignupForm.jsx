import React, { useState } from 'react';
import { useAuth } from '../context/Context';
import './auth.css';
import { db } from '../../utils/Firebase/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const SignupForm = () => {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user; 

      // Save user info to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email, 
        accountCreationTime: user.metadata.creationTime,
      });
    } catch (err) {
      setError('Failed to create an account');
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupForm;
