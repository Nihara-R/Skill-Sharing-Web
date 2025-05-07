import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../Components/NavBar/NavBar';
import './AddNewPost.css';

function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [categories, setCategories] = useState('');
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;

    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        window.location.reload();
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            window.location.reload();
          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);
        window.location.reload();
      }

      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');
      window.location.reload();
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');
      window.location.reload();
    }

    setMedia(files);
    setMediaPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', categories);
    media.forEach((file, index) => formData.append(`mediaFiles`, file));

    try {
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      window.location.href = '/myAllPost';
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
      window.location.reload();
    }
  };

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
        <div className="post-card" style={{ width: '100%', maxWidth: '800px' }}>
          <h1>Create New Post</h1>
          <p className="subtitle">Share your thoughts with the community</p>

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
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
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

            <div className="media-grid">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="media-preview" style={{ position: 'relative', height: '150px', width: '350px' }}>
                  {preview.type.startsWith('video/') ? (
                    <video controls style={{ height: '150px', width: '350px', objectFit: 'cover' }}>
                      <source src={preview.url} type={preview.type} />
                    </video>
                  ) : (
                    <img 
                      src={preview.url} 
                      alt={`Preview ${index}`} 
                      style={{ height: '150px', width: '350px', objectFit: 'cover' }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="file-upload">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,video/mp4"
                multiple
                onChange={handleMediaChange}
                id="file-input"
                className="file-input"
              />
              <label htmlFor="file-input" className="upload-label">
                Choose Files
              </label>
            </div>

            <button type="submit" className="submit-button" style={{ backgroundColor: '#4CAF50' }}>
              Create Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
