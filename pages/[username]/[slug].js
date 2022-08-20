import { getUserWithUsername, postToJSON, firestore } from "../../lib/firebase";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from "../../components/PostContent";
import MetaTags from "../../components/Metatags";
import AuthCheck from '../../components/AuthCheck';
import Link from 'next/link';
import Heart from '../../components/HeartButton';

export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);
    if (!userDoc) {
        return {
            notFound: true
        }
    }
    let post;
    let path;

    if (userDoc) {
        const postRef = userDoc.ref.collection('posts').doc(slug);
        post = postToJSON(await postRef.get());

        path = postRef.path;
    }

    return {
        props: { post, path },
        revalidate: 5000,
    }
}

export async function getStaticPaths() {
    const snapshot = await firestore.collectionGroup('posts').get();
    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        // The slug should be the same as the document name for the paths to work!
        return {
             params : { username, slug }
        };
    });
    return {
        /*
        Must be in this format:
        paths: [
            { params: { username, slug }}
        ],
         */
        paths,
        fallback: 'blocking',
    };
}

export default function Post(props) {
    const postRef = firestore.doc(props.path);
    const [realtimePost] = useDocumentData(postRef);
  
    const post = realtimePost || props.post;
    return (
        <main>
            <MetaTags title="Post" />
            <section>
                <PostContent post={post} />
            </section>            
            <aside className="card" />
            <p>
                <strong>{post.heartCount || 0} ❤️</strong>
            </p>
        <AuthCheck
            fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <Heart postRef={postRef} />
        </AuthCheck>
        </main>
    )
}