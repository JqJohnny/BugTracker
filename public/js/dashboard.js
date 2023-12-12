import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, setDoc, getDocs, doc, query, where} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

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
    const auth = firebase.auth();
    const db = getFirestore(app);
    
    // Signed in
    auth.onAuthStateChanged(user => {
        if(user){
            // Display Username
            document.getElementById('username').innerHTML = user.displayName;

            // Create Project Button
            const newProjectForm = document.querySelector('#create-project');
            newProjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = newProjectForm['project-title'].value;
                const contributors = user.displayName + ', ' + newProjectForm['contributors'].value;
                const description = newProjectForm['description'].value;

                setDoc(doc(db, 'projects', title), {
                    ownerUID: user.uid,
                    ownerName: user.displayName,
                    contributors: contributors,
                    description: description,
                    lastmodified: Date()
                });

                $('#newProjectModal').modal('hide');
            });

            // Display Projects
            async function displayProject() {
                const q = query(collection(db, "projects"), where("ownerUID", "==", user.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                const projects = document.getElementById('projects');
                let div = document.createElement('div');
                div.className = 'card-body d-flex flex-row align-items-center justify-content-between';
                let title = document.createElement('div');
                title.textContent = doc.id;
                title.className = 'm-0 font-weight-bold text-primary w-25';
                let contributors = document.createElement('div');
                contributors.textContent = doc.data().contributors
                contributors.className = 'm-0 font-weight-bold text-primary w-25';
                let description = document.createElement('div');
                description.textContent = doc.data().description;
                description.className = 'm-0 font-weight-bold text-primary w-100';
                let button = document.createElement('button');
                button.textContent = 'Open Project';
                button.className = 'btn btn-primary';
                button.type = 'button'
                projects.appendChild(div);
                div.appendChild(title);
                div.appendChild(contributors);
                div.appendChild(description);
                div.appendChild(button);
                console.log(doc.id, " => ", doc.data());
                });
            }

            displayProject();

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