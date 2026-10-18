import React, { useState, useRef } from 'react';
import './CreatePostModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage, uploadPost } from '../../actions/UploadAction';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

const CreatePostModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData || {});
  const loading = useSelector((state) => state.postReducer.uploading);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file (PNG, JPG, JPEG).');
        return;
      }
      setErrorMsg('');
      setImage(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.type.startsWith('image/')) {
        setErrorMsg('Please drop an image file.');
        return;
      }
      setErrorMsg('');
      setImage(droppedFile);
    }
  };

  const handleReset = () => {
    setImage(null);
    setDesc('');
    setErrorMsg('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desc.trim() && !image) {
      setErrorMsg('Please provide a caption or an image.');
      return;
    }

    const newPost = {
      userId: user._id,
      desc: desc.trim(),
    };

    if (image) {
      const data = new FormData();
      const filename = Date.now() + "_" + image.name.replace(/\s+/g, '_');
      data.append("name", filename);
      data.append("file", image);
      newPost.image = filename;

      try {
        await dispatch(uploadImage(data));
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }

    try {
      await dispatch(uploadPost(newPost));
      handleClose();
    } catch (err) {
      console.error("Post creation failed:", err);
      setErrorMsg('Failed to share post. Please try again.');
    }
  };

  const profileImg = user?.profilePicture
    ? serverPublic + user.profilePicture
    : serverPublic + "defaultProfile.png";

  return (
    <div className="create-post-backdrop" onClick={handleClose}>
      <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="create-post-header">
          {image ? (
            <button
              type="button"
              className="cp-back-btn"
              onClick={() => setImage(null)}
              title="Change Image"
            >
              <ArrowBackIcon />
            </button>
          ) : (
            <button
              type="button"
              className="cp-back-btn"
              onClick={handleClose}
              title="Close"
            >
              <CloseIcon />
            </button>
          )}

          <h3 className="cp-title">Create new post</h3>

          <button
            type="button"
            className="cp-share-btn"
            onClick={handleSubmit}
            disabled={loading || (!image && !desc.trim())}
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>

        {/* Content Body */}
        <div className={`create-post-body ${image ? 'has-image-layout' : ''}`}>
          {!image ? (
            <div
              className={`dropzone-area ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <AddPhotoAlternateOutlinedIcon className="dropzone-icon" />
              <p className="dropzone-text">Drag photos here</p>
              <button
                type="button"
                className="ig-btn-primary"
                onClick={() => fileInputRef.current.click()}
              >
                Select from computer
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
              {errorMsg && <p className="cp-error">{errorMsg}</p>}
            </div>
          ) : (
            <div className="post-compose-split">
              {/* Image Preview Box */}
              <div className="compose-preview-box">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Post preview"
                  className="compose-img"
                />
              </div>

              {/* Caption & User Info */}
              <div className="compose-meta-box">
                <div className="compose-user-row">
                  <img src={profileImg} alt={user?.firstname} className="compose-avatar" />
                  <span className="compose-username">{user?.firstname} {user?.lastname}</span>
                </div>

                <textarea
                  className="compose-textarea"
                  placeholder="Write a caption..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  maxLength={2200}
                />

                <div className="compose-footer">
                  <span className="char-count">{desc.length}/2,200</span>
                </div>

                {errorMsg && <p className="cp-error">{errorMsg}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
