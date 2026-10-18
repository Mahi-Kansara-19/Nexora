import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as UserApi from '../../api/UserRequest';
import { followUser, unFollowUser } from '../../actions/UserAction';

// Navigation & Modals
import Sidebar from '../../Components/Navigation/Sidebar';
import TopNav from '../../Components/Navigation/TopNav';
import BottomNav from '../../Components/Navigation/BottomNav';
import ProfileModal from '../../Components/ProfileModal/ProfileModal';
import CreatePostModal from '../../Components/CreatePostModal/CreatePostModal';
import SearchModal from '../../Components/SearchModal/SearchModal';
import ExploreModal from '../../Components/ExploreModal/ExploreModal';

// Material-UI Icons
import GridOnIcon from '@mui/icons-material/GridOn';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';

const Profile = () => {
  const params = useParams();
  const profileUserId = params.id;
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.authReducer.authData || {});
  const posts = useSelector((state) => state.postReducer.posts || []);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  const [profileUser, setProfileUser] = useState({});
  const [modalOpened, setModalOpened] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [exploreModalOpen, setExploreModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);

  const isOwnProfile = profileUserId === user?._id;
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isOwnProfile) {
        setProfileUser(user);
        setIsFollowing(false);
      } else {
        try {
          const { data } = await UserApi.getUser(profileUserId);
          setProfileUser(data);
          setIsFollowing((data.followers || []).includes(user?._id));
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      }
    };

    fetchProfile();
  }, [user, profileUserId, isOwnProfile]);

  const handleFollowToggle = () => {
    if (!user?._id || !profileUser?._id) return;
    if (isFollowing) {
      dispatch(unFollowUser(profileUser._id, user));
      setIsFollowing(false);
      setProfileUser((prev) => ({
        ...prev,
        followers: (prev.followers || []).filter((id) => id !== user._id)
      }));
    } else {
      dispatch(followUser(profileUser._id, user));
      setIsFollowing(true);
      setProfileUser((prev) => ({
        ...prev,
        followers: [...(prev.followers || []), user._id]
      }));
    }
  };

  // Filter posts created by this profile user
  const userPosts = posts.filter((post) => post.userId === profileUserId);

  const profileImg = profileUser.profilePicture
    ? serverPublic + profileUser.profilePicture
    : serverPublic + "defaultProfile.png";

  return (
    <div className="Profile-page-layout">
      {/* Fixed Left Sidebar */}
      <Sidebar
        onOpenCreate={() => setCreateModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenExplore={() => setExploreModalOpen(true)}
      />

      {/* Mobile Top Bar */}
      <TopNav
        onOpenCreate={() => setCreateModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Center Profile View */}
      <main className="Profile-main-container">
        <div className="Profile-content-wrap">
          {/* Header Section */}
          <header className="profile-header">
            {/* Avatar */}
            <div className="profile-avatar-column">
              <div className="profile-avatar-outer">
                <img
                  src={profileImg}
                  alt={profileUser.firstname}
                  className="profile-big-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = serverPublic + "defaultProfile.png";
                  }}
                />
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="profile-details-column">
              {/* Row 1: Handle & Actions */}
              <div className="profile-actions-row">
                <h2 className="profile-handle">
                  {profileUser.firstname}_{profileUser.lastname}
                </h2>

                {isOwnProfile ? (
                  <button
                    type="button"
                    className="ig-btn-secondary edit-profile-btn"
                    onClick={() => setModalOpened(true)}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    type="button"
                    className={isFollowing ? "ig-btn-secondary" : "ig-btn-primary"}
                    onClick={handleFollowToggle}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              {/* Row 2: Stats Counter */}
              <div className="profile-stats-row">
                <span className="stat-item">
                  <b>{userPosts.length}</b> posts
                </span>
                <span className="stat-item">
                  <b>{(profileUser.followers || []).length}</b> followers
                </span>
                <span className="stat-item">
                  <b>{(profileUser.following || []).length}</b> following
                </span>
              </div>

              {/* Row 3: Bio & Metadata */}
              <div className="profile-bio-box">
                <span className="profile-fullname">
                  {profileUser.firstname} {profileUser.lastname}
                </span>

                {profileUser.worksAt && (
                  <p className="profile-bio-text">{profileUser.worksAt}</p>
                )}

                <div className="profile-chips">
                  {profileUser.livesin && (
                    <span className="profile-chip">📍 {profileUser.livesin}</span>
                  )}
                  {profileUser.country && (
                    <span className="profile-chip">🌍 {profileUser.country}</span>
                  )}
                  {profileUser.relationship && (
                    <span className="profile-chip">❤️ {profileUser.relationship}</span>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Profile Tabs */}
          <div className="profile-tabs-bar">
            <button
              type="button"
              className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              <GridOnIcon fontSize="small" />
              <span>POSTS</span>
            </button>

            {isOwnProfile && (
              <button
                type="button"
                className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
                onClick={() => setActiveTab('saved')}
              >
                <BookmarkBorderOutlinedIcon fontSize="small" />
                <span>SAVED</span>
              </button>
            )}
          </div>

          {/* Posts Grid Area */}
          <div className="profile-grid-area">
            {activeTab === 'saved' ? (
              <div className="profile-empty-posts">
                <div className="pe-icon-wrap">
                  <BookmarkBorderOutlinedIcon style={{ fontSize: 48 }} />
                </div>
                <h3>Save Posts</h3>
                <p>Save photos and videos that you want to see again. No one is notified.</p>
              </div>
            ) : userPosts.length === 0 ? (
              <div className="profile-empty-posts">
                <div className="pe-icon-wrap">
                  <CameraAltOutlinedIcon style={{ fontSize: 48 }} />
                </div>
                <h3>No Posts Yet</h3>
                <p>
                  {isOwnProfile
                    ? "Capture and share moments with friends on Nexora."
                    : "When this user shares moments, they will appear here."}
                </p>
                {isOwnProfile && (
                  <button
                    type="button"
                    className="ig-btn-primary"
                    style={{ marginTop: 14 }}
                    onClick={() => setCreateModalOpen(true)}
                  >
                    Share your first photo
                  </button>
                )}
              </div>
            ) : (
              <div className="profile-posts-grid">
                {userPosts.map((post) => (
                  <div
                    key={post._id}
                    className="profile-post-card"
                    onClick={() => setSelectedPost(post)}
                  >
                    {post.image ? (
                      <img
                        src={serverPublic + post.image}
                        alt={post.desc || "Post thumbnail"}
                        className="profile-post-thumb"
                      />
                    ) : (
                      <div className="profile-text-post-thumb">
                        <p>{post.desc}</p>
                      </div>
                    )}
                    <div className="profile-post-overlay">
                      <span className="post-overlay-stat">
                        <FavoriteIcon fontSize="small" />
                        {(post.likes || []).length}
                      </span>
                      <span className="post-overlay-stat">
                        <ChatBubbleIcon fontSize="small" />
                        0
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Post Detail Lightbox Modal */}
      {selectedPost && (
        <div className="post-lightbox-backdrop" onClick={() => setSelectedPost(null)}>
          <div className="post-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-side">
              {selectedPost.image ? (
                <img src={serverPublic + selectedPost.image} alt="" />
              ) : (
                <div className="lightbox-text-only">
                  <p>{selectedPost.desc}</p>
                </div>
              )}
            </div>
            <div className="lightbox-info-side">
              <div className="lightbox-header">
                <div className="lightbox-author">
                  <img src={profileImg} alt="" className="lightbox-avatar" />
                  <span className="lightbox-author-name">
                    {profileUser.firstname} {profileUser.lastname}
                  </span>
                </div>
                <button
                  type="button"
                  className="lightbox-close"
                  onClick={() => setSelectedPost(null)}
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="lightbox-caption-box">
                <span className="lightbox-caption-user">
                  {profileUser.firstname}_{profileUser.lastname}
                </span>
                <p>{selectedPost.desc || "No caption."}</p>
              </div>

              <div className="lightbox-stats-footer">
                <div className="lightbox-likes">
                  <FavoriteIcon style={{ color: "var(--ig-red)", fontSize: 20 }} />
                  <span>{(selectedPost.likes || []).length} likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav
        onOpenCreate={() => setCreateModalOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenExplore={() => setExploreModalOpen(true)}
      />

      {/* Modals */}
      {isOwnProfile && (
        <ProfileModal
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
          data={user}
        />
      )}

      <CreatePostModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <ExploreModal
        isOpen={exploreModalOpen}
        onClose={() => setExploreModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
