import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('');
  };

  return (
    <div className="user-profile">
      <div className="profile-circle">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" className="profile-img" />
        ) : (
          <span className="profile-initials">{getInitials(user.email)}</span>
        )}
      </div>
      <p className="user-email">{user.email}</p>
    </div>
  );
};

export default UserProfile;