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
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("users").select();

      if (error) {
        console.error("GET users error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (err) {
      console.error("GET users catch error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // 其他请求方式返回 405
  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
