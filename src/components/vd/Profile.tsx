import { ProfileProps } from "../../types";

const Profile = ({ size = "md" }: ProfileProps) => {
  const dimensions = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  return (
    <div
      className="relative rounded-full overflow-hidden border-2 border-pink-400 flex-shrink-0
          transition-all duration-300 hover:border-pink-300 hover:shadow-lg hover:scale-110"
      style={{
        width: `${dimensions[size]}px`,
        height: `${dimensions[size]}px`,
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 transition-all duration-300
          hover:from-pink-500 hover:to-pink-700"
      >
        <img
          src="/profile.png"
          alt="Profile"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
    </div>
  );
};

export default Profile;
