import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Toast, toast } from "react-hot-toast";
import { auth } from "../lib/firebase";

export default function SignUpButton() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const onEmailChange = (e) => {
      e.preventDefault();
      setEmail(e.target.value.toLowerCase());
    }
  
    const onPasswordChange = (e) => {
      e.preventDefault();
      setPassword(e.target.value);
    }
  
    const handleSubmit = (e) => {
      e.preventDefault();
      createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
          toast.success("Registered!");
        })
        .catch (error => {
          const errorMessage = error.message;
          toast.error("Email already taken! ")
        });
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <h1>Sign up</h1>
        <div>
          <label>Email</label>
          <input type="email" placeholder="email" onChange={(e) => {onEmailChange(e)}} />
          <label>Password</label>
          <input type="password" placeholder="password" onChange={(e) => {onPasswordChange(e)}} min={6} />
          <button type="submit" className="btn-green">Register</button>
        </div>
      </form>
    )
  }