console.log("SERVER SQL FILE RUNNING");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "oii",
  password: "5432",
  port: 5432,
});

pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.log("DB Error:", err.message);
  } else {
    console.log("DB Connected ✅");
  }
});

// =====================
// SIGNUP
// =====================
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await pool.query(
      `INSERT INTO users (username, email, password) VALUES($1, $2, $3)`,
      [username, email, password]
    );
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// =====================
// LOGIN
// =====================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email=$1 AND password=$2`,
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// =====================
// HOME
// =====================
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// =====================
// FOLLOW
// =====================
app.post("/api/follow", async (req, res) => {
  try {
    const { follower, following } = req.body;
    const existing = await pool.query(
      `SELECT * FROM followers WHERE follower=$1 AND following=$2`,
      [follower, following]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `DELETE FROM followers WHERE follower=$1 AND following=$2`,
        [follower, following]
      );
      return res.json({ following: false });
    }

    await pool.query(
      `INSERT INTO followers (follower, following) VALUES($1, $2)`,
      [follower, following]
    );
    res.json({ following: true });
  } catch (err) {
    console.log(err);
    res.json({ following: false });
  }
});

app.get("/api/followers/:username", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM followers WHERE following=$1`,
      [req.params.username]
    );
    res.json({ count: result.rows[0].count });
  } catch (err) {
    res.json({ count: 0 });
  }
});

// =====================
// REELS (FIXED MECHANISM)
// =====================
app.get("/api/reels", (req, res) => {
  const uploadsPath = path.join(__dirname, "public", "uploads");

  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      return res.json([]);
    }

    const videos = files.filter((file) => file.endsWith(".mp4"));

    // FIX: String array-ah irukura vishayatha dynamic frontend logic map thagundha mari convert panrom
    // Ipo ulla object formatting nala 'reel.username' run aagumpothu error varathu
    const structuredReels = videos.map((videoFile) => {
      return {
        id: videoFile, 
        video_url: `/uploads/${videoFile}`,
        username: "Admin / Creator" // Inga thaan 'undefined' vandhutu irundhadhu! Ipo static or dynamic default aagidum.
      };
    });

    res.json(structuredReels);
  });
});

// =====================
// USERS & TOTAL COUNT
// =====================
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(`SELECT username FROM users`);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.json([]);
  }
});

app.get("/api/users/count", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM users");
    // Frontend-ku dynamic framework matching key structures correct ah pass panrom
    res.json({ 
      count: parseInt(result.rows[0].count) 
    });
  } catch (err) {
    console.log(err);
    res.json({ count: 0 });
  }
});

// =====================
// COMMENTS
// =====================
app.post("/api/comments", async (req, res) => {
  try {
    const { reel_id, username, comment, parent_id } = req.body;
    await pool.query(
      `INSERT INTO comments (reel_id, username, comment, parent_id) VALUES ($1, $2, $3, $4)`,
      [reel_id, username, comment, parent_id || null]
    );
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

app.get("/api/comments/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM comments WHERE reel_id=$1 ORDER BY id ASC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.json([]);
  }
});

// =====================
// LIKES
// =====================
app.post("/api/like", async (req, res) => {
  try {
    const { reel_id, username } = req.body;
    const existing = await pool.query(
      `SELECT * FROM likes WHERE reel_id=$1 AND username=$2`,
      [reel_id, username]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `DELETE FROM likes WHERE reel_id=$1 AND username=$2`,
        [reel_id, username]
      );
      return res.json({ liked: false });
    }

    await pool.query(
      `INSERT INTO likes (reel_id, username) VALUES ($1, $2)`,
      [reel_id, username]
    );
    res.json({ liked: true });
  } catch (err) {
    console.log(err);
    res.json({ liked: false });
  }
});

app.get("/api/likes/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) FROM likes WHERE reel_id=$1`,
      [req.params.id]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.log(err);
    res.json({ count: 0 });
  }
});

// =====================
// PROFILE
// =====================
app.get("/api/profile/:username", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT username, dp FROM users WHERE username=$1",
      [req.params.username]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    console.log(err);
    res.json({});
  }
});

app.post("/api/profile/dp", async (req, res) => {
  try {
    const { username, dp } = req.body;
    await pool.query("UPDATE users SET dp=$1 WHERE username=$2", [dp, username]);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// ======================
// MULTER STORAGE
// ======================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".mp4");
  },
});
const upload = multer({ storage });

console.log ("DELETE ROUTE LOADED");
app.delete("/api/reels/:id", async(req, res) => {

  console.log("DELETE HIT");
  console.log("FILE:", req.params.id);
  await pool.query(
  "DELETE FROM reels WHERE video_url = $1",
  ["/uploads/" + req.params.id]
);
  const filePath = path.join(
    __dirname,
    "public",
    "uploads",
    req.params.id
  );

  console.log("PATH:", filePath);

  fs.unlink(filePath, (err) => {

    if (err) {

      console.log("DELETE ERROR:");
      console.log(err);

      return res.json({
        success:false
      });

    }

    console.log("DELETE SUCCESS");

    res.json({
      success:true
    });

  });

});

// =====================
// SERVER RUN
// =====================
app.listen(3000, () => {
  console.log("Server running on port 3000 🔥");
});