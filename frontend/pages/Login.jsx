import { verifyUser } from "../src/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

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
            if (response.status === 201) {
                alert("Account created successfully!");
                navigate("/home"); 
                sessionStorage.setItem("User",response)
            } else {
                alert("Something went wrong, but the server responded.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "User account could not be created. Please try again.";
            alert(errorMessage);
            console.error("Error creating user:", error);
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