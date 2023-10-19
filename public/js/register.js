const signupForm = document.querySelector('#user-signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get user info
    const first = signupForm['user-first'].value;
    const last = signupForm['user-last'].value;
    const email = signupForm['user-email'].value;
    const password = signupForm['user-password'].value;
    const confirmPassword = signupForm['user-confirmpassword'].value;

    // Sign up the user
    firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred.user)
    })
})