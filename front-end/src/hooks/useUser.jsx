import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export default function useUser() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  }

  function saveToken(token) {
    localStorage.setItem('user_token', token);
  }

  function getUser() {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
    return user;
  }

  function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('user_token');
    setUser(null);
    message.success('Log out successfully', 0.5, () => {
      navigate('/login');
    });
  }

  return {
    user,
    getUser,
    saveUser,
    logout,
    saveToken,
  };
}
