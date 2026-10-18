import React from 'react';
import './PostSide.css';
import Stories from '../Stories/Stories';
import Posts from '../Posts/Posts';

const PostSide = ({ onOpenCreate }) => {
  return (
    <div className="PostSide">
      <Stories onOpenCreate={onOpenCreate} />
      <Posts onOpenCreate={onOpenCreate} />
    </div>
  );
};

export default PostSide;
