import { Button } from 'antd';
import React, { useState } from 'react';

const LikesButton = () => {
  const [likes, setLikes] = useState(null);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isClicked) {
      setLikes(true);
    } else {
      setLikes(false);
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
