document.getElementById('reset-password').onclick = function() {
    const email = user['user-email'].value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log('Password reset email sent!');
            // Add visual confirmation for the user
        })
        .catch((error) => {
            // Handle errors and display them to the user
        });
};