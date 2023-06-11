import styles from "./styles.module.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Users from "./Users"
import Menu from '../common/Menu';
import { useSpring, animated } from "react-spring";
import { useTransition } from 'react-spring';
import { Link } from 'react-router-dom';
import React from "react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { userId } = useParams();
  const [messageContent, setMessageContent] = useState("");
  const [sendMessageResponse, setSendMessageResponse] = useState(0);
  const [dane, ustawDane] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [details, setUserDetails] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    navigate(`/messages/user/${user._id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.reload()
  }
  const [responseMessageU, setResponseMessageU] = useState("");
  const [responseMessageD, setResponseMessageD] = useState("");

  const getUsers = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const config = {
          method: 'get',
          url: 'http://localhost:8080/api/users',
          headers: { 'Content-Type': 'application/json', 'x-access-token': token }
        }
        const { data: res } = await axios(config)
        ustawDane(res.data)
        setResponseMessageU(res.message);
        console.log(res.data);
        ustawDane(res.data);
        setResponseMessageU(res.message);

      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          localStorage.removeItem("token")
          window.location.reload()
        }
      }
    }
  }

  const handleAccountDetails = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "get",
          url: "http://localhost:8080/api/details",
          headers: { "Content-Type": "application/json", "x-access-token": token },
        };
        const { data: res } = await axios(config);
        setUserDetails(res.data);
        setDetailsVisible(true);
        setResponseMessageD(res.message);
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          localStorage.removeItem("token");
          window.location.reload();
        }
      }
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDeleteAccount = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const config = {
            method: "delete",
            url: "http://localhost:8080/api/users",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          };

          await axios(config);
          localStorage.removeItem("token");
          window.location.reload();
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

    if (window.confirm("Do you want to delete your account???")) {
      confirmDeleteAccount();
    }
  };

  const maxMessageLength = 1000;

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

        if (messageContent.trim() !== "" && messageContent.length <= maxMessageLength) {
          const { data: res } = await axios(config);
          setSendMessageResponse(0);
          setMessageContent("");
        } else {
          setSendMessageResponse(1);
          setSnackbarText("Message too long")
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
    }
  };

  const [isPressed, setIsPressed] = React.useState(false);

  const buttonAnimation = useSpring({
    scale: isPressed ? 0.8 : 1,
    config: { tension: 200, friction: 10 },
  });

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  useEffect(() => {
    getUsers();
    handleAccountDetails();
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

    if (userId) {
      getUsers();
      const intervalId = setInterval(fetchUserMessages, 1000);
      return () => clearInterval(intervalId);
    }
  }, [userId]);

  const sendButtonAnimation = useSpring({
    transform: "scale(1)",
    from: { transform: "scale(0.8)" },
    config: { tension: 200, friction: 10 },
  });

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleShowSnackbar = (text) => {
    setSnackbarText(text);
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
      setSnackbarText("")
    }, 3000);
  };

  const [snackbarText, setSnackbarText] = useState(null);

  useEffect(() => {
    if (snackbarText) {
      handleShowSnackbar(snackbarText);

    }
  }, [snackbarText]);

  const [isMessage0, setIsMessage0] = useState(false);

  const shakeAnimation = useSpring({
    from: { transform: 'translate3d(0, 0, 0)' },
    to: async (next) => {
      if (sendMessageResponse) {
        await next({ transform: 'translate3d(-6px, 0, 0)' });
        await next({ transform: 'translate3d(6px, 0, 0)' });
        await next({ transform: 'translate3d(-6px, 0, 0)' });
        await next({ transform: 'translate3d(6px, 0, 0)' });
        await next({ transform: 'translate3d(0, 0, 0)' });
        setSendMessageResponse(0);
      }

    },
    config: { duration: 60 },
    onRest: () => {
    },
  });

  function formatTimestamp(timestamp) {
    const messageDate = new Date(timestamp);
    const today = new Date();

    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return `Yesterday, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `${messageDate.toLocaleDateString()} ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  const [isSending, setIsSending] = useState(false);

  const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";

  const findUserData = (userId) => {
    const selectedU = dane.find((user) => String(user._id) === String(userId));
    if (selectedU && selectedU.firstName) {
      return (

        <div className={styles.userInfo}>
          <div className={styles.photoContainer}>
            <img
              className={styles.photoIMG}
              src={selectedU.avatar || defaultAvatarUrl}
              alt="Avatar"
            />
          </div>
          <div className={styles.textContainer}>
            <p className={styles.name}>
              {selectedU.firstName} {selectedU.lastName}
            </p>
          </div>
        </div>
      );
    } else {
      return <p className={styles.name}>User not found or not available</p>;
    }
  };

  return (
    <div className={styles.bbody}>
      <div className={styles.main_container}>
        <div className={styles.container}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <nav className={styles.navbar}>
              <h1>Cloudy</h1>
              <div className={styles.avatarNav} style={{ backgroundImage: `url(${details.avatar || defaultAvatarUrl})` }}>
              </div>
            </nav>
          </Link>

          <section className={styles.discussions}>
            <div className={`${styles.discussion} ${styles.search}`}>
              <div className={styles.searchbar}>
                <i className="fa fa-search" aria-hidden="true"></i>
                <input type="text" placeholder="Search..." value={searchTerm}
                  onChange={handleSearchChange} />
              </div>
            </div>

            {dane.length > 0 ? (
              <Users users={dane} onSelectUser={handleSelectUser} searchTerm={searchTerm} />

            ) : (
              <p>No users found.</p>
            )}
          </section>


          {/* <Menu  /> */}

          <section className={styles.chat}>
            <div className={styles.headerchat}>
              {findUserData(userId)}
            </div>
            <div className={styles.messageschat}>
              {/* {messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((message) => (
    <div key={message._id} className={styles.message}>
      <div className={`${message.sender._id === userId ? styles["recived"] : styles["sent"]}`}>
        <p className={styles.text}>{message.content}</p>
        <p className={styles.time}>{message.timestamp}</p>
      </div>
    </div>
  ))} */}
              {/* todo poprawic sortowanie zeby bylo tak jak wyzej od najnowszych na dole, ale wtedy trzeba tez scroll zmieniac 
i zeby sie zamiast _id bylo username*/}

              {messages.map((message) => (
                <div key={message._id} className={styles.message}>
                  <div className={`${message.sender._id === userId ? styles["recived"] : styles["sent"]}`}>
                    <p className={styles.text}>{message.content}</p>
                    <p className={styles.time}>{formatTimestamp(message.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footerchat}>
              <form onSubmit={handleSendMessage}>
                <textarea
                  id="messageContent"
                  value={messageContent}
                  className={styles.writemessage} placeholder="Type your message here"
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                ></textarea>
                <animated.button
                  className={`${styles.icon} ${styles.send} ${styles.clickable}`}
                  style={
                    sendMessageResponse
                      ? shakeAnimation
                      : buttonAnimation
                  }
                  type="submit"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                >
                  Send
                </animated.button>
              </form>
            </div>
          </section>

        </div>
        <div>
          {showSnackbar && (
            <div className={styles.snackbarshow}>{snackbarText}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;