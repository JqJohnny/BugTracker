import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", event => {

    const firebaseConfig = {
        apiKey: "AIzaSyDu6ZEnmOvwj-n6VviffbrLgALNP5fnocI",
        authDomain: "bug-hunt-b860b.firebaseapp.com",
        projectId: "bug-hunt-b860b",
        storageBucket: "bug-hunt-b860b.appspot.com",
        messagingSenderId: "648587053344",
        appId: "1:648587053344:web:a547a2d4294cdd24372f45",
        measurementId: "G-1243JCXJFR"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    // Default Login Method
    document.getElementById('defaultLogin').onclick = function (){
        const loginForm = document.querySelector('#login-account');
        const email = loginForm['email-login'].value;
        const password = loginForm['password-login'].value;
        signInWithEmailAndPassword(auth, email, password)
            .then(result => {
                window.location.href='dashboard.html';
            })
            .catch(console.log);
    };
    
    // Google Sign-In
    document.getElementById('googleLogin').onclick = function (){
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        }
        signInWithPopup(auth, provider)
            .then(result => {
                window.location.href='dashboard.html';
            })  
            .catch(console.log);
    };
});