document.addEventListener("DOMContentLoaded", event => {

    const app = firebase.app();
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    auth.onAuthStateChanged(user => {
        if(user){
            document.getElementById('username').innerHTML = user.displayName;
            const newProjectForm = document.querySelector('#create-project');

            newProjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = newProjectForm['project-title'].value;
                const contributors = newProjectForm['contributors'].value;
                const description = newProjectForm['description'].value;
                collection = db.collection('projects').doc(title);
                collection.set({
                    ownerUID: user.uid,
                    ownerName: user.displayName,
                    contributors: contributors,
                    description: description,
                    lastmodified: Date()
                });
                $('#newProjectModal').modal('hide');
            });
            // Sign Out Button

            const signOut = document.getElementById("sign-out");
            signOut.onclick = () => auth.signOut();
        } else {
            // Redirect signed out users to login page
            window.location.href='login.html';
        }
        
    });

    // Update ratings

});