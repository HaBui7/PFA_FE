import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchConversations,
  generateResponse,
  getTransactionCount,
} from "@/components/ui/forChatbot/chatbotUtils";
import ChatbotTemplate from "@/components/ui/forChatbot/chatbotTemplate";

export default function Chatbot() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const [inputValue, setInputValue] = React.useState("");
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const [conversations, setConversations] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [popupMessage, setPopupMessage] = React.useState<{
    type: string;
    message: string;
  } | null>(null);
  const [isFadingOut, setIsFadingOut] = React.useState(false);
  const [isSettingsPopupVisible, setIsSettingsPopupVisible] =
    React.useState(false);
  const [responseLength, setResponseLength] = React.useState("medium");
  const [temperature, setTemperature] = React.useState(0.5);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const showPopupMessage = (type: string, message: string) => {
    setPopupMessage({ type, message });
    setTimeout(() => {
      setIsFadingOut(true); // Start fade-out effect
      setTimeout(() => {
        setPopupMessage(null);
        setIsFadingOut(false); // Reset fade-out state
      }, 500); // Match the duration of the fade-out animation
    }, 3000);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const streamMessage = (message, setMessages) => {
    let index = 0;

    // Generator function to yield chunks of the message
    function* messageChunks() {
      while (index < message.length) {
        yield message.slice(index, index + 2); // Yield two characters
        index += 2; // Increment index by 2
      }
    }

    const chunks = messageChunks();

    // Function to process each chunk
    const processChunk = () => {
      const { value, done } = chunks.next();
      if (!done) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.content + value, // Append the chunk
          };
          return [...prevMessages.slice(0, -1), updatedMessage];
        });
        setTimeout(processChunk, 50); // Schedule the next update with a delay
      }
    };

    // Initialize the message with the first chunk
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const updatedMessage = {
        ...lastMessage,
        content: lastMessage.content + message.slice(index, index + 2), // Append two characters
      };
      index += 2; // Increment index by 2
      return [...prevMessages.slice(0, -1), updatedMessage];
    });

    // Start processing the chunks
    setTimeout(processChunk, 50); // Start the first update with a delay
  };

  const handleSendMessage = async () => {
    if (isProcessing) {
      showPopupMessage(
        "error",
        "Please wait until the current message is processed."
      );
      return;
    }

    setIsProcessing(true); // Set processing to true

    const newMessage = { content: inputValue, role: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue(""); // Clear input field

    const conversation_id = conversationId || ""; // Use conversationId if available, otherwise empty string

    try {
      const response = await generateResponse(conversation_id, inputValue);

      if (response && response.error) {
        const errorMessage = {
          content: `**Error:** ${response.error}`,
          role: "system",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } else if (response) {
        const botMessage = { content: "", role: "assistant" };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        streamMessage(response, setMessages); // Stream the response
      } else {
        const errorMessage = {
          content: "**Unexpected error. Please reload the website.**",
          role: "system",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        showPopupMessage("error", `Error: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = {
        content: `**Error:** ${error.message}`,
        role: "system",
      };
      // Save to local storage
      localStorage.setItem("conversation_messages", JSON.stringify(messages));
      // Set Assistant Messages
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      showPopupMessage("error", `Error: ${error.message}`);
    } finally {
      setIsProcessing(false); // Set processing to false when done
    }
  };
  const toggleHistoryPopup = async () => {
    if (!isPopupVisible) {
      try {
        const fetchedConversations = await fetchConversations();
        console.log(fetchedConversations);
        const sortedConversations = fetchedConversations.sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        console.log(sortedConversations);
        setConversations(sortedConversations);
        setIsPopupVisible(true); // Only set to true if fetch is successful
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        showPopupMessage("error", `Error: ${error.message}`);
      }
    } else {
      setIsPopupVisible(false);
    }
  };

  const toggleSettingsPopup = () => {
    setIsSettingsPopupVisible(!isSettingsPopupVisible);
  };

  const handleSaveSettings = () => {
    localStorage.setItem("response_length", responseLength);
    localStorage.setItem("temperature", temperature.toString());
    localStorage.setItem("startdate", startDate);
    localStorage.setItem("enddate", endDate);
    getTransactionCount(startDate, endDate);
    toggleSettingsPopup();
  };

  const handleResetSettings = () => {
    setResponseLength("short");
    setTemperature(0.5);
    setStartDate("");
    setEndDate("");
  };

  const handleResetClick = () => {
    // Clear conversation_messages from local storage
    localStorage.removeItem("conversation_messages");
    setMessages([]); // Clear messages state
    navigate("/chatbot");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    const daySuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${daySuffix(
      day
    )} ${month} ${year}, ${formattedHours}:${minutes} ${period}`;
  };

  React.useEffect(() => {
    if (conversationId) {
      fetchConversations(conversationId, setMessages, setTitle)
        .then(() => showPopupMessage("success", "Conversations loaded."))
        .catch((error) => showPopupMessage("error", `Error: ${error.message}`));
    }
  }, [conversationId]);
  React.useEffect(() => {
    localStorage.setItem("conversation_messages", JSON.stringify(messages));
  }, [messages]);

  return (
    <ChatbotTemplate
      inputValue={inputValue}
      setInputValue={setInputValue}
      isPopupVisible={isPopupVisible}
      setIsPopupVisible={setIsPopupVisible}
      conversations={conversations}
      setConversations={setConversations}
      messages={messages}
      setMessages={setMessages}
      title={title}
      setTitle={setTitle}
      conversationId={conversationId}
      handleInputChange={handleInputChange}
      handleSendMessage={handleSendMessage}
      handleResetClick={handleResetClick}
      toggleHistoryPopup={toggleHistoryPopup}
      toggleSettingsPopup={toggleSettingsPopup}
      handleSaveSettings={handleSaveSettings}
      handleResetSettings={handleResetSettings}
      formatDate={formatDate}
      popupMessage={popupMessage}
      isFadingOut={isFadingOut}
      isSettingsPopupVisible={isSettingsPopupVisible}
      responseLength={responseLength}
      setResponseLength={setResponseLength}
      temperature={temperature}
      setTemperature={setTemperature}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
    />
  );
}
