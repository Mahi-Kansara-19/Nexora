import React, { useState, useEffect } from 'react';
import './SearchModal.css';
import { useNavigate } from 'react-router-dom';
import { getAllUser } from '../../api/UserRequest';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getAllUser()
        .then(({ data }) => {
          setUsers(data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching users for search:", err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    const query = searchTerm.toLowerCase();
    const fullName = `${u.firstname || ''} ${u.lastname || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const handleSelectUser = (userId) => {
    navigate(`/profile/${userId}`);
    onClose();
  };

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <h3>Search</h3>
          <button type="button" className="search-close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="search-input-wrapper">
          <SearchIcon className="search-input-icon" />
          <input
            type="text"
            placeholder="Search users on Nexora..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
            >
              <CloseIcon style={{ fontSize: 16 }} />
            </button>
          )}
        </div>

        <div className="search-results-list">
          {loading ? (
            <div className="search-loading">Searching Nexora...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="search-empty">
              {searchTerm ? "No users found." : "Type a name to search users."}
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u._id}
                className="search-user-item"
                onClick={() => handleSelectUser(u._id)}
              >
                <img
                  src={u.profilePicture ? serverPublic + u.profilePicture : serverPublic + "defaultProfile.png"}
                  alt={u.firstname}
                  className="search-user-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = serverPublic + "defaultProfile.png";
                  }}
                />
                <div className="search-user-info">
                  <span className="search-user-name">
                    {u.firstname} {u.lastname}
                  </span>
                  <span className="search-user-sub">
                    {u.worksAt ? u.worksAt : (u.followers ? `${u.followers.length} followers` : "Nexora user")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
