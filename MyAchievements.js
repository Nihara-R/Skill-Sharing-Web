import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import NavBar from '../../Components/NavBar/NavBar';
import { IoIosCreate } from "react-icons/io";
import Modal from 'react-modal';

Modal.setAppElement('#root'); // This is important for accessibility

function MyAchievements() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/achievements')
      .then((response) => response.json())
      .then((data) => {
        const userFilteredData = data.filter((achievement) => achievement.postOwnerID === userId); // Filter added
        setProgressData(userFilteredData);
        setFilteredData(userFilteredData); // Initially show filtered data
      })
      .catch((error) => console.error('Error fetching Achievements data:', error));
  }, [userId]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = progressData.filter(
      (achievement) =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this Achievements?')) {
      try {
        const response = await fetch(`http://localhost:8080/achievements/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Achievements deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Achievements.');
        }
      } catch (error) {
        console.error('Error deleting Achievements:', error);
      }
    }
  };

  const openModal = (imagePath) => {
    setSelectedImage(imagePath);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  return (
    <div className="dark-container" style={{ 
      height: '100vh', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' 
    }}>
      <div className='continer'>
        <NavBar />
        <div className='post-content'>
          <div className="floating-search-container" style={{ marginTop: '20px' }}>
            <div className="search-box">
              <input
                type="text"
                placeholder="    What are you looking for?"
                value={searchQuery}
                onChange={handleSearch}
                className="floating-search"
              />
              <i className="search-icon">
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </i>
            </div>
            <div className="search-actions">
              <button 
                className="create-new-btn" 
                onClick={() => (window.location.href = '/addAchievements')}
                style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }}
              >
                <span>+</span> Create Achievement
              </button>
            </div>
          </div>
          
          <div className='posts-container modern'>
            {filteredData.length === 0 ? (
              <div className='empty-state-box modern'>
                <div className='empty-icon'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 3h-3v3h3V6zm0 4h-3v3h3v-3zm-4-4h-3v3h3V6zm0 4h-3v3h3v-3zm-4-4H6v3h3V6zm0 4H6v3h3v-3zm10 4H6v3h13v-3z"/>
                  </svg>
                </div>
                <h2>No Achievements Found</h2>
                <p>Share your first achievement</p>
                <button className='create-btn modern' onClick={() => (window.location.href = '/addAchievements')}>
                  Create Your First Achievement
                </button>
              </div>
            ) : (
              <div className='posts-grid'>
                {filteredData.map((achievement) => (
                  <div key={achievement.id} className='post-card-modern'>
                    <div className='post-header'>
                      <div className='user-info'>
                        <div className='avatar' style={{ 
                          background: 'linear-gradient(45deg, #4CAF50, #81C784)' 
                        }}>
                          {achievement.postOwnerName?.charAt(0) || 'A'}
                        </div>
                        <div className='user-details'>
                          <h4>{achievement.postOwnerName || 'Anonymous'}</h4>
                          <span className='category-tag'>{achievement.date}</span>
                        </div>
                      </div>
                      {achievement.postOwnerID === userId && (
                        <div className='action-buttons'>
                          <div className='owner-actions'>
                            <button className='icon-btn edit' onClick={() => window.location.href = `/updateAchievements/${achievement.id}`}>
                              <FaEdit />
                            </button>
                            <button className='icon-btn delete' onClick={() => handleDelete(achievement.id)}>
                              <RiDeleteBin6Fill />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className='post-body'>
                      <h3 className='post-title'>{achievement.title}</h3>
                      <p className='post-text' style={{ whiteSpace: "pre-line" }}>{achievement.description}</p>
                      {achievement.imageUrl && (
                        <div className='media-gallery'>
                          <div 
                            className='media-preview'
                            onClick={() => openModal(`http://localhost:8080/achievements/images/${achievement.imageUrl}`)}
                          >
                            <img 
                              src={`http://localhost:8080/achievements/images/${achievement.imageUrl}`} 
                              alt="Achievement" 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="modern-media-modal"
        overlayClassName="modern-modal-overlay"
      >
        <button className="modern-close-btn" onClick={closeModal}>×</button>
        <img src={selectedImage} alt="Full size" className="modal-content" />
      </Modal>
    </div>
  );
}

export default MyAchievements;
