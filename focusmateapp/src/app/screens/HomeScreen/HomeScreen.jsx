import React from 'react'
import { useAuth } from '../../context/Context';

function HomeScreen() {
  const { user, logout } = useAuth();
  return (
    <div>
      <h1>Welcome, {user.displayName || user.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default HomeScreen