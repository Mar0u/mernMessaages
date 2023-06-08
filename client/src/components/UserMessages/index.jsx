import styles from "./styles.module.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { userId } = useParams();
  const [messageContent, setMessageContent] = useState("");
  const [sendMessageResponse, setSendMessageResponse] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "post",
          url: `http://localhost:8080/api/messages/${userId}`,
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          data: {
            content: messageContent,
          },
        };

        const { data: res } = await axios(config);
        setSendMessageResponse(res.message);
        // Wyczyść pola formularza po wysłaniu wiadomości
        setMessageContent("");
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  };

  useEffect(() => {
    const fetchUserMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const config = {
            method: "get",
            url: `http://localhost:8080/api/messages/user/${userId}`,
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          };
          const { data: res } = await axios(config);
          setMessages(res.data);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    };
   
    if (userId) {
      fetchUserMessages();

      const intervalId = setInterval(fetchUserMessages, 500);
      return () => clearInterval(intervalId);


    }
  }, [userId]);

  return (
    <div>
      <h2>User Messages send to {userId}</h2>
      {messages.map((message) => (
     <div
     key={message._id}
     className={`${styles.message} ${
       message.sender._id === userId ? styles["message-sent"] : styles["message-received"]
     }`}
   >
          <p>Content: {message.content}</p>
          <p>Timestamp: {message.timestamp}</p>
        </div>
      ))}

<div>
  <h2>Send Message</h2>
  <form onSubmit={handleSendMessage}>
    <div>
      <label htmlFor="messageContent">Message Content:</label>
      <textarea
        id="messageContent"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      ></textarea>
    </div>
    <button type="submit">Send</button>
  </form>
  <p>{sendMessageResponse}</p>
</div>

    </div>



  );
};

export default Messages;
