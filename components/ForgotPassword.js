import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";

export default function ForgotPassword() {

    const [email, setEmail] = useState('');
  
    const onEmailChange = (e) => {
      e.preventDefault();
      setEmail(e.target.value.toLowerCase());
    }
  
    const handleSubmit = (e) => {
      sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Sent password reset email!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Email doesn't exist!");
      });
    }
  
    return (
      <div>
        <h1>Forgot my password</h1>
        <div>
          <label>Email</label>
          <input type="email" placeholder="email" onChange={(e) => {onEmailChange(e)}} />
          <button type="submit" onClick={handleSubmit} className="btn-green">Reset password</button>
        </div>
      </div>
    )
  }