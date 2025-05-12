import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaTrash } from 'react-icons/fa';
import './UserProfile.css'
import Pro from './img/img.png';
import NavBar from '../../Components/NavBar/NavBar';

export const fetchUserDetails = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/user/${userId}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch user details');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
    }
};

function GoogalUserPro() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userID');
    const [googleProfileImage, setGoogleProfileImage] = useState(null);
    const [userType, setUserType] = useState(null);
    const [userProfileImage, setUserProfileImage] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userID');
        if (userId) {
            fetchUserDetails(userId).then((data) => setUserData(data));
        }
    }, []);

    useEffect(() => {
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
        if (storedUserType === 'google') {
            const googleImage = localStorage.getItem('googleProfileImage');
            setGoogleProfileImage(googleImage);
        } else if (userId) {
            fetchUserDetails(userId).then((data) => {
                if (data && data.profilePicturePath) {
                    setUserProfileImage(`http://localhost:8080/uploads/profile/${data.profilePicturePath}`);
                }
            });
        }
    }, [userId]);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete your profile?")) {
            const userId = localStorage.getItem('userID');
            fetch(`http://localhost:8080/user/${userId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Profile deleted successfully!");
                        localStorage.removeItem('userID');
                        navigate('/'); // Redirect to home or login page
                    } else {
                        alert("Failed to delete profile.");
                    }
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    return (
        <div className="dark-container">
            <NavBar />
            <div className="profile-content">
                {userData && userData.id === localStorage.getItem('userID') && (
                    <div className="modern-profile-card">
                        <div className="profile-header">
                            <div className="profile-image-container">
                                <img
                                    src={
                                        googleProfileImage
                                            ? googleProfileImage
                                            : userProfileImage
                                                ? userProfileImage
                                                : Pro
                                    }
                                    alt="Profile"
                                    className="modern-profile-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = Pro;
                                    }}
                                />
                            </div>
                            <div className="profile-header-info">
                                <h1 className="profile-name">{userData.fullname}</h1>
                                <p className="profile-bio">{userData.bio}</p>
                            </div>
                        </div>
                        <div className="profile-details">
                            <div className="detail-item">
                                <FaEnvelope className="detail-icon" />
                                <span>{userData.email}</span>
                            </div>
                        </div>
                        <div className="modern-profile-actions">
                            <button onClick={handleDelete} className="action-button delete">
                                <FaTrash /> Delete Account
                            </button>
                        </div>
                    </div>
                )}

                <div className="modern-cards-grid">
                    <div className="modern-link-card" onClick={() => navigate('/myLearningPlan')}>
                        <div className="card-icon learning-plan"></div>
                        <h3>My Learning Plan</h3>
                        <p>View and manage your learning journey</p>
                    </div>
                    <div className="modern-link-card" onClick={() => navigate('/myAllPost')}>
                        <div className="card-icon skill-post"></div>
                        <h3>My SkillPost</h3>
                        <p>Check your skill-related posts</p>
                    </div>
                    <div className="modern-link-card" onClick={() => navigate('/myAchievements')}>
                        <div className="card-icon achievements"></div>
                        <h3>My Achievements</h3>
                        <p>Track your accomplishments</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoogalUserPro;
