import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../Components/NavBar/NavBar';

function UpdateAchievements() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    postOwnerID: '',
    postOwnerName: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch achievement');
        }
        const data = await response.json();
        setFormData(data);
        if (data.imageUrl) {
          setPreviewImage(`http://localhost:8080/achievements/images/${data.imageUrl}`);
        }
      } catch (error) {
        console.error('Error fetching Achievements data:', error);
        alert('Error loading achievement data');
      }
    };
    fetchAchievement();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        
        const uploadResponse = await fetch('http://localhost:8080/achievements/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Image upload failed');
        }
        imageUrl = await uploadResponse.text();
      }

      // Update achievement data
      const updatedData = { ...formData, imageUrl };
      const response = await fetch(`http://localhost:8080/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        alert('Achievement updated successfully!');
        window.location.href = '/allAchievements';
      } else {
        throw new Error('Failed to update achievement');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'An error occurred during update');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark-container" style={{ 
      height: '100vh', 
      overflow: previewImage ? 'auto' : 'hidden',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' 
    }}>
      <NavBar />
      <div className="post-content" style={{ 
        marginTop: '-90px', 
        height: 'calc(100vh + 90px)', 
        overflowY: 'visible',
        display: 'flex',
        justifyContent: 'center',
        alignItems: previewImage ? 'flex-start' : 'center',
        paddingTop: previewImage ? '90px' : '0',
        paddingBottom: previewImage ? '30px' : '0'
      }}>
        <div className="post-card" style={{ 
          width: '100%', 
          maxWidth: '800px',
          margin: previewImage ? '20px auto' : '0'
        }}>
          <h1>Update Achievement</h1>
          <p className="subtitle">Update your accomplishment details</p>

          <form onSubmit={handleSubmit} className="dark-form">
            <div className="media-grid">
              {previewImage && (
                <div className="media-preview" style={{ position: 'relative', height: '150px', width: '350px' }}>
                  <img 
                    src={previewImage} 
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
                onChange={handleFileChange}
                id="file-input"
                className="file-input"
              />
              <label htmlFor="file-input" className="upload-label">
                Choose New Achievement Image
              </label>
            </div>

            <input
              type="text"
              name="title"
              placeholder="Achievement Title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="dark-input"
            />

            <textarea
              name="description"
              placeholder="Achievement Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="dark-input"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
              className="dark-input"
              style={{ 
                colorScheme: 'dark',
                color: 'white',
                '::-webkit-calendar-picker-indicator': {
                  filter: 'invert(1)'
                }
              }}
            />

            <button 
              type="submit" 
              className="submit-button" 
              disabled={isLoading}
              style={{ backgroundColor: '#4CAF50' }}
            >
              {isLoading ? 'Updating...' : 'Update Achievement'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateAchievements;