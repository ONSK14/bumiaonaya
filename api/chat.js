import { createClient } from '@supabase/supabase-js';

// 连接 Supabase 数据库
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { username, password } = req.body;

    console.log("收到请求:", username, password);

    if (!username || !password) {
        return res.status(400).json({ error: "缺少必要参数 username 或 password" });
    }

    try {
        // **查询 Supabase `users` 表**
        const { data, error } = await supabase
            .from("users")   // **选择 `users` 表**
            .select("*")      // **查询所有字段**
            .eq("username", username)  // **匹配 `username`**
            .eq("password", password)  // **匹配 `password`**
            .single();        // **返回单条记录**

        console.log("Supabase 查询结果:", data, error);

        // **如果查询失败**
        if (error || !data) {
            return res.status(401).json({ error: "用户名或密码错误" });
        }

        return res.status(200).json({ success: true, message: "登录成功", user: data });
    } catch (error) {
        console.error("API 服务器错误:", error);
        return res.status(500).json({ error: error.message });
    }
}
