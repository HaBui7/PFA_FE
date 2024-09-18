import * as React from "react";
import { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchConversations,
  generateResponse,
  deleteConversation,
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
  const [isHistoryFadingOut, setIsHistoryFadingOut] = React.useState(false);
  const [isSettingsFadingOut, setIsSettingsFadingOut] = React.useState(false);
  const [isSettingsPopupVisible, setIsSettingsPopupVisible] =
    React.useState(false);
  const [responseLength, setResponseLength] = React.useState("short");
  const [temperature, setTemperature] = React.useState(0.5);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [commandBox, setCommandBox] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commands = ["/create", "/update", "/delete"];
  const filteredCommands = commands.filter((command) =>
    command.startsWith(inputValue)
  );

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
    const value = event.target.value;
    setInputValue(value);

    if (value.startsWith("/")) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }

    if (commands.includes(value.trim())) {
      setCommandBox(value.trim());
      setInputValue("");
    }
  };

  const handleCommandClick = (command: string) => {
    setCommandBox(command);
    setInputValue("");
    setShowTooltip(false);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (showTooltip) {
      if (event.key === "ArrowDown") {
        setSelectedIndex(
          (prevIndex) => (prevIndex + 1) % filteredCommands.length
        );
      } else if (event.key === "ArrowUp") {
        setSelectedIndex(
          (prevIndex) =>
            (prevIndex - 1 + filteredCommands.length) % filteredCommands.length
        );
      } else if (event.key === "Enter") {
        if (filteredCommands.length === 1) {
          handleCommandClick(filteredCommands[0]);
        } else if (selectedIndex >= 0) {
          handleCommandClick(filteredCommands[selectedIndex]);
        }
      }
    } else if (event.key === "Enter") {
      handleSendMessage();
    } else if (event.key === "Backspace" && inputValue === "" && commandBox) {
      setCommandBox(null);
    }
  };

  const getPlaceholderText = () => {
    switch (commandBox) {
      case "/create":
        return "Enter details to add and save any transactions...";
      case "/update":
        return "Enter details to update any transactions...";
      case "/delete":
        return "Enter details to delete any transactions data...";
      default:
        return "Ask me anything...";
    }
  };

  const handleRemoveCommandBox = () => {
    setCommandBox(null);
  };

  const handleSendMessage = async () => {
    const fullMessage = commandBox
      ? `${commandBox} ${inputValue}`.trim()
      : inputValue.trim();
    if (!fullMessage || (commandBox && !inputValue.trim())) {
      return;
    }

    if (isProcessing) {
      showPopupMessage(
        "error",
        "Please wait until the current message is processed"
      );
      return;
    }

    setIsProcessing(true);

    const newMessage = { content: fullMessage, role: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue(""); // Clear input field
    setCommandBox(null); // Clear command box

    const conversation_id = localStorage.getItem("conversation_id") || ""; // Use conversationId if available, otherwise empty string

    try {
      let botMessage = { content: "", role: "assistant" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      const eventSource = generateResponse(
        conversation_id,
        fullMessage,
        (data) => {
          // Save conversation_id if present
          if (data && data.conversation_id) {
            console.log("convo id found!");
            localStorage.setItem("conversation_id", data.conversation_id);
          }

          if (data && data.content) {
            botMessage.content += data.content.content;
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1] = botMessage;
              return updatedMessages;
            });

            // Update local storage
            const conversationMessages = JSON.parse(
              localStorage.getItem("conversation_messages") || "[]"
            );
            conversationMessages.push({
              role: "assistant",
              content: data.content.content,
            });
            localStorage.setItem(
              "conversation_messages",
              JSON.stringify(conversationMessages)
            );
          }
        },
        (error) => {
          const errorMessage = {
            content: `**Error:** ${error.message}`,
            role: "system",
          };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
          showPopupMessage("error", `Error: ${error.message}`);
        }
      );

      return () => {
        eventSource.close();
        setIsProcessing(false);
      };
    } catch (error) {
      const errorMessage = {
        content: `**Error:** ${error.message}`,
        role: "system",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      showPopupMessage("error", `Error: ${error.message}`);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleHistoryPopup = async () => {
    if (!isPopupVisible) {
      try {
        const fetchedConversations = await fetchConversations();
        const sortedConversations = fetchedConversations.sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setConversations(sortedConversations);
        setIsPopupVisible(true); // Only set to true if fetch is successful
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        showPopupMessage("error", `Error: ${error.message}`);
      }
    } else {
      setIsHistoryFadingOut(true); // Start fade-out effect
      setTimeout(() => {
        setIsPopupVisible(false); // Hide popup after fade-out
        setIsHistoryFadingOut(false); // Reset fade-out state
      }, 500); // Match the duration of the fade-out animation
    }
  };

  const toggleSettingsPopup = () => {
    setIsSettingsPopupVisible(!isSettingsPopupVisible);
  };

  const formatDateToDDMMYY = (date: Date | string) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(d.getFullYear()).slice(2); // Get last two digits of year
    return `${day}${month}${year}`;
  };

  const handleSaveSettings = () => {
    localStorage.setItem("response_length", responseLength);
    localStorage.setItem("temperature", temperature.toString());
    localStorage.setItem("startdate", formatDateToDDMMYY(startDate));
    localStorage.setItem("enddate", formatDateToDDMMYY(endDate));
    setStartDate(startDate);
    setEndDate(endDate);
    setIsSettingsFadingOut(true); // Start fade-out effect
    setTimeout(() => {
      setIsSettingsPopupVisible(false); // Hide popup after fade-out
      setIsSettingsFadingOut(false); // Reset fade-out state
    }, 500); // Match the duration of the fade-out animation
  };

  const handleResetSettings = () => {
    localStorage.setItem("response_length", "short");
    localStorage.setItem("temperature", "0.5");
    localStorage.setItem("startdate", "");
    localStorage.setItem("enddate", "");
    setResponseLength("short");
    setTemperature(0.5);
    setStartDate("");
    setEndDate("");
    setIsSettingsFadingOut(true); // Start fade-out effect
    setTimeout(() => {
      setIsSettingsPopupVisible(false); // Hide popup after fade-out
      setIsSettingsFadingOut(false); // Reset fade-out state
    }, 500); // Match the duration of the fade-out animation
  };

  const handleResetClick = () => {
    // Reset conversation button
    // Clear conversation_messages from local storage
    localStorage.setItem("conversation_id", "");
    localStorage.setItem("conversation_messages", JSON.stringify([]));
    localStorage.setItem("conversation_title", "");
    localStorage.setItem("startdate", "");
    localStorage.setItem("enddate", "");
    setStartDate("");
    setEndDate("");
    setMessages([]); // Clear messages state
    navigate("/chatbot");
  };

  const formatDate = (dateString: string, isTime: boolean = true) => {
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

    const formattedDate = `${day}${daySuffix(day)} ${month} ${year}`;
    if (isTime) {
      return `${formattedDate}, ${formattedHours}:${minutes} ${period}`;
    } else {
      return formattedDate;
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId); // Call the API to delete the conversation
      setConversations((prevConversations) =>
        prevConversations.filter(
          (conversation) => conversation.conversation_id !== conversationId
        )
      ); // Update the state to remove the conversation
      showPopupMessage("success", "Conversation deleted successfully.");
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      showPopupMessage("error", `Error: ${error.message}`);
    }
  };

  React.useEffect(() => {
    if (conversationId) {
      localStorage.setItem("conversation_id", conversationId);
      fetchConversations(conversationId, setMessages, setTitle)
        .then(() => {
          showPopupMessage("success", "Conversations loaded.");
          // Set startdate and enddate to empty strings
          localStorage.setItem("startdate", "");
          localStorage.setItem("enddate", "");
          setStartDate("");
          setEndDate("");
        })
        .catch((error) => showPopupMessage("error", `Error: ${error.message}`));
    }
  }, [conversationId]);

  React.useEffect(() => {
    localStorage.setItem("conversation_messages", JSON.stringify(messages));
  }, [messages]);

  React.useEffect(() => {
    localStorage.setItem("startdate", "");
    localStorage.setItem("enddate", "");
    setStartDate("");
    setEndDate("");
  }, []);

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
      handleCommandClick={handleCommandClick}
      handleSendMessage={handleSendMessage}
      handleResetClick={handleResetClick}
      toggleHistoryPopup={toggleHistoryPopup}
      toggleSettingsPopup={toggleSettingsPopup}
      handleSaveSettings={handleSaveSettings}
      handleResetSettings={handleResetSettings}
      formatDate={formatDate}
      popupMessage={popupMessage}
      isFadingOut={isFadingOut}
      isHistoryFadingOut={isHistoryFadingOut}
      isSettingsFadingOut={isSettingsFadingOut}
      isSettingsPopupVisible={isSettingsPopupVisible}
      responseLength={responseLength}
      setResponseLength={setResponseLength}
      temperature={temperature}
      setTemperature={setTemperature}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      showTooltip={showTooltip}
      setShowTooltip={setShowTooltip}
      selectedIndex={selectedIndex}
      setSelectedIndex={setSelectedIndex}
      filteredCommands={filteredCommands}
      commandBox={commandBox}
      getPlaceholderText={getPlaceholderText}
      handleRemoveCommandBox={handleRemoveCommandBox}
      handleKeyDown={handleKeyDown}
      inputRef={inputRef}
      handleDeleteConversation={handleDeleteConversation}
    />
  );
}
