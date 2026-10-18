import React from 'react';
import './Sidebar.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../actions/AuthAction';

// MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const Sidebar = ({ onOpenCreate, onOpenSearch, onOpenExplore }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.authReducer.authData || {});
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  const isHome = location.pathname === '/home' || location.pathname === '/';
  const isProfile = user && location.pathname === `/profile/${user._id}`;

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/auth');
  };

  const profileImg = user?.profilePicture
    ? serverPublic + user.profilePicture
    : serverPublic + "defaultProfile.png";

  return (
    <aside className="ig-sidebar">
      <div className="sidebar-top">
        <NavLink to="/home" className="sidebar-logo">
          <span className="logo-text">Nexora</span>
          <span className="logo-icon-mini">N</span>
        </NavLink>

        <nav className="sidebar-nav">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">
              {isHome ? <HomeIcon fontSize="large" /> : <HomeOutlinedIcon fontSize="large" />}
            </span>
            <span className="nav-label">Home</span>
          </NavLink>

          <button type="button" className="nav-item" onClick={onOpenSearch}>
            <span className="nav-icon">
              <SearchIcon fontSize="large" />
            </span>
            <span className="nav-label">Search</span>
          </button>

          <button type="button" className="nav-item" onClick={onOpenExplore}>
            <span className="nav-icon">
              <ExploreOutlinedIcon fontSize="large" />
            </span>
            <span className="nav-label">Explore</span>
          </button>

          <button
            type="button"
            className="nav-item create-nav-btn"
            onClick={onOpenCreate}
          >
            <span className="nav-icon">
              <AddBoxOutlinedIcon fontSize="large" />
            </span>
            <span className="nav-label">Create</span>
          </button>

          {user && (
            <NavLink
              to={`/profile/${user._id}`}
              className={`nav-item ${isProfile ? 'active' : ''}`}
            >
              <span className="nav-icon avatar-icon-wrap">
                <img
                  src={profileImg}
                  alt={user.firstname}
                  className={`sidebar-avatar ${isProfile ? 'avatar-active' : ''}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = serverPublic + "defaultProfile.png";
                  }}
                />
              </span>
              <span className="nav-label">Profile</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button type="button" className="nav-item logout-btn" onClick={handleLogout} title="Log Out">
          <span className="nav-icon">
            <LogoutOutlinedIcon fontSize="large" />
          </span>
          <span className="nav-label">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
