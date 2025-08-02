import { useState , useEffect } from 'react'
import './App.css'
import axios from "axios"
function App(){

  const [data, setData] = useState()

  function createPost(){
    let postObject = {
      title:"AAAA",
      description:"BBBB",
      content:"CCCC",
      author:"DDDD",
      datecreated: new Date(),
    }

    axios.post("http://localhost:3000/posts", postObject)
  }

  /*useEffect(() =>{
    async function grabData(){
      const response = await axios.get("http://localhost:3000/posts")
      if(response.status === 200){
        setData(response.data)
      }
    }
    grabData()
  },[])*/
  return (
    <>
    <button onClick={createPost}>Create Object</button>
    
    </>

  )
}
export default App
