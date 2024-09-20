// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from "firebase/auth"
import {collection, doc, getDocs, getFirestore, query, setDoc, where} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMtdqDdHCzXSlv9afJ1-47xrosJAVXN4g",
  authDomain: "chat-app-5fd5b.firebaseapp.com",
  projectId: "chat-app-5fd5b",
  storageBucket: "chat-app-5fd5b.appspot.com",
  messagingSenderId: "566082137450",
  appId: "1:566082137450:web:4a475f92fd9d904bf98913"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password)=>{

    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey, There i am using chat app",
            lastSeen: Date.now()
        })

        await setDoc(doc(db, "chats", user.uid),{
            chatsData:[]
        })
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const login = async (email, password)=>{
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = async () =>{

    try {
        await signOut(auth);
    } catch (error) {
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const resetPass = async (email) =>{
    if(!email){
        toast.error("Enter your email");
        return null;
    }

    try {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);

        if(!querySnap.empty()){
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent")
        } else{
            toast.error("Enter does not exist")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
}

export {signup, login, logout, auth, db, resetPass}