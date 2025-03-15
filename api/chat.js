import { createClient } from '@supabase/supabase-js';

// 通过 process.env 访问环境变量
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { username, message } = req.body;

    // 存入 Supabase 数据库
    const { data, error } = await supabase
        .from("messages")
        .insert([{ username, message }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ reply: `收到消息：${message}`, data });
}
