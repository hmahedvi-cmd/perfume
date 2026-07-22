import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Register(){

const { register }=useAuth();

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const submit=async(e)=>{

e.preventDefault();

await register(email,password);

};

return(

<form onSubmit={submit}>

<input

type="email"

placeholder="Email"

onChange={(e)=>

setEmail(e.target.value)

}

/>

<input

type="password"

placeholder="Password"

onChange={(e)=>

setPassword(e.target.value)

}

/>

<button>

Create Account

</button>

</form>

);

}

export default Register;