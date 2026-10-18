import React, { useState } from 'react';
import './UserFollow.css';
import { useDispatch, useSelector } from 'react-redux';
import { followUser, unFollowUser } from '../../actions/UserAction';
import { Link } from 'react-router-dom';

const UserFollow = ({ person }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData || {});
  const [following, setFollowing] = useState((person.followers || []).includes(user?._id));

  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  const handleFollow = (e) => {
    e.preventDefault();
    if (!user?._id) return;
    following
      ? dispatch(unFollowUser(person._id, user))
      : dispatch(followUser(person._id, user));

    setFollowing((prev) => !prev);
  };

  const profileImg = person.profilePicture
    ? serverPublic + person.profilePicture
    : serverPublic + "defaultProfile.png";

  return (
    <div className="ig-user-follow-item">
      <Link to={`/profile/${person._id}`} className="uf-user-link">
        <img
          src={profileImg}
          alt={person.firstname}
          className="uf-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = serverPublic + "defaultProfile.png";
          }}
        />
        <div className="uf-info">
          <span className="uf-username">
            {person.firstname} {person.lastname}
          </span>
          <span className="uf-sub">Suggested for you</span>
        </div>
      </Link>

      <button
        type="button"
        className={`uf-btn ${following ? 'following' : 'follow'}`}
        onClick={handleFollow}
      >
        {following ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default UserFollow;
