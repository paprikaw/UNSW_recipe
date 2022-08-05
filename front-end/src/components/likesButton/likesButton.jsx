import { Button } from 'antd';
import React, { useState } from 'react';
import { LikeOutlined } from '@ant-design/icons';

/**
 * * Component: Like feature button for recipe - show on recipe detail page
 * @recipeId recipe ID number
 * @likes number of likes
 * @liked boolean
 * @onLikeChange like state param
 */
const LikesButton = (props) => {
  const { recipeId, likes, liked, onLikeChange } = props;

  const [like, setLike] = useState(likes);
  const [isLike, setIsLike] = useState(liked);
  const [loading, setLoading] = useState(false);

  // Callback for like button
  const onLikeButtonClick = async () => {
    setLike(like + (isLike ? -1 : 1));
    const token = localStorage.getItem('token');
    setLoading(true);
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
    setLoading(false);
    onLikeChange(like + (isLike ? -1 : 1));
    setIsLike(!isLike);
    const data = await response.json();
  };

  return (
    <Button
      className={'like-button ' + (isLike ? 'liked' : '')}
      onClick={onLikeButtonClick}
      type={isLike ? 'primary' : 'default'}
      loading={loading}
    >
      <LikeOutlined /> | {like}
    </Button>
  );
};

export default LikesButton;
