import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

    const signupForm = document.querySelector('#user-signup');
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get user info
        const first = signupForm['user-first'].value;
        const last = signupForm['user-last'].value;
        const email = signupForm['user-email'].value;
        const password = signupForm['user-password'].value;
        const confirmPassword = signupForm['user-confirm-password'].value;

        if(password === confirmPassword){
            // Sign up the user
            createUserWithEmailAndPassword(auth, email, password).then(cred => {
                const user = cred.user;
                updateProfile(auth.currentUser, {
                    displayName: first + ' ' + last,
                  }).then(() => {
                    window.location.href='login.html';                            
                  }).catch((error) => {
                    console.log(error);
                  });

            }).catch(function(error) {
                console.log(error);
            });
        } else{
          alert('Passwords do not match.');
        }
    })
});