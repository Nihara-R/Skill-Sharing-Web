import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd } from "react-icons/io";
import './post.css';
import './Templates.css'; // Import the updated CSS file
import NavBar from '../../Components/NavBar/NavBar';
import { FaVideo } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";

function AddLearningPlan() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentURL, setContentURL] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContentURLInput, setShowContentURLInput] = useState(false);
  const [showImageUploadInput, setShowImageUploadInput] = useState(false);
  const [templateID, setTemplateID] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() !== '') {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (startDate === endDate) {
      alert("Start date and end date cannot be the same.");
      setIsSubmitting(false);
      return;
    }

    if (startDate > endDate) {
      alert("Start date cannot be greater than end date.");
      setIsSubmitting(false);
      return;
    }

    const postOwnerID = localStorage.getItem('userID');
    const postOwnerName = localStorage.getItem('userFullName');

    if (!postOwnerID) {
      alert('Please log in to add a post.');
      navigate('/');
      return;
    }

    if (tags.length < 2) {
      alert("Please add at least two tags.");
      setIsSubmitting(false);
      return;
    }

    if (!templateID) {
      alert("Please select a template.");
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        const uploadResponse = await axios.post('http://localhost:8080/learningPlan/planUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data;
      }

      // Create the new post object
      const newPost = {
        title,
        description,
        contentURL,
        tags,
        postOwnerID,
        postOwnerName,
        imageUrl,
        templateID,
        startDate, // New field
        endDate,   // New field
        category   // New field
      };

      // Submit the post data
      await axios.post('http://localhost:8080/learningPlan', newPost);
      alert('Post added successfully!');
      navigate('/allLearningPlan');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="dark-container" style={{ 
      minHeight: '100vh', 
      overflow: 'auto',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' 
    }}>
      <NavBar />
      <div className="learning-plan-content" style={{ 
        marginTop: '60px', 
        paddingBottom: '2rem' 
      }}>
        <div className="template-preview-container">
          {/* Template 1 */}
          <div className="template template-1">
            <p className='template_id_one'>template 1</p>
            <p className='template_title'>{title || "Title Preview"}</p>
            <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
            <p className='template_description'>{category}</p>
            <hr></hr>
            <p className='template_description'>{description || "Description Preview"}</p>
            <div className="tags_preview">
              {tags.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
            {imagePreview && <img src={imagePreview} alt="Preview" className="iframe_preview" />}
            {contentURL && (
              <iframe
                src={getEmbedURL(contentURL)}
                title="Content Preview"
                className="iframe_preview"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
          </div>
          {/* Template 2 */}
          <div className="template template-2">
            <p className='template_id_one'>template 2</p>
            <p className='template_title'>{title || "Title Preview"}</p>
            <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
            <p className='template_description'>{category}</p>
            <hr></hr>
            <p className='template_description'>{description || "Description Preview"}</p>
            <div className="tags_preview">
              {tags.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
            <div className='preview_part'>
              <div className='preview_part_sub'>
                {imagePreview && <img src={imagePreview} alt="Preview" className="iframe_preview_new" />}
              </div>
              <div className='preview_part_sub'>
                {contentURL && (
                  <iframe
                    src={getEmbedURL(contentURL)}
                    title="Content Preview"
                    className="iframe_preview_new"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
          {/* Template 3 */}
          <div className="template template-3">
            <p className='template_id_one'>template 3</p>
            {imagePreview && <img src={imagePreview} alt="Preview" className="iframe_preview" />}
            {contentURL && (
              <iframe
                src={getEmbedURL(contentURL)}
                title="Content Preview"
                className="iframe_preview"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
            <p className='template_title'>{title || "Title Preview"}</p>
            <p className='template_dates'><HiCalendarDateRange /> {startDate} to {endDate} </p>
            <p className='template_description'>{category}</p>
            <hr></hr>
            <p className='template_description'>{description || "Description Preview"}</p>
            <div className="tags_preview">
              {tags.map((tag, index) => (
                <span key={index} className="tagname">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-container">
          <div className="post-card">
            <h1>Create Learning Plan</h1>
            <p className="subtitle">Share your learning journey with the community</p>

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

              <div className="tag-input-container">
                <div className="tags-display">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                      <button 
                        type="button" 
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      >×</button>
                    </span>
                  ))}
                </div>
                <div className="tag-input-wrapper" style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Add tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="dark-input"
                    style={{ paddingRight: '40px' }}
                  />
                  <button 
                    type="button" 
                    onClick={handleAddTag} 
                    className="add-tag-btn"
                    style={{
                      position: 'absolute',
                      right: '5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                  >
                    <IoMdAdd />
                  </button>
                </div>
              </div>

              <select
                value={templateID || ""}
                onChange={(e) => setTemplateID(Number(e.target.value))}
                required
                className="dark-input"
                style={{ color: templateID ? 'white' : 'white' }}
              >
                <option value="" disabled>Select Template</option>
                <option value="1">Template 1</option>
                <option value="2">Template 2</option>
                <option value="3">Template 3</option>
              </select>

              <div className="date-inputs">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="dark-input"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="dark-input"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="dark-input"
                style={{ color: category ? 'white' : 'white' }}
              >
                <option value="" disabled>Select Category</option>
                <option value="Coding">Coding</option>
                <option value="Photography">Photography</option>
                <option value="Cooking">Cooking</option>
                <option value="DIY Crafts">DIY Crafts</option>
              </select>

              <div className="media-controls">
                <button 
                  type="button" 
                  className="media-toggle-btn"
                  onClick={() => setShowContentURLInput(!showContentURLInput)}
                >
                  <FaVideo /> Add Video
                </button>
                <button 
                  type="button" 
                  className="media-toggle-btn"
                  onClick={() => setShowImageUploadInput(!showImageUploadInput)}
                >
                  <FaImage /> Add Image
                </button>
              </div>

              {showContentURLInput && (
                <input
                  type="url"
                  placeholder="Content URL"
                  value={contentURL}
                  onChange={(e) => setContentURL(e.target.value)}
                  className="dark-input"
                />
              )}

              {showImageUploadInput && (
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="file-input"
                    className="file-input"
                  />
                  <label htmlFor="file-input" className="upload-label">
                    Choose Image
                  </label>
                </div>
              )}

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}

              <button type="submit" className="submit-button" disabled={isSubmitting} style={{ backgroundColor: '#4CAF50' }}>
                {isSubmitting ? 'Creating Plan...' : 'Create Learning Plan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLearningPlan;