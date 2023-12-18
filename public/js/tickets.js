import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDoc, getDocs, doc, query, where, updateDoc, setDoc, addDoc} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
import { getPerformance} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-performance.js";

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
    const db = getFirestore(app);
    const perf = getPerformance(app);

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

                let status;

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
                            author: user.displayName,
                            status: 'New',
                            publish: Date(),
                            lastUpdate: Date(),
                            comments: ''
                        });

                        // Ticket Counter
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
                let ticketStatus = addElement(docs.data().status);
                let ticketAge = addElement(docs.data().publish);
                let ticketModified = addElement(docs.data().lastUpdate);
                let ticketComments = addElement(docs.data().comments);
                let tableRow = document.createElement('tr');
                tableRow.setAttribute('role', 'button');
                tableRow.setAttribute('id', docs.id);
                tickets.appendChild(tableRow);
                tableRow.appendChild(ticketTitle);
                tableRow.appendChild(ticketDescription);
                tableRow.appendChild(ticketPriority);
                tableRow.appendChild(ticketType);
                tableRow.appendChild(ticketAuthor);
                tableRow.appendChild(ticketStatus);
                tableRow.appendChild(ticketAge);
                tableRow.appendChild(ticketModified);
                tableRow.appendChild(ticketComments);

                // Edit tickets
                document.getElementById(docs.id).onclick = function (){
                    $("#editTicketModal").modal();
                    const editTicket = document.querySelector('#edit-ticket');
                    status = editTicket['ticket-status'].value;
                    editTicket['ticket-title'].value = docs.data().title;
                    editTicket['ticket-priority'].value = docs.data().priority;
                    editTicket['ticket-status'].value = docs.data().status;
                    editTicket['ticket-type'].value = docs.data().type;
                    editTicket['description'].value = docs.data().description;
                    if (docs.data().comments != undefined) {
                        editTicket['comments'].value = docs.data().comments;
                    }
                    editTicket['ticket-number'].value = docs.id;
                }
                });
                
                // Submit Edit
                const editTicket = document.querySelector('#edit-ticket');
                editTicket.addEventListener('submit', (e) => {
                    e.preventDefault();
                    let statusUpdate = editTicket['ticket-status'].value;
                    if(statusUpdate != status ){
                        const projectRef = doc(db, 'projects', docSnap.id);
                        if (statusUpdate === 'Resolved') {
                            updateDoc(projectRef, {
                                ticketsCompleted: docSnap.data().ticketsCompleted + 1
                            });
                        } else if (status === 'Resolved') {
                            updateDoc(projectRef, {
                                ticketsCompleted: docSnap.data().ticketsCompleted - 1
                        })
                    }}

                    async function updateDocument(){
                        const subRef = doc(db, 'projects', docSnap.id, 'tickets', String(editTicket['ticket-number'].value));
                        await updateDoc((subRef), {
                            title: editTicket['ticket-title'].value,
                            priority: editTicket['ticket-priority'].value,
                            type: editTicket['ticket-type'].value,
                            description: editTicket['description'].value,
                            status: statusUpdate,
                            lastUpdate: Date(),
                            comments: editTicket['comments'].value,
                            
                        });
                    
                        location.reload();
                    }
                    updateDocument();
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