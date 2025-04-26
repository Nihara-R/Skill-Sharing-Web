import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import GoogalLogo from './img/glogo.png'
import { IoMdAdd } from "react-icons/io";
import './UserRegister.css';

function UserRegister() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        skills: [],
        bio: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [userEnteredCode, setUserEnteredCode] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput] });
            setSkillInput('');
        }
    };

    const removeSkill = (indexToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((_, index) => index !== indexToRemove)
        });
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('profilePictureInput').click();
    };

    const sendVerificationCode = async (email) => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('verificationCode', code);
        try {
            await fetch('http://localhost:8080/sendVerificationCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (!formData.email) {
            alert("Email is required");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            alert("Email is invalid");
            isValid = false;
        }

        if (!profilePicture) {
            alert("Profile picture is required");
            isValid = false;
        }
        if (formData.skills.length < 2) {
            alert("Please add at least two skills.");
            isValid = false;
        }
        if (!isValid) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    skills: formData.skills,
                    bio: formData.bio,
                }),
            });

            if (response.ok) {
                const userId = (await response.json()).id;

                if (profilePicture) {
                    const profileFormData = new FormData();
                    profileFormData.append('file', profilePicture);
                    await fetch(`http://localhost:8080/user/${userId}/uploadProfilePicture`, {
                        method: 'PUT',
                        body: profileFormData,
                    });
                }

                sendVerificationCode(formData.email);
                setIsVerificationModalOpen(true);
            } else if (response.status === 409) {
                alert('Email already exists!');
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleVerifyCode = () => {
        const savedCode = localStorage.getItem('verificationCode');
        if (userEnteredCode === savedCode) {
            alert('Verification successful!');
            localStorage.removeItem('verificationCode');
            window.location.href = '/';
        } else {
            alert('Invalid verification code. Please try again.');
        }
    };

    const nextStep = () => {
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
                alert("Valid email is required");
                isValid = false;
            }
            if (!formData.fullname || !formData.password || !formData.phone) {
                alert("All fields are required");
                isValid = false;
            }
            if (!profilePicture) {
                alert("Profile picture is required");
                isValid = false;
            }
        }

        if (isValid) {
            setCurrentStep(2);
        }
    };

    const prevStep = () => {
        setCurrentStep(1);
    };

    return (
        <div className="login-container" style={{ 
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' 
        }}>
            <div className="login-box">
                <div className="login-header">
                    <h2>Create Account</h2>
                    <div className="stepper">
                        <div className={`step ${currentStep >= 1 ? 'active' : ''}`} 
                             style={currentStep >= 1 ? {backgroundColor: '#4CAF50'} : {}}>
                        </div>
                        <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}
                             style={currentStep >= 2 ? {backgroundColor: '#4CAF50'} : {}}>
                        </div>
                        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}
                             style={currentStep >= 2 ? {backgroundColor: '#4CAF50'} : {}}>
                        </div>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    {currentStep === 1 ? (
                        <>
                            <div className="profile-upload">
                                <div className="profile-icon-container" onClick={triggerFileInput}>
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Selected Profile"
                                            className="selectedimagepreview"
                                        />
                                    ) : (
                                        <FaUserCircle className="profileicon" />
                                    )}
                                </div>
                                <input
                                    id="profilePictureInput"
                                    className="hidden-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePictureChange}
                                />
                            </div>

                            <input
                                className="login-input"
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                className="login-input"
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                className="login-input"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />

                            <input
                                className="login-input"
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) => {
                                    const re = /^[0-9\b]{0,10}$/;
                                    if (re.test(e.target.value)) {
                                        handleInputChange(e);
                                    }
                                }}
                                maxLength="10"
                                pattern="[0-9]{10}"
                                title="Please enter exactly 10 digits."
                                required
                            />

                            <button type="button" onClick={nextStep} className="login-button" style={{ backgroundColor: '#4CAF50' }}>
                                Next
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="skills-section">
                                <div className="skills-container">
                                    {formData.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill}
                                            <button 
                                                type="button" 
                                                onClick={() => removeSkill(index)}
                                                className="remove-skill-btn"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <div className="skill-input-group">
                                    <input
                                        className="login-input"
                                        type="text"
                                        placeholder="Add Skills (minimum 2)"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddSkill} 
                                        className="add-skill-btn"
                                        style={{ backgroundColor: '#4CAF50' }}
                                    >
                                        <IoMdAdd />
                                    </button>
                                </div>
                            </div>

                            <textarea
                                className="login-input"
                                name="bio"
                                placeholder="Write a short bio..."
                                value={formData.bio}
                                rows={3}
                                onChange={handleInputChange}
                                required
                            />

                            <div className="button-group">
                                <button type="button" onClick={prevStep} className="login-button">
                                    Back
                                </button>
                                <button type="submit" className="login-button green-button">
                                    Create Account
                                </button>
                            </div>
                        </>
                    )}

                    <div className="divider">
                        <span>or continue with</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                        className="google-login-button"
                    >
                        <img src={GoogalLogo} alt='Google' className='google-icon' />
                        Continue with Google
                    </button>

                    <p className="signup-text">
                        Already have an account?
                        <span 
                            onClick={() => (window.location.href = '/')} 
                            className="signup-link"
                        >
                            Sign in
                        </span>
                    </p>
                </form>
            </div>

            {isVerificationModalOpen && (
                <div className="verification-modal">
                    <div className="modal-content">
                        <h3>Verify Your Email</h3>
                        <p>Please enter the verification code sent to your email.</p>
                        <input
                            type="text"
                            value={userEnteredCode}
                            onChange={(e) => setUserEnteredCode(e.target.value)}
                            placeholder="Enter verification code"
                            className="login-input"
                        />
                        <button onClick={handleVerifyCode} className="login-button">
                            Verify
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserRegister;
