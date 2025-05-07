import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
function UpdatePost() {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [existingMedia, setExistingMedia] = useState([]); // Initialize as an empty array
  const [newMedia, setNewMedia] = useState([]); // New media files to upload
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Fetch the post details
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || ''); // Ensure title is not undefined
        setDescription(post.description || ''); // Ensure description is not undefined
        setCategory(post.category || ''); // Set category
        setExistingMedia(post.media || []); // Ensure media is an array
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Failed to fetch post details.');
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchPost();
  }, [id]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this media file?');
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setExistingMedia(existingMedia.filter((url) => url !== mediaUrl)); // Remove from UI
      alert('Media file deleted successfully!');
    } catch (error) {
      console.error('Error deleting media file:', error);
      alert('Failed to delete media file.');
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const maxImageCount = 3;

    let imageCount = existingMedia.filter((url) => !url.endsWith('.mp4')).length;
    let videoCount = existingMedia.filter((url) => url.endsWith('.mp4')).length;

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert('You can upload a maximum of 3 images.');
          return;
        }
      } else if (file.type === 'video/mp4') {
        videoCount++;
        if (videoCount > 1) {
          alert('You can upload only 1 video.');
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
    }

    setNewMedia(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category); // Include category in the update
    newMedia.forEach((file) => formData.append('newMediaFiles', file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post updated successfully!');
      navigate('/allPost');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post.');
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  return (
    <div className="dark-container" style={{ 
      height: '100vh', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' 
    }}>
      <NavBar />
      <div className="post-content" style={{ 
        marginTop: '-90px', 
        height: 'calc(100vh + 90px)', 
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="post-card" style={{ 
          width: '100%',
          maxWidth: '800px'
        }}>
          <h1>Update Post</h1>
          <p className="subtitle">Edit your post details below</p>

          <form onSubmit={handleSubmit} className="dark-form">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="dark-input"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="dark-input"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="dark-input"
              style={{ color: 'white' }}
            >
              <option value="" disabled>Select Category</option>
              <option value="Coding">Coding</option>
              <option value="Photography">Photography</option>
              <option value="Cooking">Cooking</option>
              <option value="DIY Crafts">DIY Crafts</option>
            </select>

            <div className="media-grid" style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '15px'
            }}>
              {existingMedia.map((mediaUrl, index) => (
                <div key={index} className="media-preview" style={{ 
                  position: 'relative',
                  width: '350px',
                  height: '150px',
                  overflow: 'hidden',
                  borderRadius: '8px'
                }}>
                  {mediaUrl.endsWith('.mp4') ? (
                    <video controls style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                      <source src={`http://localhost:8080${mediaUrl}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={`http://localhost:8080${mediaUrl}`} 
                      alt={`Media ${index}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  <button 
                    className="close-modal-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteMedia(mediaUrl);
                    }}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      zIndex: 1,
                      background: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="file-upload">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,video/mp4"
                multiple
                onChange={handleNewMediaChange}
                id="file-input"
                className="file-input"
              />
              <label htmlFor="file-input" className="upload-label" style={{
                display: 'block',
                padding: '0.875rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#94a3b8',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '15px'
              }}>
                Choose New Files
              </label>
            </div>

            <button type="submit" className="submit-button" style={{ backgroundColor: '#4CAF50' }}>
              Update Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
