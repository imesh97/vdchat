export interface ChatMessage {
  type: "user" | "bot";
  text: string;
  isTyping?: boolean;
}

export interface Option {
  id: number;
  text: string;
  response: string;
}

export interface ProfileProps {
  size?: "sm" | "md" | "lg";
}

export interface MessageProps {
  message: ChatMessage;
  index: number;
  isLoved: boolean;
  onLove: (index: number) => void;
  isNew: boolean;
}
