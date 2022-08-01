import { Primary } from '@/stories/Button.stories';
import { Button } from 'antd';
import React, { useState } from 'react';

const token = localStorage.getItem('token');

const LikesButton = (props) => {
  const { recipeId, likes, liked } = props;

  const [like, setLike] = useState(likes);
  const [isLike, setIsLike] = useState(liked);

  const onLikeButtonClick = async () => {
    setLike(like + (isLike ? -1 : 1));

    const response = await fetch('/like', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        token: token,
        recipeId: recipeId,
      }),
    });

    setIsLike(!isLike);
  };

  return (
    <Button
      className={'like-button ' + (isLike ? 'liked' : '')}
      onClick={onLikeButtonClick}
      type={isLike ? 'primary' : 'default'}
    >
      {'Like'} | {like}
    </Button>
  );
};

export default LikesButton;
