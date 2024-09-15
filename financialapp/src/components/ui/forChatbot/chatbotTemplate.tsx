import * as React from "react";
import { useOutletContext } from "react-router-dom";
import { marked } from "marked";
import { Send, RefreshCw, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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
  isProcessing: boolean;
  promptsLoading: boolean;
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
  isProcessing,
}) => {
  const navigate = useNavigate();
  const { navHeight } = useOutletContext();
  const wrapDollarTextInGreen = (html) => {
    return html.replace(
      /(\$[0-9,]+(?:\.[0-9]{1,2})?|\b[0-9,]+(?:\.[0-9]{1,2})?\$)/g,
      (match) => {
        return `<span class="green-text">${match}</span>`;
      }
    );
  };
  return (
    <div
      className="flex flex-col"
      style={{ height: `calc(99.5vh - ${navHeight}px)` }}
    >
      <div className=" flex flex-col justify-between h-full bg-blue-500">
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
        <main className="overflow-auto h-full w-full sticky">
          {messages && messages.length === 0 ? (
            <div className="text-center mt-20">
              <h1 className="text-xl font-semibold">Powered by RMIT Val</h1>
              <p className="text-gray-500">Model: GPT-4</p>
              <p className="text-sm text-gray-400 mt-4">
                Disclaimer: We utilize your data in our services to process and
                provide advice. By using our services, you consent to this use
                of your data.
              </p>
            </div>
          ) : (
            <div className="flex flex-col  w-full items-center ">
              {/* Chat window */}
              <div
                className="flex-1  p-0 px-4 w-full max-w-8xl  " // Set a fixed height with h-96 or any value
                id="chat-window"
              >
                <div className=" h-full w-full">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex w-full ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`${
                          message.role === "user"
                            ? "bg-slate-900 text-slate-50 ml-auto"
                            : "bg-gray-300 text-black mr-4"
                        } p-3 m-4 rounded-lg max-w-xl`}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: wrapDollarTextInGreen(
                              marked(message.content)
                            ),
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Example Questions */}
      <section className="flex flex-col items-center  text-black ">
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
            className={`p-4 border border-gray-300 rounded-full bg-white shadow-md ${
              isProcessing ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={handleSendMessage}
            disabled={isProcessing} // Disable button when processing
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
            <History className="h-5 w-5 text-gray-500" />
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

    </div>
  );
};

export default ChatbotTemplate;
