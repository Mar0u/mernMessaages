import React from "react";
import styles from "./styles.module.css";

const Users = ({ users, onSelectUser, searchTerm }) => {
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const defaultAvatarUrl = "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";

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
