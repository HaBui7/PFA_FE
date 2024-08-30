import axios from "axios";

export const fetchConversations = async (
  conversationId?: string,
  setMessages?: (messages: any[]) => void,
  setTitle?: (title: string) => void
) => {
  try {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("auth"),
    };

    const conversationsResponse = await axios.get(
      "http://localhost:3000/api/gpt/conversations",
      { headers }
    );

    const conversations = conversationsResponse.data.conversations;

    if (conversationId && setMessages && setTitle) {
      const detailsResponse = await axios.get(
        `http://localhost:3000/api/gpt/conversations/${conversationId}`,
        { headers }
      );

      const { settings, messages, title } = detailsResponse.data;

      localStorage.setItem("conversation_title", title);
      localStorage.setItem("conversation_settings", JSON.stringify(settings));
      localStorage.setItem("conversation_messages", JSON.stringify(messages));
      localStorage.setItem("response_length", settings.response_length);
      localStorage.setItem("temperature", settings.temperature);

      setMessages(messages);
      setTitle(title);
    }

    return conversations;
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.error("Network error while fetching conversations:", error);
    } else {
      console.error("Error fetching conversations:", error);
    }
    throw error;
  }
};

export const generateResponse = async (
  conversation_id: string,
  inputValue: string
) => {
  try {
    const responseLength = localStorage.getItem("response_length") || "short";
    const temperature = parseFloat(
      localStorage.getItem("temperature") || "0.5"
    );

    // Get conversation messages from local storage
    const conversationMessages = JSON.parse(
      localStorage.getItem("conversation_messages") || "[]"
    );

    // Append the user's inputValue to the conversation messages
    const updatedMessages = [
      ...conversationMessages,
      { "role": "user", "content": inputValue },
    ];

    const payload: any = {
      conversation_id,
      messages: updatedMessages, // Use updated messages in the payload
      response_length: responseLength,
      temperature: temperature,
      transaction_start_date: "",
      transaction_end_date: "",
    };

    const startdate = localStorage.getItem("startdate");
    const enddate = localStorage.getItem("enddate");

    if (startdate && startdate.toLowerCase() !== "none") {
      payload.transaction_start_date = startdate;
    }

    if (enddate && enddate.toLowerCase() !== "none") {
      payload.transaction_end_date = enddate;
    }

    const response = await axios.post(
      "http://localhost:3000/api/gpt/generate",
      payload,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth"),
        },
      }
    );

    console.log(response.data);
    return response.data.content;
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.error("Network error while generating response:", error);
    } else {
      console.error("Error generating response:", error);
    }
    throw error;
  }
};

export const fetchPrompts = async (setPrompts: (prompts: string[]) => void) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/gpt/getPrompts",
      {},
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth"),
        },
      }
    );
    if (response.data.prompts && Array.isArray(response.data.prompts)) {
      setPrompts(response.data.prompts);
    }
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.error("Network error while fetching prompts:", error);
    } else {
      console.error("Error fetching prompts:", error);
    }
    throw error;
  }
};

export const getTransactionCount = async (startdate, enddate) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/transactions/",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      }
    );
    console.log(response);
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.error("Network error while fetching transaction count:", error);
    } else {
      console.error("Error fetching transaction count:", error);
    }
    throw error;
  }
};