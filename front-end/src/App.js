import { BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import axios from 'axios';
import React, { useState } from "react";
import Login from '@/pages/login'
import Register from "@/pages/register";
function App() {
  const [sentence, setSentence] = useState('');

  axios({
    method: 'get',
    url: 'http://localhost:8080',
  })
  .then((res) => {
    setSentence(res.data);
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
