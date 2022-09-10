import Link from 'next/link';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import { useContext } from 'react';
import { auth } from '../lib/firebase';
import Image from 'next/image';

// Navbar Component
export default function Navbar() {
    const { user, username } = useContext(UserContext);
    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link href='/'>
                        <button className='btn-logo'>FEED</button>
                    </Link>
                </li>
                { /* User is signed in and has a username */ }
                {username && (
                    <>
                        <li className='push-left'>
                            <Link href='/admin'>
                                <button className='btn-blue'>Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <Image src={user?.photoURL ? user.photoURL : '/favicon.ico'} height={50} width={50} alt='' />
                            </Link>
                        </li>
                    </>
                )}
                { /* User isn't signed in or hasn't created a username */ }
                {!username && (
                    <Link href='/enter'>
                        <button className='btn-blue'>Log in</button>
                    </Link>
                )}
            </ul>
        </nav>
    )
}