import { Avatar, AvatarFallback } from "./avatar";

interface UserProfileProps {
  name: string;
  role: string;
  avatarLabel?: string;
}

export const UserProfile = ({ name, role, avatarLabel }: UserProfileProps) => {
  const displayAvatar = avatarLabel || name.charAt(0);

  return (
    <div className="flex items-center justify-between p-2 bg-background rounded-md">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{displayAvatar}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">{role}</span>
        </div>
      </div>
    </div>
  );
};

