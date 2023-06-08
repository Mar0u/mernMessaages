import styles from "./styles.module.css"
import { useState } from "react"
import axios from "axios"
import Users from "./Users"
const Main = () => {
    const [dane, ustawDane] = useState([])
    const [usersVisible, setUsersVisible] = useState(false)
    const [detailsVisible, setDetailsVisible] = useState(false)
    const [details, setUserDetails] = useState({});




    const [recipientId, setRecipientId] = useState("");
    const [messageContent, setMessageContent] = useState("");
    const [sendMessageResponse, setSendMessageResponse] = useState("");

    const handleSendMessage = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const config = {
            method: "post",
            url: `http://localhost:8080/api/messages/${recipientId}`,
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
          setRecipientId("");
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

    

    const handleLogout = () => {
        localStorage.removeItem("token")
        window.location.reload()
    }
    const [responseMessageU, setResponseMessageU] = useState(""); 
    const [responseMessageD, setResponseMessageD] = useState(""); 

    const handleGetUsers = async (e) => {
        e.preventDefault()
        //pobierz token z localStorage:
        const token = localStorage.getItem("token")
        //jeśli jest token w localStorage to:
        if (token) {
            try {
                //konfiguracja zapytania asynchronicznego z tokenem w nagłówku:
                const config = {
                    method: 'get',
                    url: 'http://localhost:8080/api/users',
                    headers: { 'Content-Type': 'application/json', 'x-access-token': token }
                }
                //wysłanie żądania o dane:
                const { data: res } = await axios(config)
                //ustaw dane w komponencie za pomocą hooka useState na listę z danymi przesłanymi
                //z serwera – jeśli został poprawnie zweryfikowany token
                ustawDane(res.data) // `res.data` - zawiera sparsowane dane – listę
                setUsersVisible(true)
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
      
    return (

        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1>MySite</h1>
                <button className={styles.white_btn} onClick={handleGetUsers}>
                    Users
                </button>
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
            <div style={{ display: detailsVisible ? 'block' : 'none' }}>
            <h2>{responseMessageD}</h2>
        <p>First Name: {details.firstName}</p>
        <p>Last Name: {details.lastName}</p>
        <p>Email: {details.email}</p>
            </div>
            <div style={{ display: usersVisible ? 'block' : 'none' }}>
                <h2>{responseMessageU}</h2>
                {dane.length > 0 ? <Users users={dane} /> : <p></p>}
            </div>
       







<div>
  <h2>Send Message</h2>
  <form onSubmit={handleSendMessage}>
    <div>
      <label htmlFor="recipientId">Recipient ID:</label>
      <input
        type="text"
        id="recipientId"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
    </div>
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








    )
}
export default Main
