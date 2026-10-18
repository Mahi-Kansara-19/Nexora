import React from 'react';
import './BottomNav.css';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';

const BottomNav = ({ onOpenCreate, onOpenSearch, onOpenExplore }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.authReducer.authData || {});
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  const isHome = location.pathname === '/home' || location.pathname === '/';
  const isProfile = user && location.pathname === `/profile/${user._id}`;

  const profileImg = user?.profilePicture
    ? serverPublic + user.profilePicture
    : serverPublic + "defaultProfile.png";

  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/home" className="bottom-nav-item" aria-label="Home">
        {isHome ? <HomeIcon fontSize="medium" /> : <HomeOutlinedIcon fontSize="medium" />}
      </NavLink>

      <button
        type="button"
        className="bottom-nav-item"
        onClick={onOpenSearch}
        aria-label="Search"
      >
        <SearchIcon fontSize="medium" />
      </button>

      <button
        type="button"
        className="bottom-nav-item bottom-create-btn"
        onClick={onOpenCreate}
        aria-label="Create Post"
      >
        <AddBoxOutlinedIcon fontSize="medium" />
      </button>

      <button
        type="button"
        className="bottom-nav-item"
        onClick={onOpenExplore}
        aria-label="Explore"
      >
        <ExploreOutlinedIcon fontSize="medium" />
      </button>

      {user && (
        <NavLink
          to={`/profile/${user._id}`}
          className={`bottom-nav-item ${isProfile ? 'profile-active' : ''}`}
          aria-label="Profile"
        >
          <img
            src={profileImg}
            alt={user.firstname}
            className="bottom-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = serverPublic + "defaultProfile.png";
            }}
          />
        </NavLink>
      )}
    </nav>
  );
};

export default BottomNav;
