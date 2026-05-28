import {
initializeApp
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getDatabase,
ref,
push,
onChildAdded
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
getStorage,
ref as storageRef,
uploadBytes,
getDownloadURL
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {

apiKey:
"AIzaSyBSPst1YvKZHuAH082jOr8iOFHtp5yqXms",

authDomain:
"oii-f5297.firebaseapp.com",

databaseURL:
"https://oii-f5297-default-rtdb.asia-southeast1.firebasedatabase.app",

projectId:
"oii-f5297",

storageBucket:
"oii-f5297.firebasestorage.app",

messagingSenderId:
"390917741842",

appId:
"1:390917741842:web:a557fd4165660b652ce7cb",

measurementId:
"G-WXYLV585M2"

};
const app =
initializeApp(firebaseConfig);

const db =
getDatabase(app);

// ======================
// FEED
// ======================

const feed =
document.getElementById("feed");


// ======================
// LOAD REELS
// ======================

async function loadReels(){

feed.innerHTML = "";

const res =
await fetch("/api/reels");

const reels =
await res.json();

reels.reverse();
const followingOnly =
localStorage.getItem(
"following_only"
);

if(
followingOnly
&&
!localStorage.getItem(
"follow_" + index
)
){

return;

}
reels.forEach((file,index)=>{


// ======================
// REEL
// ======================

const reel =
document.createElement("div");

reel.className =
"reel";

reel.style.position =
"relative";

reel.style.width =
"100%";

reel.style.height =
"100vh";

reel.style.overflow =
"hidden";

reel.style.background =
"black";


// ======================
// VIDEO
// ======================

const video =
document.createElement("video");
// LOADING TEXT

const loading =
document.createElement("div");

loading.innerHTML =
"Loading...";

loading.style.position =
"absolute";

loading.style.top =
"50%";

loading.style.left =
"50%";

loading.style.transform =
"translate(-50%,-50%)";

loading.style.color =
"white";

loading.style.fontSize =
"18px";

loading.style.zIndex =
"999";

reel.appendChild(loading);


// HIDE AFTER LOAD

video.onloadeddata = () => {

loading.style.display =
"none";

};

video.src =
"/uploads/" + file;

video.autoplay =
false;

video.loop =
true;

video.muted =
false;

video.playsInline =
true;

video.controls =
false;

video.style.width =
"100%";

video.style.height =
"100%";

video.style.objectFit =
"cover";

reel.appendChild(video);
// TAP TO PAUSE / PLAY

video.onclick = () => {

if(video.paused){

video.play();

}else{

video.pause();

}

};
// TAP TO PAUSE + HIDE UI

video.onclick = () => {

if(video.paused){

video.play();

}else{

video.pause();

}

if(
actions.style.opacity ===
"0"
){

actions.style.opacity =
"1";

topBar.style.opacity =
"1";

}else{

actions.style.opacity =
"0";

topBar.style.opacity =
"0";

}

};


// PLAY ONLY VISIBLE VIDEO

const observer =
new IntersectionObserver(
(entries)=>{

entries.forEach((entry)=>{

if(entry.isIntersecting){

video.play();

}else{

video.pause();

}

});

},
{
threshold:0.7
}
);

observer.observe(reel);


// ======================
// TOP BAR
// ======================

const topBar =
document.createElement("div");

topBar.style.position =
"absolute";

topBar.style.top =
"15px";

topBar.style.left =
"15px";

topBar.style.right =
"15px";

topBar.style.display =
"flex";

topBar.style.alignItems =
"center";

topBar.style.justifyContent =
"space-between";

topBar.style.zIndex =
"10";


// ======================
// PROFILE
// ======================

const profile =
document.createElement("div");

profile.style.display =
"flex";

profile.style.alignItems =
"center";

profile.style.gap =
"10px";


// ======================
// DP
// ======================

const dp =
document.createElement("div");
dp.style.cursor =
"pointer";

dp.onclick = () => {

window.location.href =
"/profile.html";

};

dp.style.width =
"42px";

dp.style.height =
"42px";

dp.style.borderRadius =
"50%";

dp.style.background =
"rgba(255,255,255,0.2)";

dp.style.backdropFilter =
"blur(10px)";

dp.style.display =
"flex";

dp.style.alignItems =
"center";

dp.style.justifyContent =
"center";

dp.style.overflow =
"hidden";

dp.style.border =
"2px solid hotpink";


 //LOAD SAVED DP

const savedDp =
localStorage.getItem("dp");

if(savedDp){

const img =
document.createElement("img");

img.src =
savedDp;

img.style.width =
"100%";

img.style.height =
"100%";

img.style.objectFit =
"cover";
img.style.pointerEvents =
"none";
dp.appendChild(img);

}else{

dp.innerHTML =
"👤";

dp.style.color =
"white";

dp.style.fontSize =
"20px";

}


// CHANGE DP

dp.onclick = ()=>{

window.location.href =
"/profile.html";

const picker =
document.createElement("input");

picker.type =
"file";

picker.accept =
"image/*";

picker.click();

picker.onchange = () => {

const file =
picker.files[0];

const refPath =
storageRef(
storage,
"dp/" + Date.now()
);

uploadBytes(
refPath,
file
)

.then(()=>{

return getDownloadURL(
refPath
);

})

.then((url)=>{

localStorage.setItem(
"dp",
url
);

location.reload();

});

};
};
// ======================
// USERNAME
// ======================

const username =
document.createElement("div");

username.innerHTML =
localStorage.getItem(
"username"
) || "Oii User";

username.style.color =
"white";

username.style.fontWeight =
"bold";

username.style.fontSize =
"16px";

username.style.textShadow =
"0 0 10px black";
// CHANGE USERNAME

username.onclick = () => {

const newName =
prompt(
"Enter Username"
);

if(newName){

localStorage.setItem(
"username",
newName
);

username.innerHTML =
newName;

}

};

// APPEND PROFILE

profile.appendChild(dp);

profile.appendChild(username);


// ======================
// FOLLOW BUTTON
// ======================

const followBtn =
document.createElement("button");

followBtn.innerHTML =
"Follow";

followBtn.style.border =
"none";

followBtn.style.padding =
"5px 10px";

followBtn.style.borderRadius =
"20px";

followBtn.style.fontWeight =
"bold";

followBtn.style.fontSize =
"13px";

followBtn.style.minWidth =
"70px";

followBtn.style.cursor =
"pointer";

followBtn.style.background =
"white";

let followed =
localStorage.getItem(
"follow_" + index
);

if(followed){

followBtn.innerHTML =
"Following";

followBtn.style.background =
"hotpink";

followBtn.style.color =
"white";

}

followBtn.onclick = () => {

if(followed){

localStorage.removeItem(
"follow_" + index
);

followed = false;

followBtn.innerHTML =
"Follow";

followBtn.style.background =
"white";

followBtn.style.color =
"black";

}else{

localStorage.setItem(
"follow_" + index,
true
);

followed = true;

followBtn.innerHTML =
"Following";

followBtn.style.background =
"hotpink";

followBtn.style.color =
"white";

}

};


// APPEND TOPBAR

topBar.appendChild(profile);

topBar.appendChild(followBtn);

reel.appendChild(topBar);


// ======================
// RIGHT ACTIONS
// ======================

const actions =
document.createElement("div");

actions.style.position =
"absolute";

actions.style.right =
"12px";

actions.style.bottom =
"120px";

actions.style.display =
"flex";

actions.style.flexDirection =
"column";

actions.style.alignItems =
"center";

actions.style.gap =
"18px";

actions.style.zIndex =
"10";
// ======================
// SAVE REEL
// ======================

const saveWrap =
document.createElement("div");

saveWrap.style.textAlign =
"center";

const saveBtn =
document.createElement("button");

styleBtn(saveBtn);


// CHECK SAVED

let saved =
localStorage.getItem(
"saved_" + index
);

if(saved){

saveBtn.innerHTML =
"📌";

}else{

saveBtn.innerHTML =
"🔖";

}


// TOGGLE SAVE

saveBtn.onclick = () => {

if(saved){

localStorage.removeItem(
"saved_" + index
);

saved = false;

saveBtn.innerHTML =
"🔖";

}else{

localStorage.setItem(
"saved_" + index,
true
);

saved = true;

saveBtn.innerHTML =
"📌";

}

};

saveWrap.appendChild(
saveBtn
);

actions.appendChild(
saveWrap
);

// BUTTON STYLE

function styleBtn(btn){

btn.style.width =
"50px";

btn.style.height =
"50px";

btn.style.border =
"none";

btn.style.borderRadius =
"50%";

btn.style.background =
"rgba(0,0,0,0.35)";

btn.style.backdropFilter =
"blur(10px)";

btn.style.color =
"white";

btn.style.fontSize =
"22px";

btn.style.cursor =
"pointer";

}


// ======================
// LIKE
// ======================

const likeWrap =
document.createElement("div");

likeWrap.style.textAlign =
"center";

const likeBtn =
document.createElement("button");

styleBtn(likeBtn);

likeBtn.innerHTML =
"❤️";

let likes =
localStorage.getItem(
"likes_" + index
) || 0;

const likeCount =
document.createElement("div");

likeCount.innerHTML =
likes;

likeCount.style.color =
"white";

likeCount.style.fontSize =
"14px";

likeCount.style.marginTop =
"5px";

likeBtn.onclick = () => {

likes++;

localStorage.setItem(
"likes_" + index,
likes
);

likeCount.innerHTML =
likes;

// HEART POPUP

const heart =
document.createElement("div");

heart.innerHTML =
"❤️";

heart.style.position =
"absolute";

heart.style.top =
"50%";

heart.style.left =
"50%";

heart.style.transform =
"translate(-50%,-50%)";

heart.style.fontSize =
"90px";

heart.style.zIndex =
"99999";

heart.style.animation =
"heartPop 0.8s ease";

reel.appendChild(heart);

setTimeout(()=>{

heart.remove();

},800);
};

likeWrap.appendChild(likeBtn);

likeWrap.appendChild(likeCount);

actions.appendChild(likeWrap);
// ======================
// VIEW COUNT
// ======================

const viewWrap =
document.createElement("div");

viewWrap.style.textAlign =
"center";

let views =
localStorage.getItem(
"views_" + index
) || 0;

views++;

localStorage.setItem(
"views_" + index,
views
);

const viewText =
document.createElement("div");

viewText.innerHTML =
"👀 " + views;

viewText.style.color =
"white";

viewText.style.fontSize =
"14px";

viewWrap.appendChild(
viewText
);

actions.appendChild(
viewWrap
);


// ======================
// COMMENT
// ======================

const commentWrap =
document.createElement("div");

commentWrap.style.textAlign =
"center";

const commentBtn =
document.createElement("button");

styleBtn(commentBtn);

commentBtn.innerHTML =
"💬";

let comments =
JSON.parse(
localStorage.getItem(
"comments_" + index
)
) || [];

const commentCount =
document.createElement("div");

commentCount.innerHTML =
comments.length;

commentCount.style.color =
"white";

commentCount.style.fontSize =
"14px";

commentCount.style.marginTop =
"5px";

// REALTIME COMMENT

commentBtn.onclick = () => {

const text =
prompt("Add Comment");

if(!text) return;

push(

ref(
db,
"comments/" + index
),

{

user:
localStorage.getItem(
"username"
) || "User",

text:text

}

);

};
// LIVE COMMENTS

onChildAdded(

ref(
db,
"comments/" + index
),

(snapshot)=>{

comments.push(
snapshot.val()
);

commentCount.innerHTML =
comments.length;

}
);

commentWrap.appendChild(commentBtn);

commentWrap.appendChild(commentCount);

actions.appendChild(commentWrap);


// ======================
// SHARE
// ======================

const shareWrap =
document.createElement("div");

shareWrap.style.textAlign =
"center";

const shareBtn =
document.createElement("button");

styleBtn(shareBtn);

shareBtn.innerHTML =
"🔗";

shareBtn.onclick =
async ()=>{

if(navigator.share){

await navigator.share({

title:"Oii",

url:window.location.href

});

}else{

navigator.clipboard.writeText(
window.location.href
);

alert("Link copied");

}

};

shareWrap.appendChild(shareBtn);

actions.appendChild(shareWrap);


// APPEND ACTIONS

reel.appendChild(actions);


// ======================
// CAPTION
// ======================

const caption =
document.createElement("div");

caption.innerHTML = "";

// TIME

const time =
document.createElement("div");

time.innerHTML =
"Just now";

time.style.color =
"#ccc";

time.style.fontSize =
"12px";

time.style.marginTop =
"5px";

caption.appendChild(time);

caption.style.position =
"absolute";

caption.style.left =
"20px";

caption.style.bottom =
"120px";

caption.style.color =
"white";

caption.style.fontWeight =
"bold";

caption.style.fontSize =
"15px";

caption.style.textShadow =
"0 0 10px black";

reel.appendChild(caption);


// ======================
// ADD REEL
// ======================

feed.appendChild(reel);
});
}

// ======================
// LOAD
// ======================

loadReels();


// ======================
// CHAT BUTTON
// ======================

const chatBtn =
document.createElement("button");

chatBtn.innerHTML =
"💬";

chatBtn.style.position =
"fixed";

chatBtn.style.left =
"20px";

chatBtn.style.bottom =
"150px";

chatBtn.style.width =
"55px";

chatBtn.style.height =
"55px";

chatBtn.style.border =
"none";

chatBtn.style.borderRadius =
"50%";

chatBtn.style.background =
"hotpink";

chatBtn.style.color =
"white";

chatBtn.style.fontSize =
"22px";

chatBtn.style.zIndex =
"99999";

chatBtn.style.cursor =
"pointer";

document.body.appendChild(
chatBtn
);

chatBtn.onclick = () => {

window.location.href =
"/chat.html";

};
// SEARCH BUTTON

const searchBtn =
document.createElement("button");

searchBtn.innerHTML =
"🔍";

searchBtn.style.position =
"fixed";

searchBtn.style.top =
"80px";

searchBtn.style.right =
"20px";

searchBtn.style.width =
"50px";

searchBtn.style.height =
"50px";

searchBtn.style.border =
"none";

searchBtn.style.borderRadius =
"50%";

searchBtn.style.background =
"hotpink";

searchBtn.style.color =
"white";

searchBtn.style.fontSize =
"20px";

searchBtn.style.zIndex =
"99999";

document.body.appendChild(
searchBtn
);

// OPEN SEARCH PAGE

searchBtn.onclick = () => {

window.location.href =
"/search.html";

};
// ======================
// NOTIFICATIONS
// ======================

function showNotification(text){

const note =
document.createElement("div");

note.innerHTML =
text;

note.style.position =
"fixed";

note.style.top =
"20px";

note.style.right =
"20px";

note.style.background =
"rgba(0,0,0,0.8)";

note.style.color =
"white";

note.style.padding =
"15px 20px";

note.style.borderRadius =
"15px";

note.style.zIndex =
"999999";

note.style.fontWeight =
"bold";

note.style.boxShadow =
"0 0 15px hotpink";

document.body.appendChild(
note
);

setTimeout(()=>{

note.remove();

},3000);

}


// DEMO NOTIFICATIONS

setTimeout(()=>{

showNotification(
"❤️ Someone liked your reel"
);

},4000);


setTimeout(()=>{

showNotification(
"💬 New comment received"
);

},8000);


setTimeout(()=>{

showNotification(
"👤 New follower"
);

},12000);
