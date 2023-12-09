document.addEventListener("DOMContentLoaded", event => {

    const app = firebase.app()
});

function defaultLogin() {
    const loginForm = document.querySelector('#login-account')

    const email = loginForm['email-login'].value;
    const password = loginForm['password-login'].value;
    firebase.auth().signInWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user;
                window.location.href='dashboard.html';
                console.log(user)
            })
            .catch(console.log)
}

function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(provider)
            .then(result => {
                const user = result.user;
                window.location.href='dashboard.html';
                console.log(user)
            })
            .catch(console.log)
}