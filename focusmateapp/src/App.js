import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './app/context/Context';
import LoginForm from './app/auth/LoginForm';
import SignupForm from './app/auth/SignupForm';
import HomeScreen from "./app/screens/HomeScreen/HomeScreen";
import CreateTasks from "./app/screens/Tasks/CreateTasks";

function App() {
  const { user } = useAuth();
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={user ? <HomeScreen /> : <LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/createtask" element={user ? <CreateTasks /> : <LoginForm />}/>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
