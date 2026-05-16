// Supabase 客户端配置
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.GAME_FUN_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || process.env.GAME_FUN_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase configuration");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // 1. 处理获取回复的请求 (GET)
  if (req.method === "GET") {
    try {
      const commentId = req.query.comment_id;

      if (!commentId) {
        return res.status(400).json({ error: "comment_id is required" });
      }

      let query = supabase
        .from("replies")
        .select("*")
        .eq("is_deleted", 0)
        .eq("comment_id", parseInt(commentId))
        .order("created_at", { ascending: true });

      const { data, error } = await query;
      if (error) {
        console.error("GET replies error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ data });
    } catch (err) {
      console.error("GET replies catch error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // 2. 处理提交回复的请求 (POST)
  if (req.method === "POST") {
    try {
      const { comment_id, username, content } = req.body;

      if (
        !comment_id ||
        !username ||
        !username.trim() ||
        !content ||
        !content.trim()
      ) {
        return res
          .status(400)
          .json({ error: "comment_id, username and content are required" });
      }

      const payload = {
        comment_id: parseInt(comment_id),
        username: username.trim(),
        content: content.trim(),
        is_deleted: 0,
      };

      console.log("Inserting reply:", payload);
      const { data, error } = await supabase.from("replies").insert([payload]);

      if (error) {
        console.error("POST reply error:", error);
        return res.status(500).json({ error: error.message });
      }

      console.log("Reply inserted:", data);
      return res
        .status(200)
        .json({ message: "Reply submitted successfully", data });
    } catch (err) {
      console.error("POST reply catch error:", err);
      return res
        .status(400)
        .json({ error: "Request format error", details: err.message });
    }
  }

  // 其他请求方式返回 405
  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
