import { Avatar, AvatarFallback } from "./avatar";
import "./user-profile.css";

interface UserProfileProps {
  name: string;
  role: string;
  avatarLabel?: string;
}

export const UserProfile = ({ name, role, avatarLabel }: UserProfileProps) => {
  const displayAvatar = avatarLabel || name.charAt(0);

  return (
    <div className="user-profile-area">
      <div className="user-info">
        <Avatar>
          <AvatarFallback>{displayAvatar}</AvatarFallback>
        </Avatar>
        <div className="user-details">
          <span className="username">{name}</span>
          <span className="user-role">{role}</span>
        </div>
      </div>
    </div>
  );
};

