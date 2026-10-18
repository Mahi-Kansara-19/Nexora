import React, { useState } from 'react';
import './ExploreModal.css';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

const ExploreModal = ({ isOpen, onClose }) => {
  const posts = useSelector((state) => state.postReducer.posts || []);
  const [selectedPost, setSelectedPost] = useState(null);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  if (!isOpen) return null;

  // Filter posts that have images for the explore grid
  const photoPosts = posts.filter((p) => p.image);

  return (
    <div className="explore-backdrop" onClick={onClose}>
      <div className="explore-modal" onClick={(e) => e.stopPropagation()}>
        <div className="explore-header">
          <h3>Explore Nexora</h3>
          <button type="button" className="explore-close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="explore-content">
          {photoPosts.length === 0 ? (
            <div className="explore-empty">
              <p>No photos have been shared on Nexora yet.</p>
              <p>Be the first to create and share a moment!</p>
            </div>
          ) : (
            <div className="explore-grid">
              {photoPosts.map((post) => (
                <div
                  key={post._id}
                  className="explore-grid-item"
                  onClick={() => setSelectedPost(post)}
                >
                  <img
                    src={serverPublic + post.image}
                    alt={post.desc || "Explore photo"}
                    className="explore-grid-img"
                  />
                  <div className="explore-grid-overlay">
                    <span className="overlay-stat">
                      <FavoriteIcon fontSize="small" />
                      {(post.likes || []).length}
                    </span>
                    <span className="overlay-stat">
                      <ChatBubbleIcon fontSize="small" />
                      0
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Post Preview */}
        {selectedPost && (
          <div className="explore-detail-backdrop" onClick={() => setSelectedPost(null)}>
            <div className="explore-detail-card" onClick={(e) => e.stopPropagation()}>
              <div className="explore-detail-image-box">
                <img src={serverPublic + selectedPost.image} alt="" />
              </div>
              <div className="explore-detail-sidebar">
                <div className="explore-detail-header">
                  <span className="explore-detail-title">Post Details</span>
                  <button
                    type="button"
                    className="explore-detail-close"
                    onClick={() => setSelectedPost(null)}
                  >
                    <CloseIcon />
                  </button>
                </div>
                <div className="explore-detail-body">
                  <p className="explore-detail-desc">{selectedPost.desc || "No caption."}</p>
                  <div className="explore-detail-stats">
                    <FavoriteIcon style={{ color: "var(--ig-red)", fontSize: 18 }} />
                    <span>{(selectedPost.likes || []).length} likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreModal;
