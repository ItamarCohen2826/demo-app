import { auth, firestore, googleAuthProvider, signIn, signUp } from "../lib/firebase"
import { UserContext } from '../lib/context';
import { useEffect, useState, useCallback, useContext } from "react";
import debounce from 'lodash.debounce';
import Router, { useRouter } from "next/router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-hot-toast";
import SignInEmailPassword from '../components/Login';
import SignUpButton from "../components/Signup";
import ForgotPassword from '../components/ForgotPassword';

//Log in page
export default function EnterPage({ }) {
    const { user, username } = useContext(UserContext);
    /*
        1. User signed out <SignInButton />
        2. User signed in, but missing username <UsernameForm />
        3.  User signed in , has username <SignOutButton />
    */

    return (
        <main style={{
          "display": "block",
        }}>
      {user ? 
        !username ? <UsernameForm /> : <SignOutButton /> 
        : 
        <>
          <ul style={{
          "display": "block",
          "listStyleType": "none",
          }}>
            <li><SignInButton /></li>
            <li><SignUpButton /></li>
            <li><SignInEmailPassword /></li>
            <li><ForgotPassword /></li>
          </ul>
        </>
      }
        </main>
    )
}

function SignInButton() {
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);
    };
    return (
      <button className='btn-google' onClick={signInWithGoogle}>
{            // eslint-disable-next-line @next/next/no-img-element
}            <img src={'/google.png'} alt=''/> Sign in with Google
      </button>
    );
}
      

// Sign out button
function SignOutButton() {
  return <button className="btn-red" onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, username } = useContext(UserContext);

    useEffect(() => {
        checkUsername(formValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValue])

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    
        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
          setFormValue(val);
          setLoading(false);
          setIsValid(false);
        }
    
        if (re.test(val)) {
          setFormValue(val);
          setLoading(true);
          setIsValid(false);
        }
      };


      // eslint-disable-next-line react-hooks/exhaustive-deps
      const checkUsername = useCallback(
        debounce(async (username) => {
        if (username.length >= 3) {
            const ref = firestore.doc(`usernames/${username}`);
            const { exists } = await ref.get(); 
            console.log('Firestore read executed!');
            setIsValid(!exists);
            setLoading(false);
        }
      }, 500),
      []
    );

      const onSubmit = async (e) => {
        e.preventDefault();

        //Create refs for both documents
        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        // Commit both docs together as a batch write.
        const batch = firestore.batch();
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
      }


    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name='username' placeholder='username' value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type='submit' className='btn-green' disabled={!isValid}>
                        Choose
                    </button>
                    <h3>
                        Debug State
                    </h3>
                    <div>
                        Username = {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <p></p>;
    }
  }