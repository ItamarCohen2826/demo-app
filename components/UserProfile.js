import Image from "next/future/image";
import { firestore, getUserWithUsername } from "../lib/firebase";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import AuthCheck from "./AuthCheck";
import Link from "next/link";
import HackerImage from "../public/hacker.png";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Loader from "./Loader";
import { updateCurrentUser, updateProfile } from "firebase/auth";
import { useRouter } from "next/router";

// import EditProfile from './EditProfile';

export default function UserProfile({ user }) {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const signOut = () => {
    auth.signOut();
  };

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    // Makes reference to the storage bucket location
    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(pct);

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
          auth.currentUser.updateProfile({ photoURL: url });
        });
      const userDoc = firestore.doc(`users/${user.uid}`);
      userDoc.update({ photoURL: downloadURL });
      toast.success("Updated profile picture successfully!");
    });
  };

  // TODO image only working for current user, user.photoURL not updating....
  return (
    <div className="box-center">
      {!user.photoURL && !auth.currentUser === user && (
        <Image
          src={HackerImage}
          height={150}
          width={150}
          alt=""
          className="card-img-center"
        />
      )}
      {(username === user.username) === auth.currentUser ? (
        <Image
          src={auth.currentUser.photoURL}
          height={150}
          width={150}
          alt=""
          className="card-img-center"
        />
      ) : (
        <></>
      )}

      <p>
        <i>@{user.username}</i>
      </p>
      <h1>{user.displayName}</h1>
      {username === user.username ? (
        <>
          <Link href="/">
            <button onClick={signOut} className="btn-red">
              Sign Out
            </button>
          </Link>
          <br />
          {/* <button className="btn-blue profile-edit">
                    Edit Profile
                </button>
                <EditProfile user={user} /> */}
          <Loader show={uploading} />
          {uploading && <h3>{progress}%</h3>}

          {!uploading && (
            <>
              <label className="btn">
                📸 Update Profile Picture
                <input
                  type="file"
                  onChange={uploadFile}
                  accept="image/x-png,image/gif,image/jpeg"
                />
              </label>
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
