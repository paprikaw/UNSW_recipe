import { Button } from 'antd';
import React, { useState } from 'react';

const token = localStorage.getItem('token');

const LikesButton = () => {
  const [likes, setLikes] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = async () => {
    if (isClicked) {
      setLikes(true);
      const response = await fetch('/like', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      setLikes(false);
      const response = await fetch('/like', {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
    setIsClicked(!isClicked);
  };

  return (
    <Button
      className={`like-button ${isClicked && 'liked'}`}
      onClick={handleClick}
      type="text"
    >
      <span className="likes-counter">{`Like | ${likes}`}</span>
    </Button>
  );
};

export default LikesButton;
