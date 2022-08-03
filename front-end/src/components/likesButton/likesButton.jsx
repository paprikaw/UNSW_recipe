import { Primary } from '@/stories/Button.stories';
import { Button } from 'antd';
import React, { useState } from 'react';

const token = localStorage.getItem('token');

const LikesButton = (props) => {
  const { recipeId, likes, liked, onLikeChange } = props;

  const [like, setLike] = useState(likes);
  const [isLike, setIsLike] = useState(liked);

  const onLikeButtonClick = async () => {
    // if (like === 0 && isLike ) {

    // }
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

    onLikeChange(like + (isLike ? -1 : 1));
    setIsLike(!isLike);
    const data = await response.json();
    console.log(data.msg, data.error);
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
