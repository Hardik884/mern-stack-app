import { createUser } from "../src/api"
import { useState } from "react"

export function CreateUser(){
    const [user,setUser] = useState({
        name:"",
        email:"",
        passsword:""
    })
    function handleChange(e){
        setUser({...user, [e.target.name]: e.target.value})
    }

    async function handleSubmit(){
        const response = await createUser(user)
        if(response!==200){
            alert("User account could not be created")
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input placeholder={"Name"} onChange={handleChange} name="name" required maxLength={20}/>
            <input placeholder={"Email"} onChange={handleChange} name="email" required maxLength={40}/>
            <input placeholder={"Password"} onChange={handleChange} name="password" required maxLength={20}/>
            <button type="submit">Create Account</button>
        </form>
    )
}