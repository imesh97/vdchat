import { useEffect, useRef, useState } from "react";
import { MESSAGES, PERSONAL_MESSAGE } from "../../constants";
import Profile from "./Profile";
import { MoreHorizontal, Send } from "lucide-react";
import Message from "./Message";
import { ChatMessage, Option } from "../../types";

const ValentineApp = () => {
  const [screen, setScreen] = useState<"welcome" | "chat" | "end">("welcome");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [availableMessages, setAvailableMessages] = useState<Option[]>([
    ...MESSAGES,
  ]);
  const [showEndOption, setShowEndOption] = useState(false);
  const [lovedMessages, setLovedMessages] = useState<Set<number>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomMessages = (count: number) => {
    const shuffled = [...availableMessages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getCurrentOptions = () => {
    const options = getRandomMessages(showEndOption ? 2 : 3);
    if (showEndOption) {
      options.push({
        id: -1,
        text: "show me the final message ❤️",
        response: "i have something special to tell you...",
      });
    }
    return options;
  };

  const toggleMessageLove = (index: number) => {
    setLovedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleOption = async (option: Option) => {
    setIsTyping(true);

    setMessages((prev) => [...prev, { type: "user", text: option.text }]);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setMessages((prev) => [
      ...prev,
      { type: "bot", text: "...", isTyping: true },
    ]);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessages((prev) => [
      ...prev.slice(0, -1),
      { type: "bot", text: option.response },
    ]);
    setIsTyping(false);

    if (option.id === -1) {
      setTimeout(() => {
        setScreen("end");
      }, 2000);
      return;
    }

    const updatedAvailable = availableMessages.filter(
      (msg) => msg.id !== option.id
    );
    setAvailableMessages(updatedAvailable);

    if (updatedAvailable.length <= 2) {
      setShowEndOption(true);
    }
  };

  const [screenTransition, setScreenTransition] = useState(false);

  const handleScreenChange = (newScreen: "welcome" | "chat" | "end") => {
    setScreenTransition(true);

    // If going to welcome screen, reset all states
    if (newScreen === "welcome") {
      setMessages([]);
      setAvailableMessages([...MESSAGES]);
      setShowEndOption(false);
      setLovedMessages(new Set());
      setIsTyping(false);
    }

    setTimeout(() => {
      setScreen(newScreen);
      setScreenTransition(false);
    }, 500);
  };

  if (screen === "welcome" || screen === "end") {
    return (
      <div
        className={`h-[100dvh] overflow-hidden bg-gray-50 flex items-center justify-center p-4 transition-opacity duration-300
        ${screenTransition ? "opacity-0" : "opacity-100"}`}
      >
        <div
          className="w-full max-w-sm bg-white rounded-xl shadow-lg p-12 transform transition-all duration-500
          hover:shadow-xl hover:scale-[1.02]"
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="animate-[bounce_1s_ease-in-out_infinite]">
              <Profile size="lg" />
            </div>
            <h1
              className="text-3xl sm:text-4xl font-bold text-pink-500 text-center transform transition-all
              duration-500 hover:scale-110 hover:text-pink-400"
            >
              Happy Valentine's Day
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-pink-400 text-center">
              <b>to: </b>sydney turner
            </h2>
            <p
              className="text-gray-600 text-center text-sm sm:text-base transition-all duration-300
              hover:text-gray-900"
            >
              {screen === "welcome"
                ? "Welcome to your special Valentine's chat! Tap to start talking to mimi."
                : PERSONAL_MESSAGE}
            </p>
            <button
              onClick={() =>
                handleScreenChange(screen === "welcome" ? "chat" : "welcome")
              }
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3
                rounded-full font-semibold transition-all duration-500
                hover:from-pink-600 hover:to-pink-700 hover:shadow-lg hover:scale-105
                active:scale-95 transform"
            >
              {screen === "welcome" ? "Chat with mimi ❤️" : "Start over ❤️"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-[100dvh] overflow-hidden bg-gray-50 flex flex-col transition-opacity duration-300
      ${screenTransition ? "opacity-0" : "opacity-100"}`}
    >
      <div
        className="bg-white border-b border-gray-200 px-4 py-2 flex items-center
        transform transition-all duration-300"
      >
        <Profile size="sm" />
        <div className="ml-3 flex-grow">
          <h3
            className="font-semibold text-gray-900 transition-colors duration-300
            hover:text-pink-500"
          >
            mimi ❤️
          </h3>
          <p className="text-xs text-gray-500">
            {isTyping ? "Typing..." : "Active now"}
          </p>
        </div>
        <MoreHorizontal
          className="text-gray-500 transform transition-all duration-300
          hover:text-pink-500 hover:scale-110 cursor-pointer"
        />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
        <div className="max-w-lg mx-auto py-4">
          {messages.map((message, index) => (
            <Message
              key={index}
              message={message}
              index={index}
              isLoved={lovedMessages.has(index)}
              onLove={toggleMessageLove}
              isNew={index === messages.length - 1}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-lg mx-auto space-y-2">
          {getCurrentOptions().map((option) => (
            <button
              key={option.id}
              onClick={() => handleOption(option)}
              disabled={isTyping}
              className={`w-full bg-gray-50 px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-base
                transform transition-all duration-300 flex items-center justify-between
                ${
                  isTyping
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-pink-50 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
                }`}
            >
              <span className="flex-1 text-left">{option.text}</span>
              <Send
                size={16}
                className={`text-pink-500 flex-shrink-0 ml-2 transition-all duration-300
                  ${
                    isTyping
                      ? ""
                      : "group-hover:translate-x-1 group-hover:scale-110"
                  }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValentineApp;
