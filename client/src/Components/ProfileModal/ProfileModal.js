import React, { useState } from 'react';
import './ProfileModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { uploadImage } from '../../actions/UploadAction';
import { updateUser } from '../../actions/UserAction';
import CloseIcon from '@mui/icons-material/Close';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

function ProfileModal({ modalOpened, setModalOpened, data }) {
  const { password, ...other } = data || {};
  const [formData, setFormData] = useState(other || {});
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();
  const param = useParams();
  const { user } = useSelector((state) => state.authReducer.authData || {});
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  if (!modalOpened) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      event.target.name === "profileImage"
        ? setProfileImage(img)
        : setCoverImage(img);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    let UserData = { ...formData };

    if (profileImage) {
      const imgData = new FormData();
      const fileName = Date.now() + "_" + profileImage.name.replace(/\s+/g, '_');
      imgData.append("name", fileName);
      imgData.append("file", profileImage);
      UserData.profilePicture = fileName;

      try {
        await dispatch(uploadImage(imgData));
      } catch (error) {
        console.error("Profile image upload failed:", error);
      }
    }

    if (coverImage) {
      const cData = new FormData();
      const fileName = Date.now() + "_" + coverImage.name.replace(/\s+/g, '_');
      cData.append("name", fileName);
      cData.append("file", coverImage);
      UserData.coverPicture = fileName;

      try {
        await dispatch(uploadImage(cData));
      } catch (error) {
        console.error("Cover image upload failed:", error);
      }
    }

    try {
      await dispatch(updateUser(param.id || user._id, UserData));
    } catch (err) {
      console.error("User update failed:", err);
    } finally {
      setUpdating(false);
      setModalOpened(false);
    }
  };

  const currentAvatar = profileImage
    ? URL.createObjectURL(profileImage)
    : (formData.profilePicture ? serverPublic + formData.profilePicture : serverPublic + "defaultProfile.png");

  return (
    <div className="pm-backdrop" onClick={() => setModalOpened(false)}>
      <div className="pm-card" onClick={(e) => e.stopPropagation()}>
        <div className="pm-header">
          <button type="button" className="pm-close" onClick={() => setModalOpened(false)}>
            <CloseIcon />
          </button>
          <h3 className="pm-title">Edit Profile</h3>
          <button
            type="button"
            className="pm-save-btn"
            onClick={handleSubmit}
            disabled={updating}
          >
            {updating ? "Saving..." : "Done"}
          </button>
        </div>

        <form className="pm-form" onSubmit={handleSubmit}>
          {/* Avatar Change Row */}
          <div className="pm-avatar-row">
            <div className="pm-avatar-wrap">
              <img src={currentAvatar} alt="" className="pm-avatar-img" />
              <label htmlFor="profileImageInput" className="pm-avatar-badge" title="Change photo">
                <CameraAltOutlinedIcon style={{ fontSize: 16 }} />
              </label>
              <input
                id="profileImageInput"
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={onImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="pm-avatar-text">
              <span className="pm-username-label">{formData.firstname} {formData.lastname}</span>
              <label htmlFor="profileImageInput" className="pm-change-photo-link">
                Change profile photo
              </label>
            </div>
          </div>

          <div className="pm-fields-group">
            <div className="pm-field-row">
              <label className="pm-label">First Name</label>
              <input
                type="text"
                className="pm-input"
                name="firstname"
                onChange={handleChange}
                value={formData.firstname || ''}
              />
            </div>

            <div className="pm-field-row">
              <label className="pm-label">Last Name</label>
              <input
                type="text"
                className="pm-input"
                name="lastname"
                onChange={handleChange}
                value={formData.lastname || ''}
              />
            </div>

            <div className="pm-field-row">
              <label className="pm-label">Bio / Works At</label>
              <input
                type="text"
                className="pm-input"
                placeholder="Software Engineer, Creator..."
                name="worksAt"
                onChange={handleChange}
                value={formData.worksAt || ''}
              />
            </div>

            <div className="pm-field-row">
              <label className="pm-label">Lives In</label>
              <input
                type="text"
                className="pm-input"
                placeholder="City, State"
                name="livesin"
                onChange={handleChange}
                value={formData.livesin || ''}
              />
            </div>

            <div className="pm-field-row">
              <label className="pm-label">Country</label>
              <input
                type="text"
                className="pm-input"
                placeholder="Country"
                name="country"
                onChange={handleChange}
                value={formData.country || ''}
              />
            </div>

            <div className="pm-field-row">
              <label className="pm-label">Relationship</label>
              <input
                type="text"
                className="pm-input"
                placeholder="Single, Married, etc."
                name="relationship"
                onChange={handleChange}
                value={formData.relationship || ''}
              />
            </div>
          </div>

          {/* Cover Photo */}
          <div className="pm-cover-section">
            <label className="pm-label">Cover Photo</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={onImageChange}
              className="pm-file-input"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;