document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    const db = firebase.firestore();
    const auth = firebase.auth();

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
            firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
                const user = cred.user;
                user.updateProfile({
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