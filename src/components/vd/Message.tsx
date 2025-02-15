import { useEffect, useState } from "react";
import Profile from "./Profile";
import { MessageProps } from "../../types";
import { Heart } from "lucide-react";

const Message = ({ message, index, isLoved, onLove, isNew }: MessageProps) => {
  const [isVisible, setIsVisible] = useState(!isNew);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const handleLove = () => {
    setIsHeartAnimating(true);
    onLove(index);
    setTimeout(() => setIsHeartAnimating(false), 1000);
  };

  return (
    <div
      className={`group mb-4 flex ${
        message.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {message.type === "bot" && (
        <div className="flex-shrink-0 mr-2 transition-transform duration-300 hover:scale-110">
          <Profile size="sm" />
        </div>
      )}
      <div className="relative max-w-[80%]">
        <div
          className={`px-4 py-2 rounded-3xl transform transition-all duration-500 ease-out
              ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }
              ${
                message.type === "user"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:scale-105"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              } text-sm sm:text-base`}
        >
          {message.text}
          {isLoved && (
            <Heart
              className={`absolute -top-3 -right-3 text-pink-500 transform transition-all
                  ${isHeartAnimating ? "scale-150 rotate-12" : "scale-100"}`}
              size={16}
              fill="currentColor"
            />
          )}
        </div>
        <button
          onClick={handleLove}
          className={`absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
              transition-all duration-300 hover:scale-125 ${
                isLoved ? "text-pink-500" : "text-gray-400"
              }`}
        >
          <Heart size={16} fill={isLoved ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
};

export default Message;
