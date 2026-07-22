import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login(){

const { login }=useAuth();

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const submit=async(e)=>{

e.preventDefault();

await login(email,password);

};

return(

<form onSubmit={submit}>

<input

type="email"

onChange={(e)=>setEmail(e.target.value)}

placeholder="Email"

/>

<input

type="password"

onChange={(e)=>setPassword(e.target.value)}

placeholder="Password"

/>

<button>

Login

</button>

</form>

);

}

export default Login;