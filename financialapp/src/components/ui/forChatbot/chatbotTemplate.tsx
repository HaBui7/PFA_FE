import * as React from "react";
import { marked } from "marked";
import { Send, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface ChatbotTemplateProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isPopupVisible: boolean;
  setIsPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  conversations: any[];
  setConversations: React.Dispatch<React.SetStateAction<any[]>>;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  conversationId: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: () => void;
  handleResetClick: () => void;
  toggleHistoryPopup: () => void;
  toggleSettingsPopup: () => void;
  handleSaveSettings: () => void;
  handleResetSettings: () => void;
  formatDate: (dateString: string) => string;
  popupMessage: { type: string; message: string } | null;
  isSettingsPopupVisible: boolean;
  responseLength: string;
  setResponseLength: React.Dispatch<React.SetStateAction<string>>;
  temperature: number;
  setTemperature: React.Dispatch<React.SetStateAction<number>>;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  isFadingOut: boolean;
}

const ChatbotTemplate: React.FC<ChatbotTemplateProps> = ({
  inputValue,
  setInputValue,
  isPopupVisible,
  setIsPopupVisible,
  conversations,
  setConversations,
  messages,
  setMessages,
  title,
  conversationId,
  handleInputChange,
  handleSendMessage,
  handleResetClick,
  toggleHistoryPopup,
  toggleSettingsPopup,
  handleSaveSettings,
  handleResetSettings,
  formatDate,
  popupMessage,
  isSettingsPopupVisible,
  responseLength,
  setResponseLength,
  temperature,
  setTemperature,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isFadingOut,
}) => {
  const navigate = useNavigate();
  const wrapDollarTextInGreen = (html) => {
    return html.replace(
      /(\$[0-9,]+(?:\.[0-9]{1,2})?|\b[0-9,]+(?:\.[0-9]{1,2})?\$)/g,
      (match) => {
        return `<span class="green-text">${match}</span>`;
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {popupMessage && (
        <div
          className={`fixed left-1/2 transform -translate-x-1/2 mt-4 p-4 rounded ${
            popupMessage.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white ${isFadingOut ? "fade-out" : "fade-in"} ${
            !isFadingOut && !popupMessage ? "initial" : ""
          }`}
          style={{ top: "4rem" }}
        >
          {popupMessage.message}
        </div>
      )}
      <nav>{/* Navigation bar content */}</nav>
      <main className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-center mt-4">{title}</h1>
        {messages && messages.length === 0 ? (
          <div className="text-center">
            <h1 className="text-xl font-semibold">Powered by RMIT Val</h1>
            <p className="text-gray-500">Model: GPT-4</p>
            <p className="text-sm text-gray-400 mt-4">
              Disclaimer: We utilize your data in our services to process and
              provide advice. By using our services, you consent to this use of
              your data.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-gray-100 border-t border-gray-300 w-full">
            {messages &&
              messages.map((message, index) => (
                <div
                  key={index}
                  className="p-4 mb-4 bg-white border border-gray-300 rounded-lg"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: wrapDollarTextInGreen(marked(message.content)),
                    }}
                  ></div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Example Questions */}
      <section className="flex flex-col items-center px-8 pb-8 text-black">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 w-full max-w-4xl">
          <Button className="p-6 border border-gray-300 rounded-2xl bg-white text-left">
            <span className="block text-base font-semibold leading-tight">
              Prompt
              <br />
              <span className="text-sm font-normal text-gray-500">
                Placeholder.
              </span>
            </span>
          </Button>
          <Button className="p-6 border border-gray-300 rounded-2xl bg-white text-left">
            <span className="block text-base font-semibold leading-tight">
              Prompt
              <br />
              <span className="text-sm font-normal text-gray-500">
                Placeholder.
              </span>
            </span>
          </Button>
          <Button className="p-6 border border-gray-300 rounded-2xl bg-white text-left">
            <span className="block text-base font-semibold leading-tight">
              Prompt
              <br />
              <span className="text-sm font-normal text-gray-500">
                Placeholder.
              </span>
            </span>
          </Button>
          <Button className="p-6 border border-gray-300 rounded-2xl bg-white text-left">
            <span className="block text-base font-semibold leading-tight">
              Prompt
              <br />
              <span className="text-sm font-normal text-gray-500">
                Placeholder.
              </span>
            </span>
          </Button>
        </div>
        <div className="mt-8 w-full max-w-2xl">
          <Input
            placeholder="Ask me anything..."
            className="rounded-full px-4 py-3 shadow-lg"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
        </div>
        {/* Action Buttons */}
        <div className="mt-4 flex space-x-4 justify-center">
          <Button
            id="send"
            className="p-4 border border-gray-300 rounded-full bg-white shadow-md"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5 text-gray-500" />
          </Button>
          <Button
            id="reset"
            className="p-4 border border-gray-300 rounded-full bg-white shadow-md"
            onClick={handleResetClick}
          >
            <RefreshCw className="h-5 w-5 text-gray-500" />
          </Button>
          <Button
            id="settings"
            className="p-4 border border-gray-300 rounded-full bg-white shadow-md"
            onClick={toggleSettingsPopup}
          >
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>
          <Button
            className="p-4 border border-gray-300 rounded-full bg-white shadow-md"
            onClick={toggleHistoryPopup}
          >
            <span className="block text-base text-gray-500 font-semibold leading-tight">
              Conversation History
            </span>
          </Button>
        </div>

        {isPopupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Conversations</h2>
              {conversations.length > 0 ? (
                <ul>
                  {conversations.map((conversation) => (
                    <li
                      key={conversation.conversation_id}
                      className="mb-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        navigate(`/chatbot/${conversation.conversation_id}`);
                        setIsPopupVisible(false); // Close the popup
                      }}
                    >
                      <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-md">
                        <h3 className="text-base font-semibold">
                          {conversation.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Date: {formatDate(conversation.createdAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No conversations found.</p>
              )}
              <Button className="mt-4" onClick={toggleHistoryPopup}>
                Close
              </Button>
            </div>
          </div>
        )}

        {isSettingsPopupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Response Length
                </label>
                <select
                  value={responseLength}
                  onChange={(e) => setResponseLength(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Temperature
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1.0"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Data Scan Range - Start
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Data Scan Range - End
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={handleSaveSettings}
                >
                  Save
                </Button>
                <Button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={handleResetSettings}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4 text-center">
          Generated by generative AI. Responses may be irrelevant or misleading.
        </p>
      </section>
    </div>
  );
};

export default ChatbotTemplate;
