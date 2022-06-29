import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const createLogoutButton = async () => {
    const response = await fetch('http://localhost:8080/logout', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: token,
      }),
    });

    const data = await response.json();
    if (data.msg === 'LOGOUT_FAILURE') {
      // console.log(await response.text());
      alert(response.status + ': ' + data.error);
    } else {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <>
      <button onClick={createLogoutButton}>Logout</button>
    </>
  );
}

export default LogoutButton;
