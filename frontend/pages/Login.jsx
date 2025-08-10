import { verifyUser } from "../src/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await verifyUser(user);

            if (response.status === 200 && response.data.success) {
                alert("Login successful!");
                
                const token = response.data.token;

                sessionStorage.setItem("token", token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
                navigate("/home");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
            alert(errorMessage);
            console.error("Error logging in:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder={"Email"} onChange={handleChange} name="email" required maxLength={40} />
            <input placeholder={"Password"} type="password" onChange={handleChange} name="password" required maxLength={20} />
            <button type="submit">Login</button>
        </form>
    );
}