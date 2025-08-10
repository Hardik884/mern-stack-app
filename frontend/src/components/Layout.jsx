import {Navbar} from "./Navbar"
import {Outlet} from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export function Layout() {
    let user = sessionStorage.getItem("token")
    const navigate = useNavigate()
    useEffect(()=>{
        if(!user){
            navigate("/")
        }
    },[user])
    return (
        <>
            <Navbar/>
            <Outlet/>
        </>
    )
}