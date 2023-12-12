import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDoc, getDocs, doc, query, where, updateDoc, setDoc, addDoc} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

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
    const auth = getAuth();
    const db = getFirestore(app);
    
    // Signed in
    onAuthStateChanged(auth, (user) => {
        if(user){
            // Display Username
            document.getElementById('username').innerHTML = user.displayName;

            // Create cache for specified project
            async function retrieveData() {
                const q = query(collection(db, "projects"), where("ownerUID", "==", user.uid), where("selected", "==", true));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((project) => {
                    const projectRef = doc(db, 'projects', project.id);
                    localStorage.setItem('Project ID', project.id);
                    updateDoc(projectRef, {
                    selected: false
                    });
                return projectRef;
                });
            }

            function addElement(text){
                let element = document.createElement('td');
                element.textContent = text;
                return element;
            }

            async function loadDynamicElements() {
                await retrieveData();
                const projectID = localStorage.getItem('Project ID');
                const docRef = doc(db, 'projects', projectID);
                const docSnap = await getDoc(docRef);

                // Set Title
                const title = document.getElementById('title');
                title.innerHTML = 'Project' + ' - ' + docSnap.data().title;

                // Create a new ticket
                const newTicket = document.querySelector('#create-ticket');
                newTicket.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const title = newTicket['ticket-title'].value;
                    const priority = newTicket['ticket-priority'].value;
                    const type = newTicket['ticket-type'].value;
                    const description = newTicket['description'].value;

                    async function setDocument(){
                        let tickets = docSnap.data().ticketsFiled;
                        const subRef = doc(db, 'projects', docSnap.id, 'tickets', String(tickets));
                        await setDoc((subRef), {
                            title: title,
                            priority: priority,
                            type: type,
                            description: description,
                            author: user.displayName
                        });

                        const projectRef = doc(db, 'projects', docSnap.id);
                        updateDoc(projectRef, {
                            ticketsFiled: tickets + 1
                        });
                        
                        location.reload();
                    }
                    setDocument();
                });

                // Add tickets
                const q = query(collection(db, "projects", docSnap.id, 'tickets'));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((docs) => {
                const tickets = document.getElementById('tickets');
                let ticketTitle = addElement(docs.data().title);
                let ticketDescription = addElement(docs.data().description);
                let ticketPriority = addElement(docs.data().priority);
                let ticketType = addElement(docs.data().type);
                let ticketAuthor = addElement(docs.data().author);
                let ticketStatus = addElement('Open');
                let ticketAge = addElement(Date());
                let ticketModified = addElement(Date());
                let ticketComment = addElement('');
                let tableRow = document.createElement('tr');
                tickets.appendChild(tableRow);
                tickets.appendChild(ticketTitle);
                tickets.appendChild(ticketDescription);
                tickets.appendChild(ticketPriority);
                tickets.appendChild(ticketType);
                tickets.appendChild(ticketAuthor);
                tickets.appendChild(ticketStatus);
                tickets.appendChild(ticketAge);
                tickets.appendChild(ticketModified);
                tickets.appendChild(ticketComment);
                });
            }

            loadDynamicElements();

            // Sign Out Button
            const signOut = document.getElementById("sign-out");
            signOut.onclick = () => auth.signOut();
        } else {
            // Redirect signed out users to login page
            window.location.href='login.html';
        }
        
    });


});