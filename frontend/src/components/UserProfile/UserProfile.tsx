import "./UserProfile.css";

interface UserProfileProps {
  name: string;
  role: string;
  avatarLabel?: string;
}

export const UserProfile = ({ name, role, avatarLabel }: UserProfileProps) => {
  // Use first character of name if avatarLabel is not provided
  const displayAvatar = avatarLabel || name.charAt(0);

  return (
    <div className="user-profile-area">
      <div className="user-info">
        <div className="avatar">{displayAvatar}</div>
        <div className="user-details">
          <span className="username">{name}</span>
          <span className="user-role">{role}</span>
        </div>
      </div>
    </div>
  );
};
