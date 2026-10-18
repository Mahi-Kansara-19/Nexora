import React, { useState } from 'react';
import './Post.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { likePost } from '../../api/PostRequest';

// Material-UI Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const Post = ({ data }) => {
  const { user } = useSelector((state) => state.authReducer.authData || {});
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER || "http://localhost:5000/images/";

  const [liked, setLiked] = useState((data.likes || []).includes(user?._id));
  const [likes, setLikes] = useState((data.likes || []).length);
  const [saved, setSaved] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([
    {
      id: 1,
      author: "alex_dev",
      text: "Awesome shot! ✨"
    }
  ]);
  const [showMenu, setShowMenu] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const handleLike = () => {
    if (!user?._id) return;
    setLiked((prev) => !prev);
    likePost(data._id, user._id);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleDoubleTap = () => {
    if (!liked) {
      handleLike();
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentsList([
      ...commentsList,
      {
        id: Date.now(),
        author: `${user?.firstname || 'you'}`.toLowerCase(),
        text: commentText.trim()
      }
    ]);
    setCommentText('');
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/post/${data._id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(postUrl);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    }
    setShowMenu(false);
  };

  // Format time elapsed
  const formatTime = (createdAt) => {
    if (!createdAt) return 'RECENTLY';
    const diffHours = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60));
    if (diffHours < 1) return 'JUST NOW';
    if (diffHours < 24) return `${diffHours} HOURS AGO`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} DAYS AGO`;
  };

  const authorName = data.name || (data.userId === user?._id ? `${user.firstname} ${user.lastname}` : `user_${data.userId?.slice(-4)}`);

  return (
    <article className="ig-post-card">
      {/* Post Header */}
      <div className="post-header">
        <Link to={`/profile/${data.userId}`} className="post-author-link">
          <div className="story-avatar-wrap no-ring">
            <img
              src={publicFolder + "defaultProfile.png"}
              alt={authorName}
              className="story-avatar-img post-author-avatar"
            />
          </div>
          <div className="post-author-info">
            <span className="post-author-name">{authorName}</span>
            <span className="post-author-sub">Nexora</span>
          </div>
        </Link>

        <div className="post-menu-container">
          <button
            type="button"
            className="post-menu-trigger"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="More options"
          >
            <MoreHorizIcon />
          </button>

          {showMenu && (
            <div className="post-menu-dropdown">
              <button type="button" onClick={handleCopyLink}>Copy Link</button>
              <Link to={`/profile/${data.userId}`} onClick={() => setShowMenu(false)}>
                Visit Profile
              </Link>
              <button type="button" onClick={() => setShowMenu(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* Post Media */}
      {data.image && (
        <div className="post-media-wrap" onDoubleClick={handleDoubleTap}>
          <img
            src={publicFolder + data.image}
            alt={data.desc || "Post photo"}
            className="post-media-img"
          />
          {showHeartAnim && (
            <div className="floating-heart">
              <FavoriteIcon style={{ fontSize: 90 }} />
            </div>
          )}
        </div>
      )}

      {/* Action Buttons Bar */}
      <div className="post-actions-bar">
        <div className="post-actions-left">
          <button
            type="button"
            className={`action-btn ${liked ? 'heart-animated' : ''}`}
            onClick={handleLike}
            aria-label="Like"
          >
            {liked ? (
              <FavoriteIcon style={{ color: "var(--ig-red)" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </button>

          <button
            type="button"
            className="action-btn"
            onClick={() => document.getElementById(`comment-input-${data._id}`)?.focus()}
            aria-label="Comment"
          >
            <ChatBubbleOutlineIcon />
          </button>

          <button
            type="button"
            className="action-btn"
            onClick={handleCopyLink}
            aria-label="Share"
          >
            <SendOutlinedIcon />
          </button>
        </div>

        <button
          type="button"
          className="action-btn"
          onClick={() => setSaved((prev) => !prev)}
          aria-label="Save"
        >
          {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </button>
      </div>

      {/* Likes Count */}
      <div className="post-likes-section">
        <span className="post-likes-text">
          {likes === 1 ? "1 like" : `${likes} likes`}
        </span>
      </div>

      {/* Caption */}
      {data.desc && (
        <div className="post-caption-section">
          <span className="caption-author">{authorName}</span>
          <span className="caption-text">{data.desc}</span>
        </div>
      )}

      {/* Comments List */}
      <div className="post-comments-section">
        {commentsList.map((c) => (
          <div key={c.id} className="comment-row">
            <span className="comment-author">{c.author}</span>
            <span className="comment-text">{c.text}</span>
          </div>
        ))}
      </div>

      {/* Timestamp */}
      <div className="post-timestamp">
        {formatTime(data.createdAt)}
      </div>

      {/* Add Comment Input */}
      <form className="post-comment-form" onSubmit={handleAddComment}>
        <SentimentSatisfiedAltIcon className="comment-emoji-icon" />
        <input
          id={`comment-input-${data._id}`}
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="comment-input"
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={!commentText.trim()}
        >
          Post
        </button>
      </form>

      {/* Toast Feedback */}
      {copyToast && <div className="post-copy-toast">Link copied to clipboard</div>}
    </article>
  );
};

export default Post;
