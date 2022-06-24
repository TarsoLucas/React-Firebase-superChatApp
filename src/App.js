import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCuCYR8Ub5wsPm4LlSwzLIUVTbc6Pyyzh0",
  authDomain: "superchat-tarso.firebaseapp.com",
  projectId: "superchat-tarso",
  storageBucket: "superchat-tarso.appspot.com",
  messagingSenderId: "810633069201",
  appId: "1:810633069201:web:2eacc7b9591a5acdd13530",
  measurementId: "G-JVDD1D0R6R"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
          <h1>My Chat</h1>
          <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <center>
        <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
        <p>Welcome to my online chat project. Please checkout Fireship on YT, this project is based on his tutorial 🔥 🚢 </p>
      </center>
    </>
  )
}

function SignOut() {
  return auth.currentUser && 
  (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();


    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <a ref={dummy}></a>

      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Send Message"/>
        <button type='submit' disabled={!formValue}>Send 🛫</button>
      </form>
    </>
  )
}
  function ChatMessage (props) {
    const { text, uid, photoURL } = props.message;

    const messageClass = uid == auth.currentUser.uid ? 'sent' : 'received';

    return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL}/>
        <p>{text}</p>
      </div>
    )
  }

export default App;
