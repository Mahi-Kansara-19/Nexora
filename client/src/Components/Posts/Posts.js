import React, { useEffect } from 'react'
import './Posts.css';
import Post from '../Post/Post';
import { useDispatch, useSelector } from 'react-redux';
import { getTimelinePosts } from '../../actions/PostAction';
import { useParams } from 'react-router-dom';

const Posts = () => {

  const params = useParams();
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.authReducer.authData)
  let { posts, loading } = useSelector((state) => state.postReducer)


  useEffect(() => {
    if (user?._id) {
      dispatch(getTimelinePosts(user._id));
    }
  }, [user]);


  if (!posts) posts = [];
  if (params.id) {
    posts = posts.filter((post) => post.userId === params.id)
  }

  return (
    <div className='Posts'>

      {loading ? "Fetching Posts..." :
        posts.length === 0 ? "No Posts Available" :
        posts.map((post, id) => {
          return <Post data={post} key={post._id || id} id={id} />
        })}

    </div>
  )
}

export default Posts
