import { useContext, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Toast, toast } from "react-hot-toast";
import { auth } from "../lib/firebase";
import { UserContext } from "../lib/context";

export default function EditProfile( { user } ) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const onEmailChange = (e) => {
      e.preventDefault();
      setEmail(e.target.value.toLowerCase());
    }


  
    const handleSubmit = (e) => {
      e.preventDefault();
      user.updateEmail(email)
        .then(userCredential => {
          toast.success("Registered!");
        })
        .catch (error => {
          const errorMessage = error.message;
          toast.error("Email already taken! ")
        });
    }
  
    return (
      <form>
        <h1>Edit profile</h1>
        <div>
{/*             <label>Display Name</label>
           <input value={user.displayName == null ? user.displayName : username} type="email" placeholder="email" onChange={(e) => {onEmailChange(e)}} /> */}
           <label>Email</label>
           <input type="email" placeholder="email" onChange={(e) => {onEmailChange(e)}} />
           <button type="submit" className="btn-green">Done</button>
        </div>
      </form>
    )
  }