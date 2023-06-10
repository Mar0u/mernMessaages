import React from "react";
import styles from "./styles.module.css";

const Users = ({ users, onSelectUser, searchTerm }) => {
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const defaultAvatarUrl = "https://i.pinimg.com/originals/a9/26/52/a926525d966c9479c18d3b4f8e64b434.jpg";

  return (
    <div>
      {filteredUsers.map((user) => (
        <div
          className={styles.discussion}
          key={user._id}
          onClick={() => onSelectUser(user)}
        >
          <div
            className={styles.photo}
            style={{
              backgroundImage: `url(${user.avatar || defaultAvatarUrl})`,
            }}
          ></div>
          <div className={styles["desccontact"]}>
            <p className={styles.name}>
              {user.firstName} {user.lastName} 
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Users;
