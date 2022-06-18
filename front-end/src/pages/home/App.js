import logo from '@/assets/img/logo.svg';
import './App.css';
import axios from 'axios';
import React, { useState } from "react";

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {sentence}
          </a>
      </header>
    </div>
  );
}

export default App;
