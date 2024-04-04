import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


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
    
    document.getElementById('reset-password').onclick = function() {
        const email = document.getElementById('user-email');
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent!');
                // Add visual confirmation for the user
            })
            .catch((error) => {
                // Handle errors and display them to the user
            });
    };

});