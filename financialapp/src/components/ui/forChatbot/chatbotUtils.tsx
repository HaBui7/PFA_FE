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
    if (error.code === "ERR_NETWORK") {
      console.error("Network error while fetching conversations:", error);
    } else {
      console.error("Error fetching conversations:", error);
    }
    throw error;
  }
};

export const generateResponse = (
  conversation_id: string,
  inputValue: string,
  onMessage: (message: any) => void,
  onError: (error: any) => void
) => {
  try {
    const responseLength = localStorage.getItem("response_length") || "short";
    const temperature = parseFloat(
      localStorage.getItem("temperature") || "0.5"
    );

    const conversationMessages = JSON.parse(
      localStorage.getItem("conversation_messages") || "[]"
    );

    const updatedMessages = [
      ...conversationMessages,
      { role: "user", content: inputValue },
    ];

    const payload: any = {
      conversation_id,
      messages: updatedMessages,
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

    fetch("http://localhost:3000/api/gpt/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("auth"),
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.body)
      .then((body) => {
        const reader = body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        reader.read().then(function processText({ done, value }) {
          if (done) {
            return;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop(); // Keep the last partial line in the buffer

          lines.forEach((line) => {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);
                onMessage(data);
              } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                console.error("Response text causing error:", line);
                onError(parseError);
              }
            }
          });

          return reader.read().then(processText);
        });
      })
      .catch((error) => {
        onError(error);
      });
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};

export const getPrompts = async (messages: any[]) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/gpt/getPrompts",
      { messages },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth"),
        },
      }
    );
    return response.data.prompts;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
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
    if (error.code === "ERR_NETWORK") {
      console.error("Network error while fetching transaction count:", error);
    } else {
      console.error("Error fetching transaction count:", error);
    }
    throw error;
  }
};

export const deleteConversation = async (conversationId: string) => {
  try {
    const headers = {
      Authorization: "Bearer " + localStorage.getItem("auth"),
    };
    const response = await axios.delete(
      `http://localhost:3000/api/gpt/conversations/${conversationId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    if (error.code === "ERR_NETWORK") {
      console.error("Network error while deleting conversation:", error);
    } else {
      console.error("Error deleting conversation:", error);
    }
    throw error;
  }
};
