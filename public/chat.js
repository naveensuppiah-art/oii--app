import {
initializeApp
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
onSnapshot,
query,
orderBy
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// FIREBASE CONFIG

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain:
"YOUR_DOMAIN",

projectId:
"YOUR_PROJECT_ID",

storageBucket:
"YOUR_BUCKET",

messagingSenderId:
"YOUR_SENDER_ID",

appId:
"YOUR_APP_ID"

};


// INIT

const app =
initializeApp(
firebaseConfig
);

const db =
getFirestore(app);


// ELEMENTS

const chatBox =
document.getElementById(
"chatBox"
);

const msg =
document.getElementById(
"msg"
);

const send =
document.getElementById(
"send"
);
const chatBox =
document.getElementById(
"chatBox"
);
// TYPING TEXT

const typing =
document.createElement("div");

typing.style.color =
"#aaa";

typing.style.fontSize =
"13px";

typing.style.margin =
"10px";

document.body.appendChild(
typing
);
// SHOW TYPING

msg.oninput(
"input",
()=>{

typing.innerHTML =
"Typing...";

clearTimeout(
window.typingTimeout
);

window.typingTimeout =
setTimeout(()=>{

typing.innerHTML =
"";

},1000);

});


// SEND MESSAGE

send.onclick =
async () => {

if(msg.value.trim()
=== "") return;

await addDoc(
collection(
db,
"strangerChat"
),
{

text:
msg.value,

time:
Date.now()

}
);

msg.value = "";

};


// REALTIME RECEIVE

const q =
query(
collection(
db,
"strangerChat"
),
orderBy(
"time"
)
);

onSnapshot(q,
(snapshot) => {

chatBox.innerHTML =
"";

snapshot.forEach(
(doc) => {

const div =
document.createElement(
"div"
);

div.innerHTML =
doc.data().text;

div.style.color =
"white";

div.style.margin =
"10px";

chatBox.appendChild(
div
);

});

chatBox.scrollTop =
chatBox.scrollHeight;

});