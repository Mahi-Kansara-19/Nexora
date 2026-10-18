import React from 'react';
import './ShareModal.css';
import PostShare from '../PostShare/PostShare';
import CloseIcon from '@mui/icons-material/Close';

function ShareModal({ modalOpened, setModalOpened }) {
  if (!modalOpened) return null;

  return (
    <div className="share-modal-backdrop" onClick={() => setModalOpened(false)}>
      <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <span className="sm-title">Create Post</span>
          <button
            type="button"
            className="sm-close-btn"
            onClick={() => setModalOpened(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="share-modal-body">
          <PostShare />
        </div>
      </div>
    </div>
  );
}

export default ShareModal;