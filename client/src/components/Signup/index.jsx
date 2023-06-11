import { useState } from "react"
import React, { useEffect } from 'react';

import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import styles from "./styles.module.css"
const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = "http://localhost:8080/api/users"
            const { data: res } = await axios.post(url, data)
            navigate("/login")
            console.log(res.message)
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message)
                setSnackbarText(error.response.data.message)
            }
        }
    }

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
    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type="button"
                            className={styles.white_btn}>
                            Sign in
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container}
                        onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            onChange={handleChange}
                            value={data.firstName}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            onChange={handleChange}
                            value={data.lastName}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />

                        <button type="submit" className={styles.cta}>
                            <span> Sign Up</span>
                            <svg width="13px" height="10px" viewBox="0 0 13 10">
                                <path d="M1,5 L11,5"></path>
                                <polyline points="8 1 12 5 8 9"></polyline>
                            </svg>
                        </button>

                        {/* <button type="submit"
                            className={`${styles.green_btn} ${styles.rainbow}`}>
                            Sign Up
                        </button> */}
                    </form>
                </div>
            </div>

            <div>
                {showSnackbar && (
                    <div className={styles.snackbarshow}>{snackbarText}</div>
                )}
            </div>

        </div>
    );
};
export default Signup