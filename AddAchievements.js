import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import '../PostManagement/AddNewPost.css';

function AddAchievements() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    postOwnerID: '',
    category: '',
    postOwnerName: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userID');
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({ ...prevData, postOwnerName: data.fullname }));
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
        method: 'POST',
        body: formData,
      });
      imageUrl = await uploadResponse.text();
    }

    const response = await fetch('http://localhost:8080/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, imageUrl }),
    });
    if (response.ok) {
      alert('Achievements added successfully!');
      window.location.href = '/myAchievements';
    } else {
      alert('Failed to add Achievements.');
    }
  };

  return (
    <div className="dark-container" style={{ 
      height: '100vh', 
      overflow: imagePreview ? 'auto' : 'hidden',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' 
    }}>
      <NavBar />
      <div className="post-content" style={{ 
        marginTop: '-90px', 
        height: 'calc(100vh + 90px)', 
        overflowY: 'visible', // Changed from 'auto' to 'visible' to prevent double scrollbar
        display: 'flex',
        justifyContent: 'center',
        alignItems: imagePreview ? 'flex-start' : 'center',
        paddingTop: imagePreview ? '90px' : '0',
        paddingBottom: imagePreview ? '30px' : '0'
      }}>
        <div className="post-card" style={{ 
          width: '100%', 
          maxWidth: '800px',
          margin: imagePreview ? '20px auto' : '0'
        }}>
          <h1>Add Achievement</h1>
          <p className="subtitle">Share your accomplishments with the community</p>

          <form onSubmit={handleSubmit} className="dark-form">
            <div className="media-grid">
              {imagePreview && (
                <div className="media-preview" style={{ position: 'relative', height: '150px', width: '350px' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ height: '150px', width: '350px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="file-input"
                className="file-input"
                required
              />
              <label htmlFor="file-input" className="upload-label">
                Choose Achievement Image
              </label>
            </div>

            <input
              type="text"
              name="title"
              placeholder="Achievement Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="dark-input"
            />

            <textarea
              name="description"
              placeholder="Achievement Description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="dark-input"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="dark-input"
              style={{ colorScheme: 'dark' }}
            />

            <button type="submit" className="submit-button" style={{ backgroundColor: '#4CAF50' }}>
              Add Achievement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAchievements;
