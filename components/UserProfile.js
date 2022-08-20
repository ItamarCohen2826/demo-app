import Image from "next/image"
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import AuthCheck from "./AuthCheck";
import Link from "next/link";

export default function UserProfile({ user }) {
    const { username } = useContext(UserContext);

    const signOut =  () => {
      auth.signOut();
    }

    return (
        <div className='box-center'>
            <img src={user.photoURL} alt='' className='card-img-center' />
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName}</h1> 
            {username === user.username ?
            <Link href='/'>
                <button onClick={signOut} className="btn-red">
                    Sign Out
                </button>
            </Link>
            :
            <></>
            }

        </div>
    )
}