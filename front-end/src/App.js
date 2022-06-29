import { BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import axios from 'axios';
import React, { useState } from "react";
import Login from '@/pages/login'
import Register from "@/pages/register";
import Home from "@/pages/home";
import LogoutButton from './components/LogoutButton';

function App() {
  const [sentence, setSentence] = useState('');

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/logout" element={<LogoutButton />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
