import React from 'react';
import './TopNav.css';
import { NavLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

const TopNav = ({ onOpenCreate, onOpenSearch }) => {
  return (
    <header className="mobile-top-nav">
      <NavLink to="/home" className="top-nav-logo">
        Nexora
      </NavLink>

      <div className="top-nav-actions">
        <button
          type="button"
          className="top-action-btn"
          onClick={onOpenSearch}
          aria-label="Search"
        >
          <SearchIcon />
        </button>

        <button
          type="button"
          className="top-action-btn"
          onClick={onOpenCreate}
          aria-label="Create post"
        >
          <AddBoxOutlinedIcon />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
