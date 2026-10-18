import React, { useEffect } from 'react';
import './Posts.css';
import Post from '../Post/Post';
import { useDispatch, useSelector } from 'react-redux';
import { getTimelinePosts } from '../../actions/PostAction';
import { useParams } from 'react-router-dom';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';

const Posts = ({ onOpenCreate }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData || {});
  let { posts, loading } = useSelector((state) => state.postReducer);

  useEffect(() => {
    if (user?._id) {
      dispatch(getTimelinePosts(user._id));
    }
  }, [user, dispatch]);

  if (!posts) posts = [];
  if (params.id) {
    posts = posts.filter((post) => post.userId === params.id);
  }

  if (loading) {
    return (
      <div className="posts-skeleton-feed">
        {[1, 2].map((n) => (
          <div key={n} className="post-skeleton-card">
            <div className="skeleton-header">
              <div className="skeleton-circle"></div>
              <div className="skeleton-line-wrap">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line tiny"></div>
              </div>
            </div>
            <div className="skeleton-media"></div>
            <div className="skeleton-footer">
              <div className="skeleton-line full"></div>
              <div className="skeleton-line medium"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="posts-empty-state">
        <div className="empty-icon-circle">
          <PhotoCameraOutlinedIcon style={{ fontSize: 44 }} />
        </div>
        <h3 className="empty-title">No Posts Yet</h3>
        <p className="empty-subtitle">
          {params.id
            ? "This user hasn't posted anything yet."
            : "When people you follow share photos and moments, they will appear here in your feed."}
        </p>
        {!params.id && onOpenCreate && (
          <button
            type="button"
            className="ig-btn-primary"
            onClick={onOpenCreate}
            style={{ marginTop: 12 }}
          >
            Share your first post
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="Posts">
      {posts.map((post, id) => (
        <Post data={post} key={post._id || id} id={id} />
      ))}
    </div>
  );
};

export default Posts;
