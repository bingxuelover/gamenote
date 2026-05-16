export default async function handler(req, res) {
  try {
    // 简单的响应，用于测试API路由是否正常工作
    res.status(200).json({ message: "API route is working!" });
  } catch (err) {
    console.error("API Route Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
