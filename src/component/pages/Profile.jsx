import { useAuth } from "../context/AuthContext";

function Profile(){

const { user,logout }=useAuth();

return(

<div>

<h1>

Welcome

</h1>

<p>

{user?.email}

</p>

<button

onClick={logout}

>

Logout

</button>

</div>

);

}

export default Profile;