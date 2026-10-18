import React, { useState, useEffect } from 'react';
import './RightSide.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logOut } from '../../actions/AuthAction';
import { getAllUser } from '../../api/UserRequest';
import UserFollow from '../UserFollow/UserFollow';
import { TrendData } from '../Data/TrendData';

const RightSide = ({ onOpenSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer.authData || {});
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await getAllUser();
        const others = (data || []).filter((u) => u._id !== user?._id).slice(0, 5);
        setSuggestedUsers(others);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };
    fetchSuggestions();
  }, [user?._id]);

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/auth');
  };

  const profileImg = user?.profilePicture
    ? serverPublic + user.profilePicture
    : serverPublic + "defaultProfile.png";

  return (
    <aside className="ig-right-panel">
      {/* Current User Quick Row */}
      {user && (
        <div className="current-user-row">
          <Link to={`/profile/${user._id}`} className="cur-user-link">
            <img
              src={profileImg}
              alt={user.firstname}
              className="cur-user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = serverPublic + "defaultProfile.png";
              }}
            />
            <div className="cur-user-meta">
              <span className="cur-username">{user.firstname}_{user.lastname}</span>
              <span className="cur-fullname">{user.firstname} {user.lastname}</span>
            </div>
          </Link>
          <button type="button" className="switch-user-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      )}

      {/* Suggested Users Header */}
      <div className="suggestions-section">
        <div className="suggestions-header">
          <span className="suggestions-title">Suggested for you</span>
          <button type="button" className="see-all-btn" onClick={onOpenSearch}>
            See All
          </button>
        </div>

        <div className="suggestions-list">
          {suggestedUsers.length === 0 ? (
            <p className="no-suggestions">No suggestions right now.</p>
          ) : (
            suggestedUsers.map((person) => (
              <UserFollow person={person} key={person._id} />
            ))
          )}
        </div>
      </div>

      {/* Trending Topics / Hashtags */}
      <div className="trending-section">
        <span className="trending-title">Trending on Nexora</span>
        <div className="trending-pills">
          {TrendData.slice(0, 4).map((trend, idx) => (
            <div key={idx} className="trend-pill" onClick={onOpenSearch}>
              <span className="trend-tag">#{trend.name}</span>
              <span className="trend-shares">{trend.shares}k posts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="ig-footer">
        <div className="footer-links">
          <a href="#about" onClick={(e) => e.preventDefault()}>About</a> •
          <a href="#help" onClick={(e) => e.preventDefault()}>Help</a> •
          <a href="#press" onClick={(e) => e.preventDefault()}>Press</a> •
          <a href="#api" onClick={(e) => e.preventDefault()}>API</a> •
          <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a> •
          <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
        </div>
        <p className="copyright-text">
          © 2026 NEXORA FROM MERN STACK
        </p>
      </footer>
    </aside>
  );
};

export default RightSide;
