 const feed = document.getElementById("feed");
const dp =
document.getElementById("dp");
const usernameText =
document.getElementById(
"usernameText"
);

if(usernameText){

usernameText.innerHTML =
localStorage.getItem(
"username"
) || "User";

}
const popupName =
document.getElementById(
"popupName"
);

{

popupName.innerHTML =
localStorage.getItem(
"username"
) || "User";

}
dp.onclick = () => {

window.location.href =
"/profile.html";

};

const savedDp =
localStorage.getItem("dp");

if(savedDp){

dp.innerHTML = `
<img
src="${savedDp}"
style="
width:100%;
height:100%;
border-radius:50%;
object-fit:cover;
">
`;

}

async function loadReels() {

    feed.innerHTML = "";

    const res = await fetch("/api/reels");
    const reels = await res.json();

    reels.reverse();

    reels.forEach((reelData, index) => {

        const reel = document.createElement("div");
        reel.className = "reel";
        reel.style.height = "100vh";
        reel.style.position = "relative";
        reel.style.background = "black";

        const video = document.createElement("video");
        video.src = reelData.video_url;
        reel.style.height = "100vh";
video.style.width = "100vw";
video.style.height = "100vh";
video.style.objectFit = "contain";
        video.loop = true;
        video.playsInline = true;

        reel.appendChild(video);

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }

            });

        }, {
            threshold: 0.7
        });

        observer.observe(reel);

        const actions = document.createElement("div");
        actions.style.position = "absolute";
        actions.style.right = "15px";
        actions.style.bottom = "120px";
        actions.style.display = "flex";
        actions.style.flexDirection = "column";
        actions.style.gap = "15px";

        function makeBtn(icon) {

            const btn = document.createElement("button");

            btn.innerHTML = icon;
            btn.style.width = "55px";
            btn.style.height = "55px";
            btn.style.borderRadius = "50%";
            btn.style.fontSize = "22px";
            btn.style.background ="rgba(0,0,0,.45)";
            btn.style.backdropFilter ="blur(10px)";
            btn.style.border ="1px solid rgba(255,255,255,.15)";
            btn.style.color ="white";
            btn.style.boxShadow ="0 4px 20px rgba(0,0,0,.3)";

            return btn;
        }

       const likeWrap =
document.createElement("div");

const likeBtn =
makeBtn("❤️");

const likeCount =
document.createElement("div");

likeCount.style.color =
"white";

likeCount.style.textAlign =
"center";
console.log("Loading likes", index);
fetch("/api/likes/" + index)
.then(r => 
    r.json())
.then(data => {

    likeCount.innerHTML =
    data.count;

});

likeBtn.onclick = async () => {

    const res =
    await fetch("/api/like",{
        method:"POST",
        headers:{
            "Content-Type":
            "application/json"
        },
        body:JSON.stringify({
            reel_id:index,
            username:
            localStorage.getItem(
                "username"
            ) || "User"
        })
    });

    const data =
    await res.json();

    const countRes =
    await fetch(
        "/api/likes/" + index
    );

    const countData =
    await countRes.json();

    likeCount.innerHTML =
    countData.count;

};

likeWrap.appendChild(
    likeBtn
);

likeWrap.appendChild(
    likeCount
);
        const commentBtn = makeBtn("💬");
        const shareBtn = makeBtn("🔗");

        const commentPanel = document.createElement("div");

        commentPanel.style.position = "fixed";
        commentPanel.style.bottom = "0";
        commentPanel.style.left = "0";
        commentPanel.style.width = "100%";
        commentPanel.style.height = "60%";
        commentPanel.style.background = "white";
        commentPanel.style.zIndex = "9999";
        commentPanel.style.display = "none";
        commentPanel.style.overflowY = "auto";
        commentPanel.style.padding = "15px";

        document.body.appendChild(commentPanel);

        commentBtn.onclick = async () => {

            const commentsRes =
            await fetch("/api/comments/" + index);

            const comments =
            await commentsRes.json();

            commentPanel.innerHTML = `
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:15px;
            ">
                <h3>Comments</h3>

                <div>
                    <button id="addComment">
                        ➕
                    </button>

                    <button id="closeComments">
                        ❌
                    </button>
                </div>
            </div>
            `;

            document.getElementById(
                "closeComments"
            ).onclick = () => {

                commentPanel.style.display =
                "none";

            };

            document.getElementById(
                "addComment"
            ).onclick = async () => {

                const text =
                prompt("Enter Comment");

                if(!text) return;

                await fetch(
                    "/api/comments",
                    {
                        method:"POST",
                        headers:{
                            "Content-Type":
                            "application/json"
                        },
                        body:JSON.stringify({
                            reel_id:index,
                            username:
                            localStorage.getItem(
                                "username"
                            ) || "User",
                            comment:text,
                            parent_id:null
                        })
                    }
                );

                commentBtn.click();

            };
            const normalComments =comments.filter(c => !c.parent_id);

            const replyComments =comments.filter(c => c.parent_id);
            normalComments.forEach(c => {

                const div =
                document.createElement("div");

                div.style.padding =
                "10px";

                div.style.borderBottom =
                "1px solid #ddd";

                if(c.parent_id){

                    div.style.marginLeft =
                    "40px";

                    div.style.background =
                    "#f5f5f5";

                    div.style.borderRadius =
                    "10px";

                }

                div.innerHTML = `
                <b>${c.username}</b>
                <br>
                ${c.comment}
                <br><br>

                <button class="replyBtn">
                    ↩ Reply
                </button>
                `;

                const replyBtn =
                div.querySelector(
                    ".replyBtn"
                );

                replyBtn.onclick =
                async () => {

                    const reply =
                    prompt(
                        "Enter Reply"
                    );

                    if(!reply) return;

                    await fetch(
                        "/api/comments",
                        {
                            method:"POST",
                            headers:{
                                "Content-Type":
                                "application/json"
                            },
                            body:JSON.stringify({
                                reel_id:index,
                                username:
                                localStorage.getItem(
                                    "username"
                                ) || "User",
                                comment:reply,
                                parent_id:c.id
                            })
                        }
                    );

                    commentBtn.click();

                };

                commentPanel.appendChild(div);
                replyComments
.filter(r => r.parent_id === c.id)
.forEach(r => {

    const replyDiv =
    document.createElement("div");

    replyDiv.style.marginLeft = "40px";
    replyDiv.style.background = "#f5f5f5";
    replyDiv.style.padding = "10px";
    replyDiv.style.borderRadius = "10px";

    replyDiv.innerHTML =
    "<b>" + r.username + "</b><br>" +
    r.comment;
    console.log("REPLY FOUND", r);
    commentPanel.appendChild(replyDiv);

});

            });

            commentPanel.style.display =
            "block";

        };

        shareBtn.onclick = () => {

            navigator.clipboard.writeText(
                location.href
            );

            alert("Link Copied");

        };
        const searchBtn =
document.getElementById(
"searchBtn"
);

if(searchBtn){

searchBtn.onclick = () => {

window.location.href =
"/search.html";

};

}
        actions.appendChild(likeWrap);
        actions.appendChild(commentBtn);
        actions.appendChild(shareBtn);

        reel.appendChild(actions);

        feed.appendChild(reel);

    });

}
const videoUpload =
document.getElementById(
"videoUpload"
);

videoUpload.onchange =
async (e) => {

const file =
e.target.files[0];

if(!file) return;

const formData =
new FormData();

formData.append(
"file",
file
);
formData.append(
  "username",
  localStorage.getItem(
    "username"
  )
);
try{

const res =
await fetch(
"/upload",
{
method:"POST",
body:formData
}
);

const data =
await res.json();

alert(
"Upload Success"
);

loadReels();

}catch(err){

alert(
"Upload Failed"
);


}

};
const followBtn =
document.getElementById(
  "followBtn"
);

if(followBtn){

followBtn.onclick =
async () => {

  const follower =
  localStorage.getItem(
    "username"
  );

  const following =
  name.innerHTML;

  await fetch(
    "/api/follow",
    {
      method:"POST",
      headers:{
        "Content-Type":
        "application/json"
      },
      body:JSON.stringify({
        follower,
        following
      })
    }
  );

  loadFollowers();

};

}
loadReels ();