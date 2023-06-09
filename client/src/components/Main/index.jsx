import styles from "./styles.module.css"
import { useState, useEffect } from "react"
import axios from "axios"
import Users from "./Users"


import { useNavigate } from "react-router-dom";


const Main = () => {
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

  useEffect(() => {
    getUsers();
  }, []);
  
  return (
    <div className={styles.main_container}>
       <div className={styles.container}>
    <div className={styles.row}>
      <nav className={styles.navbar}>
        <h1>MySite</h1>
        <button className={styles.white_btn} onClick={handleAccountDetails}>
          Details
        </button>
        <button className={styles.white_btn} onClick={handleDeleteAccount}>
          Delete account
        </button>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div style={{ display: detailsVisible ? "block" : "none" }}>
        <h2>{responseMessageD}</h2>
        <p>First Name: {details.firstName}</p>
        <p>Last Name: {details.lastName}</p>
        <p>Email: {details.email}</p>
      </div>

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






      <section className={`${styles.chat}`}>
    <div className={`${styles.messageschat}`}>
   ??????????????????????
   </div>

    </section>








    </div>

  </div>
  </div>
  );
}
export default Main
