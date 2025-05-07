import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';
import { HiCalendarDateRange } from "react-icons/hi2";

function AllLearningPlan() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchOwnerName, setSearchOwnerName] = useState('');
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learningPlan');
        setPosts(response.data);
        setFilteredPosts(response.data); // Initially show all posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []); // Ensure this runs only once on component mount

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // Return the original URL if it's not a YouTube link
    } catch (error) {
      console.error('Invalid URL:', url);
      return ''; // Return an empty string for invalid URLs
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/learningPlan/${id}`);
        alert('Post deleted successfully!');
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id)); // Update the list after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/updateLearningPlan/${id}`;
  };

  const renderPostByTemplate = (post) => {
    console.log('Rendering post:', post); // Debugging: Log the post object
    if (!post.templateID) { // Use the correct field name
      console.warn('Missing templateID for post:', post); // Warn if templateID is missing
      return <div className="template template-default">Invalid template ID</div>;
    }

    switch (post.templateID) { // Use the correct field name
      case 1:
        return (
          <div className="template_dis template-1">
            <div className='user_details_card'>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ color: 'white' }}>{post.postOwnerName}</p>
                </div>
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post'>
                  <FaEdit
                    onClick={() => handleUpdate(post.id)} 
                    className='action_btn_icon' 
                    style={{ color: 'white' }}
                  />
                  <RiDeleteBin6Fill
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon'
                    style={{ color: 'white' }}
                  />
                </div>
              )}
            </div>
            <p className='template_title' style={{ color: 'white' }}>{post.title}</p>
            <p className='template_dates'><HiCalendarDateRange style={{ color: 'white' }} /> {post.startDate} to {post.endDate} </p>
            <p className='template_description' style={{ color: 'white' }}>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ whiteSpace: "pre-line", color: 'white' }}>{post.description}</p>
            <div className="tags_preview">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname" style={{ color: 'white' }}>#{tag}</span>
              ))}
            </div>
            {post.imageUrl && (
              <img
                src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                alt={post.title}
                className="iframe_preview_dis"
              />
            )}
            {post.contentURL && (
              <iframe
                src={getEmbedURL(post.contentURL)}
                title={post.title}
                className="iframe_preview_dis"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
          </div>
        );
      case 2:
        return (
          <div className="template_dis template-2">
            <div className='user_details_card'>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ color: 'white' }}>{post.postOwnerName}</p>
                </div>
                
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post'>
                  <FaEdit
                    onClick={() => handleUpdate(post.id)} 
                    className='action_btn_icon' 
                    style={{ color: 'white' }}
                  />
                  <RiDeleteBin6Fill
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon'
                    style={{ color: 'white' }}
                  />
                </div>
              )}
            </div>
            <p className='template_title' style={{ color: 'white' }}>{post.title}</p>
            <p className='template_dates'><HiCalendarDateRange style={{ color: 'white' }} /> {post.startDate} to {post.endDate} </p>
            <p className='template_description' style={{ color: 'white' }}>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ whiteSpace: "pre-line", color: 'white' }}>{post.description}</p>
            <div className="tags_preview">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname" style={{ color: 'white' }}>#{tag}</span>
              ))}
            </div>
            <div className='preview_part'>
              <div className='preview_part_sub'>
                {post.imageUrl && (
                  <img
                    src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                    alt={post.title}
                    className="iframe_preview"
                  />
                )}
              </div>
              <div className='preview_part_sub'>
                {post.contentURL && (
                  <iframe
                    src={getEmbedURL(post.contentURL)}
                    title={post.title}
                    className="iframe_preview"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="template_dis template-3">
            <div className='user_details_card'>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ color: 'white' }}>{post.postOwnerName}</p>
                </div>
                
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post'>
                  <FaEdit
                    onClick={() => handleUpdate(post.id)} 
                    className='action_btn_icon' 
                    style={{ color: 'white' }}
                  />
                  <RiDeleteBin6Fill
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon'
                    style={{ color: 'white' }}
                  />
                </div>
              )}
            </div>
            {post.imageUrl && (
              <img
                src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                alt={post.title}
                className="iframe_preview_dis"
              />
            )}
            {post.contentURL && (
              <iframe
                src={getEmbedURL(post.contentURL)}
                title={post.title}
                className="iframe_preview_dis"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
            <p className='template_title' style={{ color: 'white' }}>{post.title}</p>
            <p className='template_dates'><HiCalendarDateRange style={{ color: 'white' }} /> {post.startDate} to {post.endDate} </p>
            <p className='template_description' style={{ color: 'white' }}>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ whiteSpace: "pre-line", color: 'white' }}>{post.description}</p>
            <div className="tags_preview">
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname" style={{ color: 'white' }}>#{tag}</span>
              ))}
            </div>
          </div>
        );
      default:
        console.warn('Unknown templateID:', post.templateID); // Warn if templateID is unexpected
        return (
          <div className="template template-default">
            <p>Unknown template ID: {post.templateID}</p>
          </div>
        );
    }
  };

  return (
    <div className="dark-container" style={{ 
      minHeight: '100vh',  // Changed from height to minHeight
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' 
      // Removed overflow: 'hidden' to allow scrolling
    }}>
      <div className='continer'>
        <NavBar />
        <div className='post-content' style={{ 
          paddingBottom: '2rem',  // Add padding at the bottom for better spacing
          overflowY: 'auto'  // Enable vertical scrolling 
        }}>
          <div className="floating-search-container" style={{ marginTop: '10px' }}>
            <div className="search-box">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchOwnerName}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchOwnerName(value);
                  setFilteredPosts(
                    posts.filter((post) =>
                      post.postOwnerName.toLowerCase().includes(value.toLowerCase())
                    )
                  );
                }}
                className="floating-search"
              />
              <i className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </i>
            </div>
            <div className="search-actions">
              <button 
                className="create-new-btn" 
                onClick={() => (window.location.href = '/addLearningPlan')}
                style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}
              >
                <span>+</span> Create Learning Plan
              </button>
            </div>
          </div>
          
          <div className='post_card_continer'>
            {filteredPosts.length === 0 ? (
              <div className='not_found_box'>
                <div className='not_found_img'></div>
                <p className='not_found_msg'>No posts found. Please create a new post.</p>
                <button className='not_found_btn' onClick={() => (window.location.href = '/addLearningPlan')}>Create New Post</button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className='post_card_new'>
                  {renderPostByTemplate(post)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllLearningPlan;