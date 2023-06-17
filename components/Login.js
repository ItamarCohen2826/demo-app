import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Toast, toast } from "react-hot-toast";

export default function SignInEmailPassword() {
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
      signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            toast.success(`Welcome back!`);
          })
          .catch((error) => {
            toast.error("Incorrect email or password! ")
            const errorMessage = error.message;
          })
          // .then(toast.success("Logged In!"))
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <div>
          <label>Email</label>
          <input type="email" placeholder="Email" onChange={(e) => {onEmailChange(e)}} />
          <label>Password</label>
          <input type="password" placeholder="Password" onChange={(e) => {onPasswordChange(e)}} min={6} />
          <button type="submit" className="btn-green">Sign in</button>
        </div>
      </form>
    )
  }
  