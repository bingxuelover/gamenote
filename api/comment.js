// 引入 Supabase 的官方 JS 库（实际运行时 vercel link 会自动帮你安装依赖）
import { createClient } from "@supabase/supabase-js";

// 初始化云数据库客户端（建议把密钥放在 Vercel 的环境变量里，这里为了演示直接写）
const supabaseUrl = "GAME_FUN_SUPABASE_URL";
const supabaseKey = "GAME_FUN_GAME_PUBLIC_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // 1. 处理获取留言的请求 (GET)
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("comments") // 你的表名
      .select("*")
      .order("created_at", { ascending: false }); // 按时间倒序

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  }

  // 2. 处理提交留言的请求 (POST)
  if (req.method === "POST") {
    const { content, username } = req.body; // 接收前端传来的留言内容和昵称
    const { data, error } = await supabase
      .from("comments")
      .insert([{ content, username }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: "留言成功", data });
  }

  // 其他请求方式一律返回 405
  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
