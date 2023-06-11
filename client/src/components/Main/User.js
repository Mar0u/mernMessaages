const User = (props) => {
    const user = props.user;
    return (<li> {user._id} {user.firstName} {user.lastName} </li>);
}
export default User