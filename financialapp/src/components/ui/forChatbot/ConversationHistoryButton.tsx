import * as React from "react";
import { Button } from "@/components/ui/button";

interface ConversationHistoryButtonProps {
  onClick: () => void;
}

const ConversationHistoryButton: React.FC<ConversationHistoryButtonProps> = ({ onClick }) => {
  return (
    <Button
      className="fixed bottom-4 right-4 p-4 border border-gray-300 rounded-full bg-white shadow-md"
      onClick={onClick}
    >
      Conversation History
    </Button>
  );
};

export default ConversationHistoryButton;