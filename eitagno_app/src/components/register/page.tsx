import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Input } from "../ui/input"; // 必要に応じて適切なパスに修正
import { Button } from "../ui/button"; // 必要に応じて適切なパスに修正

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // エラーメッセージと成功メッセージをリセット
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username: name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "登録に失敗しました。");
      } else {
        setSuccess(data.message || "登録成功！");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      console.error("エラーが発生しました:", err);
      setError("サーバーエラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 背景のグラデーション */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-300 animate-gradient-x"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>

      {/* メインコンテンツ */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white bg-opacity-20 p-8 rounded-xl shadow-lg backdrop-blur-md">
          <Link to="/" className="block mb-8">
            <Home className="w-8 h-8 text-gray-700" />
          </Link>
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            アカウント登録
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="お名前"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white bg-opacity-50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-2 rounded-md hover:from-pink-500 hover:to-purple-600 transition-all duration-300"
            >
              登録
            </Button>
          </form>
          <p className="mt-4 text-center text-gray-800">
            既にアカウントをお持ちの方は{" "}
            <Link to="/login" className="text-pink-600 hover:underline">
              こちら
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
