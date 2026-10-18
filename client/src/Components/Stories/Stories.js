import React, { useState, useEffect } from 'react';
import './Stories.css';
import { useSelector } from 'react-redux';
import { getAllUser } from '../../api/UserRequest';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const Stories = ({ onOpenCreate }) => {
  const { user } = useSelector((state) => state.authReducer.authData || {});
  const posts = useSelector((state) => state.postReducer.posts || []);
  const [users, setUsers] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUser();
        // filter out current user and take up to 8 users
        const others = (data || []).filter((u) => u._id !== user?._id).slice(0, 8);
        setUsers(others);
      } catch (err) {
        console.error("Error fetching story users:", err);
      }
    };
    fetchUsers();
  }, [user?._id]);

  const handleOpenStory = (storyUser) => {
    // Find if user has a post with image, else use a default/stock preview
    const userPost = posts.find((p) => p.userId === storyUser._id && p.image);
    setActiveStory({
      user: storyUser,
      image: userPost?.image ? serverPublic + userPost.image : (storyUser.profilePicture ? serverPublic + storyUser.profilePicture : serverPublic + "defaultCover.jpg"),
      desc: userPost?.desc || "Exploring new moments on Nexora ✨"
    });
  };

  return (
    <>
      <div className="stories-bar">
        {/* Current User Story item */}
        <div className="story-item current-user-story" onClick={onOpenCreate}>
          <div className="story-avatar-container no-ring">
            <img
              src={user?.profilePicture ? serverPublic + user.profilePicture : serverPublic + "defaultProfile.png"}
              alt="Your story"
              className="story-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = serverPublic + "defaultProfile.png";
              }}
            />
            <div className="add-story-badge" title="Create a post">
              <AddIcon style={{ fontSize: 13 }} />
            </div>
          </div>
          <span className="story-username">Your story</span>
        </div>

        {/* Other Users' Stories */}
        {users.map((u) => (
          <div
            key={u._id}
            className="story-item"
            onClick={() => handleOpenStory(u)}
          >
            <div className="story-avatar-container has-ring">
              <img
                src={u.profilePicture ? serverPublic + u.profilePicture : serverPublic + "defaultProfile.png"}
                alt={u.firstname}
                className="story-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = serverPublic + "defaultProfile.png";
                }}
              />
            </div>
            <span className="story-username">{u.firstname}</span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="story-viewer-backdrop" onClick={() => setActiveStory(null)}>
          <div className="story-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="story-progress-bar">
              <div className="story-progress-fill"></div>
            </div>

            <div className="story-viewer-header">
              <div className="story-viewer-author">
                <img
                  src={activeStory.user.profilePicture ? serverPublic + activeStory.user.profilePicture : serverPublic + "defaultProfile.png"}
                  alt={activeStory.user.firstname}
                  className="story-viewer-avatar"
                />
                <div>
                  <span className="story-viewer-name">{activeStory.user.firstname} {activeStory.user.lastname}</span>
                  <span className="story-viewer-time">2h ago</span>
                </div>
              </div>
              <button
                type="button"
                className="story-close-btn"
                onClick={() => setActiveStory(null)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="story-viewer-media">
              <img src={activeStory.image} alt="Story" />
              {activeStory.desc && (
                <div className="story-viewer-caption">
                  {activeStory.desc}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
