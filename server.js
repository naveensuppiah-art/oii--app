const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();



// ======================
// STATIC FOLDERS
// ======================

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);



// ======================
// MULTER STORAGE
// ======================

const storage = multer.diskStorage({

  destination: function(req, file, cb) {

    cb(null, "uploads/");

  },

  filename: function(req, file, cb) {

    cb(
      null,
      Date.now() + ".mp4"
    );

  }

});

const upload = multer({
  storage: storage
});



// ======================
// LOGIN PAGE
// ======================

app.get("/", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,"public","login.html"
    )
  );

});



// ======================
// REELS PAGE
// ======================

app.get("/reels", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "public","reels.html"
    )
  );

});
app.get("/profile", (req, res) => {

  res.sendFile(
    path.join(__dirname,
    "public",
    "profile.html"
   )
  );
});


// ======================
// GET REELS API
// ======================

app.get("/api/reels", (req, res) => {

  fs.readdir(
    "./uploads",
    (err, files) => {

      if (err) {

        return res.json([]);

      }

      const videos =
        files.filter((file) => {

          return (
            file.endsWith(".mp4")
          );

        });

      res.json(videos);

    }
  );

});



// ======================
// VIDEO UPLOAD API
// ======================

app.post("/upload",upload.single("file"),
(req,res)=>{
const reelData = {

id:
Date.now(),

user:
req.body.username,

video:
req.file.filename,

time:
new Date()

};
const caption =
req.body.caption || "";

fs.writeFileSync(

"./uploads/" +
req.file.filename +
".txt",

caption

);

res.json({
success:true
});

}
);



// ======================
// START SERVER
// ======================

app.listen(5000,"0.0.0.0", () => {
    console.log("Server running on port 5000");
});