import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onUpdate, onDismiss }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    password: user.password,
    profilePicture: user.profilePicture || '',
  });


  if (!user) {
    return <div>No user data available</div>;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSave = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const renderEditForm = () => (
    <form onSubmit={handleSave}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="profilePicture">Profile Picture URL:</label>
        <input
          id="profilePicture"
          type="text"
          name="profilePicture"
          placeholder="Profile Picture URL"
          value={formData.profilePicture}
          onChange={handleChange}
        />
      </div>
      <div className="form-buttons">
        <button type="submit">Save</button>
        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    </form>
  );

 
  const renderProfileInfo = () => (
    <>
      <p>{formData.username}</p>
      <p>Email: {formData.email}</p>
      <p>Password: {formData.password}</p>
      <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      <button className="dismiss-button" onClick={onDismiss}>Dismiss</button>
    </>
  );

  return (
    <div className="user-profile">
      <div className="header">
        <h1>User Profile</h1>
      </div>
      <div className="profile-circle">
        {formData.profilePicture ? (
          <img src={formData.profilePicture} alt="Profile" className="profile-img" />
        ) : (
          <span className="profile-initials">{formData.username.charAt(0)}</span>
        )}
      </div>
      <div className="user-info">
        {isEditing ? renderEditForm() : renderProfileInfo()}
      </div>
    </div>
  );
};

export default UserProfile;