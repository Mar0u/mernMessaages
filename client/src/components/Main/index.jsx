import styles from "./styles.module.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Users from "./Users"
import { useSpring, animated } from "react-spring";
import { useTransition } from 'react-spring';
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import svgEditPhoto from '../../imgs/pencil-svgrepo-com.svg';
import svgCancel from '../../imgs/cancel-cross-svgrepo-com.svg';
import svgConfirm from '../../imgs/confirm-svgrepo-com.svg';

const Messages = () => {
  const { userId } = useParams();
  const [dane, ustawDane] = useState([]);
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
        setAvatarLink(res.data.avatar);
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

  useEffect(() => {
    getUsers();
    handleAccountDetails();
  }, []);

  const [editEmailOpen, setEditEmailOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleEditEmail = () => {
    setEditEmailOpen(!editEmailOpen);
    setEditAvatarOpen(false);
  };

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
  const handleSaveEmail = async () => {
    if (!email) {
      setSnackbarText("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbarText("Invalid email format");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (token) {
        console.log(1);
        const config = {
          method: "put",
          url: 'http://localhost:8080/api/users/email',
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          data: {
            email: email,
          },
        };
        console.log(2);
        await axios(config);
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          email: email,
        }));
        setEmail("");
        setSnackbarText("Email updated successfully");
        setEditEmailOpen(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        if (error.response.data.message === "Email already exists") {
          setSnackbarText("Email is already taken");
        } else {
          setSnackbarText("Error updating email");
        }
      } else {
        setSnackbarText("Error updating email");
      }
    }
  };

  const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";

  const [avatarLink, setAvatarLink] = useState('');

  const [editAvatarOpen, setEditAvatarOpen] = useState(false);
  const handleEditAvatar = () => {
    setEditAvatarOpen(!editAvatarOpen);
    setEditEmailOpen(false);
  };

  const handleSaveAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          method: 'put',
          url: 'http://localhost:8080/api/users/avatar',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
          data: {
            avatarLink: avatarLink,
          },
        };

        await axios(config);
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          avatar: avatarLink,
        }));

        setSnackbarText('Avatar updated successfully');
      }
    } catch (error) {
      console.error(error);
      setSnackbarText('Error updating avatar');
    }
    setEditAvatarOpen(false);
  };

  useEffect(() => {
    if (snackbarText) {
      handleShowSnackbar(snackbarText);
    }
  }, [snackbarText]);

  return (
    <div className={styles.bbody}>
      <div className={styles.main_container}>
        <div className={styles.container}>
          <Link to="/" className={styles.white_btn} style={{ textDecoration: 'none' }}>
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

          <section className={styles.chat}>
            <div className={styles.myInfo}>
              <div className={styles.avatar} style={{ backgroundImage: `url(${details.avatar || defaultAvatarUrl})` }}>
                <span onClick={handleEditAvatar} className={`${styles.statuss} ${styles.buttonHoverClick}`}><img src={svgEditPhoto} alt="edit photo" style={{ width: '20px', height: '20px' }} /></span>
              </div>

              {editAvatarOpen && (
                <div className={styles.containerInputButtons}>
                  <input
                    className={styles.inputNewInfo}
                    type="text"
                    value={avatarLink}
                    onChange={(e) => setAvatarLink(e.target.value)}
                    placeholder="Enter image link"
                  />
                  <button className={`${styles.buttonYesNo} ${styles.buttonYes}`} onClick={handleSaveAvatar}><img src={svgConfirm} alt="edit photo" style={{ width: '18px', height: '19px' }} /></button>
                  <button className={`${styles.buttonYesNo} ${styles.buttonNo}`} onClick={handleEditAvatar}><img src={svgCancel} alt="edit photo" style={{ width: '18px', height: '18px' }} /></button>
                </div>
              )}

              <div className={styles.textContainer}>
                <p className={styles.myName}>
                  {details.firstName} {details.lastName}
                </p>
                <p className={styles.myEmail} style={{ marginLeft: '13px' }}>
                  {details.email} <img className={styles.buttonHoverClick1} onClick={handleEditEmail} src={svgEditPhoto} alt="edit photo" style={{ marginLeft: '13px', width: '13px', height: '13px' }} />
                </p>
              </div>

              {editEmailOpen && (
                <div className={styles.emailEditor}>
                  <input
                    className={styles.inputNewInfo}
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter new email"
                  />
                  <button className={`${styles.buttonYesNo} ${styles.buttonYes}`} onClick={handleSaveEmail}><img src={svgConfirm} alt="edit photo" style={{ width: '18px', height: '19px' }} /></button>
                  <button className={`${styles.buttonYesNo} ${styles.buttonNo}`} onClick={handleEditEmail}><img src={svgCancel} alt="edit photo" style={{ width: '18px', height: '18px' }} /></button>
                </div>
              )}

              <button className={styles.buttonDeleteAccount} onClick={handleDeleteAccount}>
                Delete account
              </button>
              <button className={styles.buttonLogout} onClick={handleLogout}>
                Logout
              </button>
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