import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import {  signOut } from "firebase/auth";
import pageAuthenticantion from './initializeApp';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import {   FacebookAuthProvider } from "firebase/auth";

pageAuthenticantion(); 







function App() {
   const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
   
    name: '',
    email:'',
    password:'',
    photo:''
  })

  const provider = new GoogleAuthProvider();
  const fbprovider = new FacebookAuthProvider();
// signin Start ......
 const handleSignIn = () =>{
  // console.log('signin clicked');
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      const {displayName, photoURL,email}=result.user;
      const signedInUser ={
        isSignedIn:true,
        name: displayName,
        email:email,
        photo:photoURL
      }
      setUser(signedInUser);
      // console.log(displayName, photoURL,email);
    
    })
    
    .catch((error) => {
      console.log(error);
      console.log(error.message);
      
    });

 }
  const handleFBLogin = () => {
    const auth = getAuth();
signInWithPopup(auth, fbprovider)
  .then((result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = FacebookAuthProvider.credentialFromError(error);

    // ...
  });
  }

  // sign in End ....
// signOut start ...
  const handleSignOut= () => {
    //  console.log('signOut clicked');
const auth = getAuth().signOut()
.then(result => {
  const signedOutUser = {
    isSignedIn:false,
    name:'',
    photo:'',
    email:'',
    error:'',
    Success:false
  }
  setUser(signedOutUser);
  console.log(result);
})

.catch((error) => {
  
})

  }
  // signOut End ...
  const handleBlur = (event) => {
  let isFieldValid = true;
    // console.log(event.target.name,event.target.value);
    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    //  console.log(isFormValid);
    }
    if(event.target.name === 'password'){
      const isPsswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid =isPsswordValid && passwordHasNumber;
    }
     if(isFieldValid){
       const newUserInfo = {...user};
        newUserInfo[event.target.name] = event.target.value;  
        setUser(newUserInfo);
     }
  }
  const handleSubmit = (evend) => {
    // console.log(user.email, user.password);
    if( newUser && user.email && user.password){
      // console.log('submitting')
     const auth = getAuth();
     createUserWithEmailAndPassword(auth, user.email, user.password)
    .then(result => {
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.Success = true;
      setUser(newUserInfo);
      updateUserName(user.name);
    // console.log(result);
  })

  .catch((error) => {
    // const errorCode = error.code;
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.Success =false;
    setUser(newUserInfo);
    // const errorMessage = error.message;
    //  console.log(errorCode, errorMessage);
    
  });

    }
    if(!newUser && user.email && user.password){
      const auth = getAuth();
signInWithEmailAndPassword(auth, user.email, user.password)
  .then(result => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.Success = true;
    setUser(newUserInfo);
    console.log('sign in user info', result.user);
  })
  .catch(error => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.Success =false;
    setUser(newUserInfo);
  });
    }
    evend.preventDefault();

  }
  const updateUserName = name => {
    const auth = getAuth();
updateProfile(auth.currentUser, {
  displayName: name,
 
}).then(result => {
  console.log('user name updated successfully')
})
.catch((error) => {
  console.log(error)
});
  }
  
  return (
    <div className="App">
     {
       user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> :
       <button onClick={handleSignIn}>sign In</button>
      }
      <br />
      <button onClick={handleFBLogin}>Sign in using Facebook</button>
      {
        user.isSignedIn && <div>
           <p>Welcom, {user.name}</p>
           <p>Your email:{user.email}</p>
            <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>
      {/* <p>Name:{user.name}</p>
      <p>Email:{user.email}</p>
      <p>Password:{user.password}</p> */}
      <form onSubmit={handleSubmit}>
      {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your name" />}
        <br />
      <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email address" required/>
      <br />
      <input type="password" name="password" onBlur={handleBlur} placeholder="Your password" required />
      <br />
      <input type="submit" value={newUser ? 'Sign up' : 'Sign In'} />
      </form>
      {user.error && <p style={{color: 'red'}}>The email address is already in use by another account</p>}
      {user.Success && <p style={{color: 'green'}}>User { newUser ?'created' : 'Logged In'} Successfully</p>}
    </div>
  );
}

export default App;
