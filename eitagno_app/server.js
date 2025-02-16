const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();
const SECRET_KEY = "your_secret_key"; // JWTの秘密鍵
const jwt = require("jsonwebtoken"); // JWTのため
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || "./tango-v3_fixed_all.db";

// Middleware
const corsOptions = {
    origin: "http://localhost:3000", // フロントエンドのURL
    methods: ["POST", "GET"],
    credentials: true, // クッキーや認証情報を含める場合
};

app.use(cors(corsOptions));
app.use(cookieParser()); // クッキーをパースするミドルウェア
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use(compression());
app.use(morgan("combined"));

// Database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});


// users テーブルの作成
db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            username TEXT NOT NULL
        )`,
        (err) => {
            if (err) {
                console.error("テーブル作成エラー:", err.message);
            } else {
                console.log("users テーブルが作成されました。");
            }
        }
    );
});

// ルート
app.get("/", (req, res) => {
    res.send("サーバーが正常に起動しています");
});

app.post("/register", async (req, res) => {
    const { email, password, username } = req.body;

    // リクエストデータをログ出力
    console.log("リクエストデータ:", req.body);

    if (!email || !password || !username) {
        return res.status(400).json({ error: "メールアドレス、パスワード、ユーザー名は必須です。" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (email, password, username) VALUES (?, ?, ?)";

        db.run(query, [email, hashedPassword, username], function (err) {
            if (err) {
                console.error("データベースエラー:", err.message); // エラー詳細をログに出力
                return res.status(500).json({ error: "登録中にエラーが発生しました。" });
            }
            res.status(201).json({ message: "登録成功！", userId: this.lastID });
        });
    } catch (error) {
        console.error("登録エラー:", error.message); // サーバーエラーの詳細をログに出力
        res.status(500).json({ error: "サーバーエラーが発生しました。" });
    }
});


// ログインエンドポイント
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "メールアドレスとパスワードは必須です。" });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    db.get(query, [email], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "メールアドレスまたはパスワードが間違っています。" });
        }

        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "メールアドレスまたはパスワードが間違っています。" });
            }

            // JWTトークンを生成
            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);

            // クッキーにトークンを保存
            res.cookie("token", token, { httpOnly: true , sameSite: "lax", secure: false});

            return res.status(200).json({ message: "ログイン成功！", userId: user.id });
        } catch (error) {
            console.error("ログインエラー:", error.message);
            return res.status(500).json({ error: "サーバーエラーが発生しました。" });
        }
    });
});

// 認証ミドルウェア
function authenticateToken(req, res, next) {
    
    const token = req.cookies.token;
    console.log("Cookies:", req.cookies); // クッキーの内容をログに出力

    if (!token) {
        return res.status(401).json({ error: "未認証のユーザーです。" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "トークンが無効です。" });
        req.user = user;
        next();
    });
}

// 認証状態を確認するエンドポイント
app.get("/profile", authenticateToken,(req, res) => {
    res.json({ message: "認証済みユーザーです。", user: req.user });
});

// 単語取得エンドポイント
app.get("/words/:level", (req, res) => {
    const level = parseInt(req.params.level, 10);
    const userId = req.query.userId || 1; // デフォルトのユーザーID

    const query = `
        SELECT id, word, jword 
        FROM word 
        WHERE level = ?
          AND id NOT IN (
              SELECT word_id 
              FROM history 
              WHERE user_id = ? AND date = date('now')
          )
        LIMIT 100
    `;

    db.all(query, [level, userId], (err, rows) => {
        if (err) {
            console.error("Error fetching words:", err.message);
            res.status(500).json({ error: "Failed to fetch words." });
            return;
        }

        const formattedRows = rows.map((row) => {
            const correctOption = { word: row.word, meaning: row.jword };

            const incorrectOptions = rows
                .filter((r) => r.id !== row.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 2)
                .map((r) => ({ word: r.word, meaning: r.jword }));

            const options = [correctOption, ...incorrectOptions].sort(() => Math.random() - 0.5);

            return {
                id: row.id,
                word: row.word,
                options,
                correctOption: options.indexOf(correctOption),
            };
        });

        res.json(formattedRows);
    });
});


// 履歴保存エンドポイント
app.post("/history", (req, res) => {
    const { wordId, userId = 1, state, date } = req.body;

    if (!wordId || !state || !date) {
        return res.status(400).json({ error: "必要なデータが不足しています。" });
    }

    const query = `
        INSERT INTO history (word_id, user_id, state, date)
        VALUES (?, ?, ?, ?)
    `;

    db.run(query, [wordId, userId, state, date], (err) => {
        if (err) {
            console.error("履歴保存エラー:", err.message);
            return res.status(500).json({ error: "履歴の保存中にエラーが発生しました。" });
        }
        res.status(201).json({ message: "履歴が正常に保存されました。" });
    });
});

// 間違えた履歴取得エンドポイント
app.get("/history/incorrect", (req, res) => {
    const userId = req.query.userId || 1;
    const date = req.query.date || "1970-01-01";

    if (!userId) {
        return res.status(400).json({ error: "userId is required." });
    }

    const query = `
        SELECT DISTINCT h.word_id, w.word, w.jword, h.date
        FROM history h
        JOIN word w ON h.word_id = w.id
        WHERE h.user_id = ? AND h.state = 2 AND h.date >= ?
        ORDER BY h.date DESC
    `;

    db.all(query, [userId, date], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Failed to fetch data." });
        }

        res.json(
            rows.map((row) => ({
                wordId: row.word_id,
                word: row.word,
                jword: row.jword,
                date: row.date,
            }))
        );
    });
});


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// サーバー起動
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
