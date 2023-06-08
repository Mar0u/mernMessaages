import React from "react";

const Users = ({ users, onSelectUser }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user._id} onClick={() => onSelectUser(user)}>
          {user.firstName} {user.lastName}
        </li>
      ))}
    </ul>
  );
};

export default Users;
